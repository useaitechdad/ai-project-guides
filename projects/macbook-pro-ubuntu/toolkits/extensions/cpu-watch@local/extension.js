// Copyright 2026 Use AI with Tech Dad
// SPDX-License-Identifier: Apache-2.0

// Modified 2026-11-05: omit project directories and command arguments from the UI.
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');

const REFRESH_SECONDS = 3;
const WARM_C = 80;
const HOT_C = 90;
const PROCESS_ROWS = 4;
const MIN_PROCESS_CPU = 1;
const FAN_DIR = '/sys/devices/platform/applesmc.768';

const TOP_COMMAND = [
    'env', 'LC_ALL=C', 'top', '-b', '-n', '2', '-d', '0.5', '-o', '%CPU', '-w', '150',
];

function readText(path) {
    try {
        const [, bytes] = GLib.file_get_contents(path);
        return new TextDecoder().decode(bytes).trim();
    } catch {
        return null;
    }
}

function findByType(pattern, wanted) {
    for (let i = 0; i < 64; i++) {
        const dir = pattern.replace('N', i);
        if (readText(`${dir}/type`) === wanted)
            return dir;
    }
    return null;
}

function readCpuTimes() {
    const fields = readText('/proc/stat')?.split('\n')[0].trim().split(/\s+/).slice(1).map(Number);
    if (!fields)
        return null;
    const [user, nice, system, idle, iowait, irq, softirq, steal] = fields;
    return {
        busy: user + nice + system + irq + softirq + steal,
        total: user + nice + system + idle + iowait + irq + softirq + steal,
    };
}

function readFan(number) {
    const speed = parseInt(readText(`${FAN_DIR}/fan${number}_input`));
    const max = parseInt(readText(`${FAN_DIR}/fan${number}_max`));
    return Number.isNaN(speed) || Number.isNaN(max) ? null : {speed, max};
}

// top's second sample covers the last half second. Its first covers all uptime.
function parseTop(output) {
    const lines = output.split('\n');
    const header = lines.findLastIndex(line => /^\s*PID\s/.test(line));
    const rows = [];

    for (const line of lines.slice(header + 1)) {
        const fields = line.trim().split(/\s+/);
        if (fields.length < 12)
            continue;

        const cpu = parseFloat(fields[8]);
        const name = fields.slice(11).join(' ');
        if (cpu < MIN_PROCESS_CPU)
            break;
        // Forced idle time, shown on its own row.
        if (name.startsWith('idle_inject'))
            continue;

        const pid = fields[0];
        if (!/^\d+$/.test(pid))
            continue;
        // top may include arguments depending on its saved configuration.
        // Read only the executable's short name; never inspect cwd or cmdline.
        const shortName = readText(`/proc/${pid}/comm`)?.replace(/[\x00-\x1f\x7f]/g, ' ');
        rows.push({pid, cpu, name: shortName || `PID ${pid}`});
        if (rows.length === PROCESS_ROWS)
            break;
    }
    return rows;
}

export default class CpuWatchExtension extends Extension {
    enable() {
        this._cancellable = new Gio.Cancellable();
        this._readingProcesses = false;
        this._heatColor = null;
        this._lastTimes = readCpuTimes();

        this._tempFile = findByType('/sys/class/thermal/thermal_zoneN', 'x86_pkg_temp');
        this._clampFile = findByType('/sys/class/thermal/cooling_deviceN', 'intel_powerclamp');

        this._label = new St.Label({
            text: '…',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._button = new PanelMenu.Button(0.0, 'CPU Watch');
        this._button.add_child(this._label);

        const addRow = () => {
            const item = new PopupMenu.PopupMenuItem('', {reactive: false});
            this._button.menu.addMenuItem(item);
            return item;
        };

        this._tempRow = addRow();
        this._loadRow = addRow();
        this._fanRow = addRow();
        this._clampRow = addRow();
        this._button.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this._processTitle = addRow();
        this._processTitle.label.text = 'Busiest now (100% = one core)';
        this._processRows = Array.from({length: PROCESS_ROWS}, addRow);

        this._button.menu.connect('open-state-changed', (_menu, open) => {
            if (open)
                this._refresh();
        });

        Main.panel.addToStatusArea(this.uuid, this._button, 0, 'right');
        this._refresh();
        this._timeoutId = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT, REFRESH_SECONDS, () => {
                this._refresh();
                return GLib.SOURCE_CONTINUE;
            });
    }

    disable() {
        GLib.source_remove(this._timeoutId);
        this._timeoutId = null;
        this._cancellable.cancel();
        this._cancellable = null;
        this._button.destroy();
        this._button = null;
        this._label = null;
        this._tempRow = null;
        this._loadRow = null;
        this._fanRow = null;
        this._clampRow = null;
        this._processTitle = null;
        this._processRows = null;
    }

    _refresh() {
        const temp = this._readTemp();
        const load = this._readLoad();

        const tempText = temp === null ? '?°' : `${temp}°`;
        const loadText = load === null ? '?%' : `${load}%`;
        this._label.text = `${tempText} ${loadText}`;
        this._setHeatColor(temp);

        if (!this._button.menu.isOpen)
            return;

        this._tempRow.label.text = `CPU temperature: ${temp ?? '?'}°C`;
        this._loadRow.label.text = `CPU in use: ${loadText} of all cores`;
        this._syncFans();
        this._syncClamp();
        this._syncProcesses();
    }

    _readTemp() {
        const milli = parseInt(readText(`${this._tempFile}/temp`));
        return Number.isNaN(milli) ? null : Math.round(milli / 1000);
    }

    _readLoad() {
        const now = readCpuTimes();
        const last = this._lastTimes;
        this._lastTimes = now;

        if (!now || !last || now.total === last.total)
            return null;
        return Math.round(100 * (now.busy - last.busy) / (now.total - last.total));
    }

    _setHeatColor(temp) {
        let heat = null;
        if (temp >= HOT_C)
            heat = '#ff7b63';
        else if (temp >= WARM_C)
            heat = '#f6d32d';

        if (heat !== this._heatColor) {
            this._heatColor = heat;
            this._label.style = heat ? `color: ${heat};` : null;
        }
    }

    // Read only with the menu open: each read is a slow request to the Mac's SMC.
    _syncFans() {
        const fans = [readFan(1), readFan(2)];
        if (fans.includes(null)) {
            this._fanRow.label.text = 'Fans: not available';
            return;
        }

        const speeds = fans.map(fan => fan.speed).join(' / ');
        const percent = Math.round(
            100 * Math.max(...fans.map(fan => fan.speed / fan.max)));
        this._fanRow.label.text = `Fans: ${speeds} rpm (${percent}% of max)`;
    }

    _syncClamp() {
        const clamp = parseInt(readText(`${this._clampFile}/cur_state`));
        this._clampRow.label.text = clamp > 0
            ? `Slowed by heat: yes, ${clamp}% forced idle`
            : 'Slowed by heat: no';
    }

    async _syncProcesses() {
        if (this._readingProcesses)
            return;

        this._readingProcesses = true;
        const cancellable = this._cancellable;
        let rows = [];
        try {
            const proc = Gio.Subprocess.new(TOP_COMMAND, Gio.SubprocessFlags.STDOUT_PIPE);
            const [stdout] = await proc.communicate_utf8_async(null, cancellable);
            rows = parseTop(stdout);
        } catch (e) {
            if (e.matches?.(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED))
                return;
            console.warn(`CPU Watch: ${e.message}`);
        }
        this._readingProcesses = false;

        this._processRows.forEach((item, i) => {
            const row = rows[i];
            item.visible = Boolean(row);
            if (row) {
                item.label.text = `${Math.round(row.cpu)}%  ${row.name}`;
            }
        });
    }
}

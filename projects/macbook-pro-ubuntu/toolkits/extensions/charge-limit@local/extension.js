// Copyright 2026 Use AI with Tech Dad
// SPDX-License-Identifier: Apache-2.0

import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async');

const TOOL = '/usr/local/bin/charge-limit';
const LIMITS = [50, 60, 70, 80, 90, 100];

export default class ChargeLimitExtension extends Extension {
    enable() {
        this._cancellable = new Gio.Cancellable();
        this._busy = false;
        this._limit = null;

        this._label = new St.Label({
            text: 'Max …',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._button = new PanelMenu.Button(0.0, 'Charge Limit');
        this._button.add_child(this._label);

        const title = new PopupMenu.PopupMenuItem('Stop charging at', {
            reactive: false,
        });
        this._button.menu.addMenuItem(title);

        this._items = new Map();
        for (const limit of LIMITS) {
            const item = new PopupMenu.PopupMenuItem(`${limit}%`);
            item.connect('activate', () => this._setLimit(limit));
            this._button.menu.addMenuItem(item);
            this._items.set(limit, item);
        }

        // The limit can also change from the terminal.
        this._button.menu.connect('open-state-changed', (_menu, open) => {
            if (open)
                this._refresh();
        });

        Main.panel.addToStatusArea(this.uuid, this._button, 2, 'right');
        this._refresh();
    }

    disable() {
        this._cancellable.cancel();
        this._cancellable = null;
        this._button.destroy();
        this._button = null;
        this._label = null;
        this._items = null;
    }

    async _run(...args) {
        const proc = Gio.Subprocess.new(
            ['pkexec', TOOL, ...args],
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE);
        const [stdout, stderr] = await proc.communicate_utf8_async(
            null, this._cancellable);

        if (!proc.get_successful())
            throw new Error(stderr.trim() || 'charge-limit failed');
        return stdout.trim();
    }

    async _refresh() {
        if (this._busy)
            return;

        this._busy = true;
        try {
            this._limit = parseInt(await this._run('--get'));
        } catch (e) {
            if (e.matches?.(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED))
                return;
            this._limit = null;
            console.warn(`Charge Limit: ${e.message}`);
        }
        this._busy = false;
        this._sync();
    }

    async _setLimit(limit) {
        if (this._busy)
            return;

        this._busy = true;
        try {
            await this._run(String(limit));
            this._limit = parseInt(await this._run('--get'));
        } catch (e) {
            if (e.matches?.(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED))
                return;
            Main.notifyError('Charge limit not changed', e.message);
        }
        this._busy = false;
        this._sync();
    }

    _sync() {
        const known = Number.isInteger(this._limit);
        this._label.text = known ? `Max ${this._limit}%` : 'Max ?';

        for (const [limit, item] of this._items) {
            item.setOrnament(limit === this._limit
                ? PopupMenu.Ornament.CHECK
                : PopupMenu.Ornament.NONE);
        }
    }
}

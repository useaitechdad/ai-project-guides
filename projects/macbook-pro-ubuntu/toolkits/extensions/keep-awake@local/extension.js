// Copyright 2026 Use AI with Tech Dad
// SPDX-License-Identifier: Apache-2.0

import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

Gio._promisify(Gio.DBusConnection.prototype, 'call');
Gio._promisify(Gio.DBusConnection.prototype, 'call_with_unix_fd_list');

const REASON = 'Keep Awake toggle is on';
const ICON_OFF = 'weather-clear-night-symbolic';
const ICON_ON = 'weather-clear-symbolic';
const STYLE_ON = 'color: #f6d32d;';

// GNOME session manager flag meaning "don't auto-suspend on idle".
const INHIBIT_SUSPEND = 4;

export default class KeepAwakeExtension extends Extension {
    enable() {
        this._cancellable = new Gio.Cancellable();
        this._busy = false;
        this._lock = null;
        this._cookie = null;

        this._icon = new St.Icon({style_class: 'system-status-icon'});
        this._button = new PanelMenu.Button(0.0, 'Keep Awake', true);
        this._button.add_child(this._icon);
        this._button.connect('button-press-event', () => {
            this._toggle();
            return Clutter.EVENT_STOP;
        });
        Main.panel.addToStatusArea(this.uuid, this._button, 1, 'right');

        this._sessionId = Main.sessionMode.connect('updated', () => this._sync());
        this._sync();
    }

    disable() {
        this._cancellable.cancel();
        this._cancellable = null;
        this._release();

        Main.sessionMode.disconnect(this._sessionId);
        this._sessionId = null;
        this._button.destroy();
        this._button = null;
        this._icon = null;
    }

    async _toggle() {
        if (this._busy)
            return;

        if (this._lock) {
            this._release();
            this._sync();
            return;
        }

        this._busy = true;
        try {
            await this._acquire(this._cancellable);
        } catch (e) {
            if (!e.matches?.(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED))
                Main.notifyError('Keep Awake could not turn on', e.message);
        }
        this._busy = false;
        this._sync();
    }

    async _acquire(cancellable) {
        // logind drops this lock when the fd closes, so a shell crash or
        // logout can't leave the laptop stuck awake.
        const [, fdList] = await Gio.DBus.system.call_with_unix_fd_list(
            'org.freedesktop.login1',
            '/org/freedesktop/login1',
            'org.freedesktop.login1.Manager',
            'Inhibit',
            new GLib.Variant('(ssss)',
                ['sleep:handle-lid-switch', 'Keep Awake', REASON, 'block']),
            new GLib.VariantType('(h)'),
            Gio.DBusCallFlags.NONE,
            -1,
            null,
            cancellable);
        const lock = new Gio.UnixInputStream({fd: fdList.steal_fds()[0]});

        if (cancellable.is_cancelled()) {
            lock.close(null);
            return;
        }
        this._lock = lock;

        // Without this GNOME still tries to suspend on idle and fails against
        // the lock above. Not fatal if it's unavailable.
        try {
            const [cookie] = (await Gio.DBus.session.call(
                'org.gnome.SessionManager',
                '/org/gnome/SessionManager',
                'org.gnome.SessionManager',
                'Inhibit',
                new GLib.Variant('(susu)',
                    ['keep-awake', 0, REASON, INHIBIT_SUSPEND]),
                new GLib.VariantType('(u)'),
                Gio.DBusCallFlags.NONE,
                -1,
                cancellable)).deepUnpack();

            if (cancellable.is_cancelled())
                this._uninhibit(cookie);
            else
                this._cookie = cookie;
        } catch (e) {
            console.warn(`Keep Awake: session inhibit failed: ${e.message}`);
        }
    }

    _release() {
        this._lock?.close(null);
        this._lock = null;

        if (this._cookie !== null) {
            this._uninhibit(this._cookie);
            this._cookie = null;
        }
    }

    _uninhibit(cookie) {
        Gio.DBus.session.call(
            'org.gnome.SessionManager',
            '/org/gnome/SessionManager',
            'org.gnome.SessionManager',
            'Uninhibit',
            new GLib.Variant('(u)', [cookie]),
            null,
            Gio.DBusCallFlags.NONE,
            -1,
            null,
            null);
    }

    _sync() {
        if (!this._button)
            return;

        const on = this._lock !== null;
        this._icon.icon_name = on ? ICON_ON : ICON_OFF;
        this._icon.style = on ? STYLE_ON : null;

        // Keep running while locked, but don't let the lock screen toggle it.
        this._button.visible = !Main.sessionMode.isLocked;
    }
}

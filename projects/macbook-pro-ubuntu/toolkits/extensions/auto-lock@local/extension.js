// Copyright 2026 Use AI with Tech Dad
// SPDX-License-Identifier: Apache-2.0

import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

const KEY = 'lock-enabled';
const ICON_ON = 'system-lock-screen-symbolic';
const ICON_OFF = 'changes-allow-symbolic';
const STYLE_OFF = 'color: #f6d32d;';

export default class AutoLockExtension extends Extension {
    enable() {
        // Same key as Settings > Privacy & Security > Screen Lock, so the
        // two always agree.
        this._settings = new Gio.Settings({schema_id: 'org.gnome.desktop.screensaver'});

        this._icon = new St.Icon({style_class: 'system-status-icon'});
        this._button = new PanelMenu.Button(0.0, 'Auto Lock', true);
        this._button.add_child(this._icon);
        this._button.connect('button-press-event', () => {
            this._settings.set_boolean(KEY, !this._settings.get_boolean(KEY));
            return Clutter.EVENT_STOP;
        });
        Main.panel.addToStatusArea(this.uuid, this._button, 1, 'right');

        this._changedId = this._settings.connect(`changed::${KEY}`, () => this._sync());
        this._sync();
    }

    disable() {
        this._settings.disconnect(this._changedId);
        this._settings = null;
        this._button.destroy();
        this._button = null;
        this._icon = null;
    }

    _sync() {
        const on = this._settings.get_boolean(KEY);
        this._icon.icon_name = on ? ICON_ON : ICON_OFF;
        // Highlight the unusual state: auto lock off.
        this._icon.style = on ? null : STYLE_OFF;
        this._button.accessible_name = on ? 'Auto lock: on' : 'Auto lock: off';
    }
}

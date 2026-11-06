// Copyright 2026 Use AI with Tech Dad
// SPDX-License-Identifier: Apache-2.0

import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

const REFRESH_SECONDS = 60;
const GIB = 1024 ** 3;

export default class DiskFreeExtension extends Extension {
    enable() {
        this._cancellable = new Gio.Cancellable();
        this._root = Gio.File.new_for_path('/');

        this._button = new PanelMenu.Button(0.0, 'Disk Free', true);
        this._label = new St.Label({
            text: '…',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._button.add_child(this._label);
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
        this._root = null;
    }

    _refresh() {
        const label = this._label;
        this._root.query_filesystem_info_async(
            'filesystem::free', GLib.PRIORITY_DEFAULT, this._cancellable,
            (file, result) => {
                try {
                    const info = file.query_filesystem_info_finish(result);
                    const free = info.get_attribute_uint64('filesystem::free');
                    label.text = `${Math.floor(free / GIB)}G`;
                } catch (e) {
                    if (!e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED))
                        label.text = '?';
                }
            });
    }
}

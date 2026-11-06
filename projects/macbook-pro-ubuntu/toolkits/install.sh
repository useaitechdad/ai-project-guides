#!/usr/bin/env bash
# Copyright 2026 Use AI with Tech Dad
# SPDX-License-Identifier: Apache-2.0

# Modified 2026-11-05: document optional Wi-Fi configuration and quote paths.
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_DST="$HOME/.local/share/gnome-shell/extensions"

echo "=== Installing GNOME Shell Extensions ==="
mkdir -p "$EXT_DST"
for ext in "$REPO_DIR"/extensions/*/; do
    ext_name=$(basename "$ext")
    echo "Installing extension: $ext_name"
    rm -rf "$EXT_DST/$ext_name"
    cp -r "$ext" "$EXT_DST/$ext_name"
done

echo ""
echo "=== Installing charge-limit script & polkit rule ==="
if [ -d "$REPO_DIR/scripts/charge-limit" ]; then
    echo "To install charge-limit system-wide (requires sudo):"
    printf '  sudo cp %q /usr/local/bin/\n' "$REPO_DIR/scripts/charge-limit/charge-limit"
    echo "  sudo chmod 755 /usr/local/bin/charge-limit"
    if [ -f "$REPO_DIR/scripts/charge-limit/local.charge-limit.policy" ]; then
        printf '  sudo cp %q /usr/share/polkit-1/actions/\n' "$REPO_DIR/scripts/charge-limit/local.charge-limit.policy"
    fi
fi

echo ""
echo "=== Installing wifi-watchdog ==="
if [ -d "$REPO_DIR/scripts/wifi-watchdog" ]; then
    echo "To install wifi-watchdog service (requires sudo):"
    printf '  sudo cp %q /usr/local/bin/\n' "$REPO_DIR/scripts/wifi-watchdog/wifi-watchdog"
    echo "  sudo chmod 755 /usr/local/bin/wifi-watchdog"
    printf '  sudo cp %q /etc/systemd/system/\n' "$REPO_DIR/scripts/wifi-watchdog/wifi-watchdog.service"
    echo "Before starting: follow SETUP.md to discover your Wi-Fi interface and configure the service override."
    echo "  sudo systemctl daemon-reload && sudo systemctl enable --now wifi-watchdog"
    echo "Optional: disable NetworkManager Wi-Fi power saving:"
    printf '  sudo cp %q /etc/NetworkManager/conf.d/\n' "$REPO_DIR/scripts/wifi-watchdog/zz-wifi-powersave-off.conf"
    echo "Apply on your next reboot; reconnecting Wi-Fi can interrupt SSH."
fi

echo ""
echo "=== Installing SSD udev rule ==="
if [ -f "$REPO_DIR/udev/90-ssd-link-power.rules" ]; then
    echo "To install SSD PCIe power-saving fix (requires sudo):"
    printf '  sudo cp %q /etc/udev/rules.d/\n' "$REPO_DIR/udev/90-ssd-link-power.rules"
    echo "  sudo udevadm control --reload"
fi

echo ""
echo "Done! Please log out and back in to GNOME Shell for extensions to take effect."
echo "Read SETUP.md for parameter choices, verification and removal instructions."

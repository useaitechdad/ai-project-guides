# MacBook Linux Toolkit (Reborn MacBook)

Release preparation updated 2026-11-05: privacy defaults and installation instructions.

A collection of lightweight GNOME extensions, scripts, and udev rules created to turn an Intel MacBook Pro (Late 2013 Retina, 15") running Ubuntu 24.04 into a quiet, 24/7 unattended AI coding workstation and agent director.

Presented on YouTube by **useaitechdad**!

**Start with [SETUP.md](SETUP.md)** for prerequisites, the settings to choose, complete installation commands, verification and troubleshooting. Run the commands on the Ubuntu laptop, not on macOS or a separate PC.

---

## What's Included

### 1. GNOME Shell Extensions (`extensions/`)
- **`keep-awake@local`**: Top-bar toggle (moon to yellow sun) that prevents the laptop from sleeping on idle battery or when the lid is closed. Persists through screen lock and releases cleanly on logout.
- **`auto-lock@local`**: One-click top-bar toggle to turn GNOME screen lock on or off without opening system settings.
- **`cpu-watch@local`**: Top-bar CPU temperature and load gauge (`92° 81%`), turning yellow at 80°C and red at 90°C. Clicking reveals fan speeds (from `applesmc`), throttling state, and busy processes. It displays short executable names, with no project directories or command arguments.
- **`charge-limit@local`**: Top-bar dropdown to set the battery charge limit (50%, 60%, 70%, 80%, 90%, 100%) to reduce time at full charge during mostly plugged-in use. This does not prevent all battery aging or establish a measured lifespan improvement.
- **`disk-free@local`**: Minimal top-bar SSD free-space monitor.

### 2. Scripts & Background Services (`scripts/`)
- **`charge-limit/`**: Python CLI that communicates directly with Apple's SMC `BCLM` key through `/dev/port`, paired with a polkit policy. This is hardware-specific privileged access; review the code before enabling it on another machine.
- **`wifi-watchdog/`**: Systemd service that pings the gateway and public internet addresses every 15 seconds and attempts to recover a stalled connection by toggling Wi-Fi. Recovery interrupts the connection. Logs contain status summaries, without raw network identifiers or kernel-log excerpts.

### 3. Hardware Rules (`udev/`)
- **`90-ssd-link-power.rules`**: Disables selected PCIe power-saving settings on the Samsung controller IDs specified in the rule. It was used for a controller-hang issue in this setup; it is not a universal SSD fix.

---

## Installation

```bash
git clone https://github.com/useaitechdad/ai-project-guides.git
cd ai-project-guides/projects/macbook-pro-ubuntu/toolkits
bash install.sh
```

Run the installer as your normal desktop user. It copies the five extensions into your user's GNOME extension directory, replacing copies with the same IDs. It prints the optional privileged installation commands; it does not execute them. Review and run only the commands for tools you want.

Log out and back in to register the extensions, then enable the desired ones with the GNOME Extensions app or `gnome-extensions enable UUID` (for example, `gnome-extensions enable keep-awake@local`). The extensions declare their supported Shell versions in their `metadata.json` files.

The Wi-Fi watchdog defaults to interface `wlp2s0`. Set `WIFI_WATCHDOG_IFACE` in a systemd service override if your interface differs. The installer also prints the optional command to install `zz-wifi-powersave-off.conf` under `/etc/NetworkManager/conf.d/`. Apply that setting on your next reboot; reconnecting Wi-Fi can interrupt SSH.

Configure the interface **before starting the watchdog**. [SETUP.md](SETUP.md) includes the exact override, explains all three supported environment variables, and covers ZIP downloads as well as Git clones.

This toolkit originated on a Late 2013 Intel MacBook Pro with Ubuntu 24.04. Hardware interfaces, fan sensors and charge-limit support vary. The privacy changes in this release have static and isolated mocked checks; they have not yet been retested in a live Ubuntu GNOME session.

## Privacy

The release contains source code, generic configuration and instructions only. It includes no personal diagnostic logs, screenshots, private notes, project data or original Git history.

CPU Watch reads short executable names from `/proc/PID/comm`; it does not read working directories or command arguments. A custom executable name can itself be private, so review the menu before recording or sharing your screen.

Wi-Fi Watchdog logs fixed status summaries. It does not log gateway addresses, SSIDs, MAC addresses, raw command errors or kernel messages. Systemd can add host metadata around journal messages; `journalctl -u wifi-watchdog -o cat` shows message text. Review any diagnostic output before sharing it. The watchdog sends connectivity probes to public resolvers and performs a DNS lookup of `example.com`; no diagnostic logs are uploaded by this script.

## Removal

Disable unwanted extensions in the GNOME Extensions app, then remove only their corresponding UUID directories under `~/.local/share/gnome-shell/extensions/` if you want to uninstall them.

If you installed Wi-Fi Watchdog system-wide, first run `sudo systemctl disable --now wifi-watchdog`. Remove only the files you installed: `/usr/local/bin/wifi-watchdog`, `/etc/systemd/system/wifi-watchdog.service`, and optionally `/etc/NetworkManager/conf.d/zz-wifi-powersave-off.conf`. Run `sudo systemctl daemon-reload`; reboot to apply removal of the NetworkManager setting.

Before removing Charge Limit, set the desired charging limit (for example, `sudo charge-limit 100` to restore full charging), then remove its installed `/usr/local/bin/charge-limit` and `/usr/share/polkit-1/actions/local.charge-limit.policy` files. Removing files alone does not reset the hardware limit.

If you installed the SSD rule, remove `/etc/udev/rules.d/90-ssd-link-power.rules` and reboot. Preserve any pre-existing files or custom settings you had before installing this toolkit.

---

## License

Copyright 2026 Use AI with Tech Dad

SPDX-License-Identifier: Apache-2.0

This toolkit remains under Apache License 2.0. See [LICENSE](LICENSE). Its inclusion in AI Project Guides does not change the toolkit's license to the parent repository's MIT license. Modified source files carry dated change notices.

This notice also covers the accompanying JSON metadata and setup documentation. The example placeholders in the standard license appendix are part of Apache's unmodified license text.

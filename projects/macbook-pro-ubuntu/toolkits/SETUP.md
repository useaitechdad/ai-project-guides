# Set up your MacBook Linux Toolkit

These instructions are for the Ubuntu laptop where the tools will run. Start with one tool and verify it before enabling the next. No API keys, Wi-Fi passwords, personal account names or project paths are needed in toolkit configuration.

## 1. Choose what you need

| Tool | What you must choose | Default / normal use |
| --- | --- | --- |
| Keep Awake | Turn the top-bar toggle on when a task must continue | Starts off each time the extension is enabled; yellow sun means on |
| Auto Lock | Whether the screen should lock automatically | Uses your existing GNOME Screen Lock setting; normally leave locking on |
| CPU Watch | Nothing for the original supported hardware | Updates every 3 seconds; optional source settings below |
| Disk Free | Nothing if you want to monitor `/` | Shows free space on the root filesystem every 60 seconds |
| Charge Limit | The desired battery charging ceiling | Choose from the menu; installing does not set a new limit |
| Wi-Fi Watchdog | Your actual Wi-Fi interface name | Check it; do not assume the example `wlp2s0` matches your laptop |
| Wi-Fi power-saving configuration | Whether to disable power saving | Optional, separate from the watchdog |
| SSD power-saving rule | Whether your exact controller and symptoms match | Skip unless you have a reason to use this hardware-specific workaround |

Keep Awake and Auto Lock are separate: an AI task can continue while the screen is locked. You do not need to disable screen locking for unattended work.

## 2. Check the prerequisites

The original environment was a Late 2013 Intel MacBook Pro running Ubuntu 24.04 with GNOME Shell 46. Every included extension currently declares **Shell 46 only**. Do not bypass the version check just to install it on another release.

Run:

```bash
gnome-shell --version
gnome-extensions version
```

The extensions require a logged-in GNOME desktop session. They are not standalone background services for a machine with no desktop session. Charge Limit and Wi-Fi Watchdog can be used separately from the extensions.

Required commands by component:

| Component | Commands / services required |
| --- | --- |
| Extension installer | `bash`, `mkdir`, `cp`, `rm`, `basename`; GNOME Shell and `gnome-extensions` |
| CPU Watch | `top` from procps, Linux `/proc`, applicable thermal/Apple SMC sensor files |
| Charge Limit | `python3`, `sudo`, `modprobe`, `systemctl`, applesmc driver and supported `BCLM` key; `pkexec` and a polkit desktop agent for the menu |
| Wi-Fi Watchdog | `bash`, `nmcli`, `ip`, `ping`, `timeout`, `getent`, `awk`, `grep`, `head`, `sleep`; running NetworkManager and systemd |
| SSD rule | `lspci` for identification; udev |

For example, check the watchdog commands without changing the machine:

```bash
for tool in nmcli ip ping timeout getent awk grep head sleep systemctl; do
    command -v "$tool" >/dev/null || printf 'Missing command: %s\n' "$tool"
done
systemctl is-active NetworkManager
```

An empty missing-command list and `active` are the expected results. If a command is missing, install its package from your Ubuntu release's repositories before proceeding. The toolkit installer does not install dependencies.

## 3. Open the downloaded toolkit folder

For a Git clone:

```bash
git clone https://github.com/useaitechdad/ai-project-guides.git
cd ai-project-guides/projects/macbook-pro-ubuntu/toolkits
```

For a GitHub ZIP download, extract it and open `projects/macbook-pro-ubuntu/toolkits` inside the extracted repository. Use your file manager's **Open in Terminal** action there. For a standalone toolkit ZIP, open the extracted folder that contains `install.sh` and this guide. You do not need to clone again.

The following command should list `README.md`, `SETUP.md`, `install.sh`, `extensions`, `scripts` and `udev` among the files:

```bash
ls
```

All relative paths below start in this toolkit folder. Keep any existing versions of tools or configuration files you have customized before replacing them.

## 4. Install and enable the GNOME extensions

```bash
bash install.sh
```

Run this as your normal desktop user, **without sudo**. It copies all five extensions into your user's extension folder, replacing directories with the same extension IDs. It only prints the privileged commands for the optional scripts and rules; it does not execute those commands. Use the ordered steps below for the components you choose, rather than pasting all printed commands at once.

Log out and back in. Enable only the extensions you want, either in GNOME's Extensions app or with the corresponding command:

```bash
gnome-extensions enable keep-awake@local
gnome-extensions enable auto-lock@local
gnome-extensions enable cpu-watch@local
gnome-extensions enable disk-free@local
```

Enable `charge-limit@local` after installing and checking its helper in section 5. To inspect an extension or turn it off:

```bash
gnome-extensions info keep-awake@local
gnome-extensions disable keep-awake@local
```

### Keep Awake

Click the moon to turn it into a yellow sun. It blocks suspend while enabled, including the lid-switch action, and remains active through screen lock. It releases its inhibitors when disabled or logged out; turn it on again after logging in. It does not guarantee an AI agent survives logout, shutdown, a network failure or the agent's own errors.

Verify with a harmless long-running task: turn Keep Awake on, lock the screen, close the lid for 15 minutes, then check that the task continued. Keep the laptop ventilated during closed-lid use. Click the sun to release Keep Awake when finished.

### Auto Lock

The lock icon reflects GNOME's existing automatic screen-lock setting. Yellow means automatic locking is off. Turn it on again when finished if you disabled it. Disabling the extension removes the toggle but does not restore a previous screen-lock setting; use GNOME Settings to check it.

### CPU Watch and Disk Free

CPU Watch shows temperature and aggregate CPU usage. Its process rows use `100%` for one CPU core, so a process may exceed `100%`. Missing sensor values can appear as `?` or unavailable; the thermal-clamp indicator only reflects the specific kernel sensor it reads, not every possible throttling condition.

Disk Free monitors `/`. If your home directory is on a separate filesystem, its free space may differ from this display; see the advanced settings below.

## 5. Install Charge Limit and choose a ceiling

This helper is specific to supported Intel Mac SMC hardware. It temporarily unloads and reloads the applesmc driver when writing a limit. Do not change the SMC key, port addresses or support checks to force an unsupported machine to work.

From the toolkit folder:

```bash
sudo install -m 0755 scripts/charge-limit/charge-limit /usr/local/bin/charge-limit
sudo charge-limit --get
```

The read command should print the current numeric limit. If it fails, stop here and resolve the support error before attempting a write. A read of the current value is not proof that writing will succeed.

| Setting | Values | How to change |
| --- | --- | --- |
| Menu choices | 50, 60, 70, 80, 90, 100 percent | Choose in the top-bar menu |
| CLI ceiling | Integer 20–100, without `%` | `sudo charge-limit 60` sets 60 percent |
| Mostly plugged-in example | 60 percent | The video author's preference; choose for your own needs |
| Restore full charging | 100 percent | `sudo charge-limit 100` |

Example: choose 60 and read it back:

```bash
sudo charge-limit 60
sudo charge-limit --get
sudo charge-limit
```

Expect the second command to return `60`; the last command also shows battery status. This changes the ceiling, not the current charge level. If the battery is already above the ceiling, do not expect its displayed percentage to fall immediately. Recheck after a restart on your machine; the helper stores the setting in the SMC, and a full SMC reset can clear it.

For the GNOME menu, install the supplied policy and enable the extension:

```bash
sudo install -m 0644 scripts/charge-limit/local.charge-limit.policy /usr/share/polkit-1/actions/local.charge-limit.policy
gnome-extensions enable charge-limit@local
```

The policy allows an active local desktop session to run the exact `/usr/local/bin/charge-limit` helper through `pkexec` without a password prompt; inactive and non-local sessions are denied by this policy. If you prefer to approve every CLI operation with sudo, omit the policy and menu and use the CLI instead. Keep the installed helper root-owned and not writable by ordinary users. Install it at the documented path; the extension and policy both refer to that exact path.

## 6. Configure Wi-Fi Watchdog before starting it

Connect to Wi-Fi normally in Ubuntu first. Discover the device name without listing connection names:

```bash
LC_ALL=C nmcli -f DEVICE,TYPE,STATE device status
```

Use the `DEVICE` value on your connected `wifi` row, such as `wlp2s0` or `wlan0`. This is the adapter name, **not** the Wi-Fi network name or password. [NetworkManager documents device status and field selection here](https://networkmanager.dev/docs/api/latest/nmcli.html).

Install the files, but do not start the service yet:

```bash
sudo install -m 0755 scripts/wifi-watchdog/wifi-watchdog /usr/local/bin/wifi-watchdog
sudo install -m 0644 scripts/wifi-watchdog/wifi-watchdog.service /etc/systemd/system/wifi-watchdog.service
sudo systemctl daemon-reload
sudo systemctl edit wifi-watchdog.service
```

In the editor, add the following above the line marking where edits will be discarded. Replace `wlp2s0` with the device name you just found. Save and close the editor:

```ini
[Service]
Environment="WIFI_WATCHDOG_IFACE=wlp2s0"
Environment="WIFI_WATCHDOG_INTERVAL=15"
Environment="WIFI_WATCHDOG_COOLDOWN=300"
Environment="LC_ALL=C"
```

The locale line keeps the NetworkManager status values in the English form expected by the script. These settings belong in the service override, not in your interactive shell profile. `systemctl edit` creates a service drop-in; [`Environment=` supplies its process settings](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#Environment=).

| Supported environment variable | Default | What to enter |
| --- | --- | --- |
| `WIFI_WATCHDOG_IFACE` | `wlp2s0` | Your connected Wi-Fi device name; required to check |
| `WIFI_WATCHDOG_INTERVAL` | `15` | Positive whole seconds between check cycles; keep 15 initially |
| `WIFI_WATCHDOG_COOLDOWN` | `300` | Positive whole seconds between recovery attempts; keep 300 initially |

Use plain positive decimal integers, with no units, leading zeros, signs or fractions. These values are not automatically validated by the script. A check can itself take several seconds, so the interval is not an exact sampling period. Recovery starts after three failed check cycles, subject to the cooldown; it waits up to 45 seconds for reconnection. These last two values are source constants, not environment settings.

Now start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now wifi-watchdog.service
systemctl is-active wifi-watchdog.service
sudo journalctl -u wifi-watchdog.service -n 20 --no-pager -o cat
```

Expect `active` and `started: monitoring Wi-Fi`. Healthy operation is quiet. Service activity alone does not prove the adapter name is correct: check the device row again. The watchdog intentionally does nothing when Wi-Fi is disabled, disconnected, or not the first default route. It only handles IPv4 connectivity in this version.

The script checks the detected gateway and either of the public probe addresses `1.1.1.1` and `8.8.8.8`. It needs successful ping replies from both the gateway and at least one public probe. Networks that block ICMP can cause false recovery attempts; stop the service on such a network until you adapt and test its probe logic. No router address, SSID or password belongs in the override.

For later changes, edit the override again, then run:

```bash
sudo systemctl daemon-reload
sudo systemctl restart wifi-watchdog.service
```

To stop monitoring and prevent automatic startup:

```bash
sudo systemctl disable --now wifi-watchdog.service
```

The service can toggle the Wi-Fi radio, interrupting SSH and other connections. Configure and test it with access to the laptop's local screen. See the official [`systemctl` reference](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html) for service controls and overrides.

### Optional: disable Wi-Fi power saving

This is separate from starting the watchdog:

```bash
sudo install -m 0644 scripts/wifi-watchdog/zz-wifi-powersave-off.conf /etc/NetworkManager/conf.d/zz-wifi-powersave-off.conf
```

The file sets `wifi.powersave = 2` as a NetworkManager connection default. [NetworkManager defines 2 as disabled](https://networkmanager.dev/docs/api/latest/settings-802-11-wireless.html). A connection profile with an explicit setting can override a default. Reboot when convenient to apply it; do not restart networking during an important SSH session. No adapter name or network password needs to be added to this file.

## 7. Optional SSD rule

Check the controller locally:

```bash
lspci -nn
```

The supplied rule matches PCI vendor/device **144d:1600** only and writes `link/l1_aspm` and `link/clkpm`. Skip this rule unless that controller matches and you are investigating the relevant controller-hang problem. Do not replace those IDs with unrelated hardware IDs to force a match.

If applicable, from the toolkit folder:

```bash
sudo install -m 0644 udev/90-ssd-link-power.rules /etc/udev/rules.d/90-ssd-link-power.rules
sudo udevadm control --reload
```

Reboot when convenient; reloading rules alone does not prove the settings have changed on an existing device. This is a specific workaround, not a performance setting everyone needs.

## 8. Advanced source settings

There is no preferences window or `.env` configuration loader for these values. Edit the indicated source **before** installing, then reinstall and log out/back in for extension changes. Keep your own changes separately because reinstalling replaces the extension copies. Most users should leave these values alone.

| Source file | Constant / expression | Shipped value | Meaning |
| --- | --- | --- | --- |
| `extensions/cpu-watch@local/extension.js` | `REFRESH_SECONDS` | `3` | Update interval in whole seconds |
| Same | `WARM_C`, `HOT_C` | `80`, `90` | Display colors in °C; these do not control fans or cooling |
| Same | `PROCESS_ROWS`, `MIN_PROCESS_CPU` | `4`, `1` | Maximum process rows; minimum CPU percentage shown |
| Same | `FAN_DIR` | `/sys/devices/platform/applesmc.768` | Hardware-specific sensor directory; leave unchanged unless you have verified the matching sensor files |
| `extensions/disk-free@local/extension.js` | `REFRESH_SECONDS` | `60` | Update interval in whole seconds |
| Same | `Gio.File.new_for_path('/')` | `/` | Filesystem to monitor; change to an existing mount point if needed |
| `extensions/charge-limit@local/extension.js` | `LIMITS` | `[50, 60, 70, 80, 90, 100]` | Menu choices; keep integers within the helper's 20–100 range |
| `scripts/wifi-watchdog/wifi-watchdog` | `FAILS_BEFORE_RECOVERY` | `3` | Failed check cycles before recovery |
| Same | `RECOVERY_WAIT` | `45` | Recovery wait window in seconds |
| Same | `INTERNET_HOSTS` | `(1.1.1.1 8.8.8.8)` | Public ping probes; change only if you understand and test the network policy |

Keep CPU temperature thresholds ordered (`WARM_C < HOT_C`), row counts and intervals positive, and paths valid. The thermal source types (`x86_pkg_temp`, `intel_powerclamp`) are detected from sysfs; changing display thresholds does not add support for a different sensor. SMC ports, command values and keys are hardware implementation constants, not user parameters.

## 9. Troubleshooting and removal

| Symptom | Check / next action |
| --- | --- |
| Extension not found | Confirm installation ran as your desktop user, then log out/back in and run `gnome-extensions list` |
| Extension incompatible | Check `gnome-shell --version`; this package declares 46 only |
| Lid still suspends | Check that Keep Awake shows the sun and did not report an inhibitor error; it resets after logout |
| Screen no longer auto-locks | Turn Auto Lock on or restore GNOME's Screen Lock setting |
| Charge menu shows `Max ?` | Run `sudo charge-limit --get` locally; check helper/policy paths and permissions |
| Charge helper reports missing SMC/BCLM | Stop; verify hardware and driver support instead of editing out the checks |
| CPU sensors show unavailable | Sensor support/path may differ; this does not necessarily mean zero temperature or no throttling |
| Disk space differs from your home folder | The extension monitors `/`; check whether home is a separate filesystem |
| Watchdog active but never reacts | Check the interface override, connected state, IPv4 default route and NetworkManager status |
| Watchdog repeatedly reconnects | Stop it; check whether gateway/public ICMP replies are blocked or whether the network itself is down |

For removal, follow [README.md → Removal](README.md#removal). Also remove only the watchdog settings you added in `/etc/systemd/system/wifi-watchdog.service.d/override.conf`, preserving any pre-existing overrides, then run `sudo systemctl daemon-reload`. Removing the Charge Limit files does not reset the stored ceiling; restore the desired limit first.

Privacy fixes have passed static checks and mocked tests. The edited package still needs live Ubuntu GNOME/hardware validation. Keep diagnostic output private unless you have inspected it: systemd metadata, custom executable names and your own added settings can identify your machine or work.

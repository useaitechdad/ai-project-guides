# MacBook → Ubuntu: steps and commands

Read [SPEC.md](SPEC.md) first. Commands below are instructions for the reader, not an unattended installation script. Replace placeholders only after checking actual values.

## 1. Back up and verify

Check every user profile, including required projects, hidden configuration, browser data and keys. Copy required data to a separate computer or backup drive. Keep the backup separate from the installer USB.

Resolve transfer errors and inaccessible accounts. Compare source and destination folders and open representative files from each account at the destination. An SSH login may not reach every account or protected folder, even with `sudo`. If a folder is inaccessible, sign in to that account on the OLD MAC and back it up from there. Do not erase until required data is recoverable.

## 2. Connect to the still-working Mac

**OLD MAC, macOS GUI:** System Preferences → Sharing → Remote Login. Allow only the required account on your trusted network.

**CONTROL MAC, local terminal:**

```bash
ssh USERNAME@OLD_MAC_IP
```

`USERNAME` and `OLD_MAC_IP` are placeholders. Verify the SSH host identity when connecting. After connecting, the shell runs on the OLD MAC. The next download and USB commands run there. Plug the USB into the OLD MAC.

You can instead use the OLD MAC's local terminal for the same preparation.

## 3. Download and check the installer

**OLD MAC, macOS terminal:** Obtain the current official Ubuntu 24.04 Desktop **amd64** image URL and matching `SHA256SUMS` from [Ubuntu releases](https://releases.ubuntu.com/24.04/). This is an Intel Mac, so do not choose an ARM image.

In a writable working directory:

```bash
curl -fL "OFFICIAL_ISO_URL" -o ubuntu-24.04.iso
shasum -a 256 ubuntu-24.04.iso
```

Replace `OFFICIAL_ISO_URL`. Compare the entire result with the checksum for the exact downloaded image. The local filename does not identify its point release. Stop on a mismatch or incomplete download.

## 4. Identify and flash the USB

**OLD MAC, macOS terminal:** Eject and unplug every other external drive, including your backup, so the installer USB is the only external disk listed. Flashing erases the selected USB. An 8 GB+ stick is the starting requirement; 16 GB was used. Confirm your image fits and the USB has no needed data.

```bash
diskutil list external physical
diskutil info /dev/diskN
```

`N` is a placeholder for the confirmed external USB. Match its capacity and identity, and recheck after reconnecting devices. Do not select the internal drive or assume a disk number.

**Only after confirming the exact USB target:**

```bash
diskutil unmountDisk /dev/diskN
sudo dd if=ubuntu-24.04.iso of=/dev/rdiskN bs=4m
```

These are macOS commands. The write can be silent; wait for successful completion. Stop and investigate any error. Then:

```bash
sync
diskutil eject /dev/diskN
```

If macOS calls the completed installer unreadable, choose Ignore; do not initialize or reformat it. [Ubuntu's USB creation guidance](https://ubuntu.com/desktop/docs/en/latest/how-to/create-a-bootable-usb-stick/) describes other preparation methods.

## 5. Install Ubuntu

**OLD MAC, at the keyboard:** Restart while holding Option and select EFI Boot. Choose language and keyboard, and enable the third-party software option where offered.

Confirm the verified backup and intended internal target before selecting “Erase disk and install Ubuntu.” This removes macOS and its local Recovery. One way to reinstall macOS later is [Internet Recovery](https://support.apple.com/en-us/102518): hold Option-Command-R at startup and connect to the internet. Your backup is needed to restore your own data. Complete the Ubuntu installer, remove the USB when prompted, restart and sign in.

Keep the installer USB and backup available for recovery. The machine is now the UBUNTU MAC.

## 6. Get online and fix Wi-Fi if needed

**UBUNTU MAC:** If Wi-Fi is unavailable, connect to a router through a compatible Ethernet adapter, or use iPhone Personal Hotspot over USB. The owner used the iPhone route: enable Personal Hotspot, connect the cable and approve Trust if prompted. Linux/iPhone compatibility depends on the setup; use wired Ethernet if this route does not work.

For the example's Broadcom BCM4360, run `sudo apt update` in the UBUNTU MAC terminal while connected to temporary internet. A suggested installation route is **Software & Updates → Additional Drivers**: select the recommended Broadcom option if offered, apply it and restart. If no option appears or installation fails, keep the temporary connection and diagnose before proceeding. The recorded result is the working `wl` driver; the exact original installation method was not recorded. Join your network and load a page.

Read-only inspection in the Ubuntu terminal:

```bash
lspci -nnk
```

Find the network controller and its driver. The example reports `wl` for BCM4360. Different chipsets require their own diagnosis.

If an update breaks networking, preserve your installer and temporary connection. If available, select a previously working kernel through GRUB's Advanced options while diagnosing; do not assume a particular kernel is installed.

## 7. Update the installed Ubuntu release

Once the desktop and network work, open **Software Updater** and install available updates. Or, **in the UBUNTU MAC terminal**:

```bash
sudo apt update && sudo apt upgrade
```

Review the proposed package changes and confirm them if appropriate. If a restart is required, save your work and run:

```bash
sudo reboot
```

Recheck Wi-Fi, audio, graphics, brightness and lid wake. These commands update packages for the installed release. See [Ubuntu package management](https://ubuntu.com/server/docs/how-to/software/package-management/).

## 8. Optional terminal and AI tools

**UBUNTU MAC terminal:** The Ghostty package used in the example was installed with:

```bash
sudo snap install --classic ghostty
```

Review the Snap publisher/package and classic confinement before installing. Launch Ghostty from the application menu.

For Claude Code, follow the current [official quickstart](https://code.claude.com/docs/en/quickstart) for Linux installation and account requirements. An eligible subscription or paid API access is required. After installation, open a new terminal:

```bash
claude --version
cd /path/to/your/project
claude
```

Replace the directory with a project you intend the agent to access. Complete sign-in yourself; do not share tokens. Cloud model inference does not move local builds and tests off the laptop.

## 9. Optional familiar Command shortcuts

**UBUNTU MAC, terminal inside the logged-in graphical desktop:** Save the output of all three commands in a private local note before changing settings:

```bash
gsettings get org.gnome.desktop.input-sources xkb-options
gsettings get org.gnome.shell.keybindings toggle-overview
gsettings get org.gnome.desktop.wm.keybindings switch-input-source
```

If the XKB list is empty (`@as []`), this swaps the left Command and Control roles:

```bash
gsettings set org.gnome.desktop.input-sources xkb-options "['ctrl:swap_lwin_lctl']"
```

If the list already contains options, preserve them when adding the swap; resolve conflicting modifier options first. Do not replace an existing list blindly.

Physical left Command now sends Control; physical left Control sends Super. Desktop Cmd+C/Cmd+V use copy/paste. Cmd+Tab now sends Ctrl+Tab, commonly switching tabs rather than applications.

For GNOME overview search:

```bash
gsettings set org.gnome.shell.keybindings toggle-overview "['<Control>space', '<Super>space']"
gsettings set org.gnome.desktop.wm.keybindings switch-input-source "['XF86Keyboard']"
```

Test left Cmd+Space, type an app name and press Enter. This changes the language-switch shortcut; set a usable replacement if you use multiple layouts. Global Ctrl+Space can also conflict with editors.

Undo with `gsettings set` for the same schema/key, putting each exact saved value in double quotes, such as `"@as []"` or `"['<Super>space', 'XF86Keyboard']"`. Do not assume someone else's default settings match yours.

### Optional Ghostty clipboard bindings

These are documented settings to test, not a completed functional test on the example Mac. Preserve the existing Ghostty configuration.

```bash
mkdir -p ~/.config/ghostty
```

Edit `~/.config/ghostty/config`, retaining existing settings, and add:

```ini
keybind = performable:ctrl+c=copy_to_clipboard
keybind = ctrl+v=paste_from_clipboard
```

Save and restart Ghostty. With the desktop swap, test that Cmd+C copies selected text, Cmd+V pastes, and Cmd+C without a selection interrupts a running command. This consumes Ctrl+V as paste rather than sending it to terminal programs. Remove only your added bindings if unsuitable. See [Ghostty keybindings](https://ghostty.org/docs/config/keybind).

## 10. Optional YouTube codec extension

Use the browser add-on links from the [enhanced-h264ify project](https://github.com/alextrv/enhanced-h264ify). In the extension, block VP8/VP9/AV1 and allow H.264. This requests a codec the Haswell video engine can decode; it can limit the highest available video resolution. The extension alone does not enable browser hardware acceleration.

Right-click a playing YouTube video and open **Stats for nerds**. `avc1` identifies H.264. Ubuntu's default browser is Firefox. The following diagnostic addresses work in Chrome or Chromium, not Firefox; if you use one of those browsers, keep the video playing and open:

```text
chrome://gpu
chrome://media-internals
```

The first reports capabilities; the second lets you inspect the active player's decoder. Codec and perceived startup speed alone do not establish hardware offload. [Chromium's decoder documentation](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/gpu/vaapi.md) cautions that VA-API on Linux is unsupported and may work only on some configurations. Your check may therefore show software decoding.

The owner reports laggy loading before installing the extension and almost-instant-feeling starts afterward. That is a personal observation; no startup-latency, CPU-saving or battery-saving measurement is claimed.

## 11. Record results and retain recovery options

Evaluate the checklist in [SPEC.md](SPEC.md) and complete your own [RESULTS.md](RESULTS.md). Check intended applications and hardware individually. Retain the separate backup and installer until you are satisfied the system works for your needs.


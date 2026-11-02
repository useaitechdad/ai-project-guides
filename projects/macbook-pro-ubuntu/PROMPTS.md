# MacBook conversion prompts

Use these with your own filled-in specification. Keep private data out of shared prompts and logs. The agent should help you interpret and verify each stage rather than assume the example machine matches yours.

## 1. Inspect my Mac and plan

```text
Read SPEC.md and STEPS.md. Help me adapt this Intel MacBook-to-Ubuntu workflow
to my machine. First confirm the model, architecture, relevant graphics and
Wi-Fi hardware, current OS, available backup and installer resources.
Use read-only checks. Avoid collecting serial numbers or unrelated files.
Explain where my configuration differs and which claims need current official
documentation. Do not assume Ubuntu 24.04 is best for every Mac.
```

## 2. Verify the backup

```text
Help me make and verify a separate backup before installation. Account for
every user profile and required project settings, browser data and keys.
Do not ask me to paste private keys or personal files into chat. Identify
permission errors and omissions. Help me compare folders and open sample
files from the backup. Do not mark it verified from a successful transfer
message alone. Stop before any erase until I confirm the backup and target.
```

## 3. Prepare the installer over SSH

```text
Use the CONTROL MAC / OLD MAC roles in SPEC.md. Help me enable Remote Login
on the OLD MAC and connect from the CONTROL MAC on my trusted network.
Label which machine runs every command. The ISO download and USB write run
on the OLD MAC, with the USB plugged into it. Check the official amd64 image
and checksum. Identify the USB by actual capacity and identity; never guess
a disk number. Show the exact target and wait for my confirmation before dd.
```

## 4. Install, restore connectivity and update

```text
Guide me through Option / EFI Boot and the Ubuntu installer, confirming the
backup and internal target before erasure. If Wi-Fi is missing, help me use
compatible wired Ethernet or my iPhone's USB hotspot for temporary internet.
Identify the Wi-Fi chipset before proposing a driver. For this BCM4360 example,
check Additional Drivers for the recommended Broadcom option. Verify networking,
install updates for the current Ubuntu release and recheck hardware afterward.
```

## 5. Add only the extras I need

```text
Help me choose from Ghostty, Claude Code, Command-key mapping, search and the
YouTube codec extension. State account/cost requirements and trade-offs.
Save existing settings before changing them. Run desktop gsettings commands
in the logged-in Ubuntu desktop session, not blindly through SSH. Test copy,
paste, search and terminal interrupt separately, and record an undo path.
```

## 6. Diagnose a problem

```text
Stage: [STAGE]
Expected behavior: [EXPECTED]
Actual behavior and sanitized output: [OBSERVED]
My exact component/OS version: [CONFIGURATION]

Propose the smallest read-only checks first. Explain what each result would
mean. Change one thing at a time, preserve the working fallback and provide
undo steps. Do not use driver commands for a different chipset without evidence.
```

## 7. Check the result honestly

```text
Review my RESULTS.md against SPEC.md. Distinguish tested behavior, reported
experience, measured results and unknowns. Stats for nerds showing avc1
identifies H.264; verify the active decoder separately before claiming GPU
offload. Do not turn faster-feeling playback into measured CPU/battery savings.
List the remaining tests and what evidence would settle them.
```


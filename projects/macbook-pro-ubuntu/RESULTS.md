# Example results — what is known

**Recorded:** 2026-11-01. This record summarizes the project evidence and owner's reports; it is not a fresh replication of every step in this guide.

## Outcome

The owner reports that the Mac is useful again for coding, terminal work, browsing and reading, with the existing 256 GB SSD.

| Item | Status | Evidence and limits |
| --- | --- | --- |
| Ubuntu installation | Recorded working configuration | Ubuntu 24.04 LTS runs on the reference Mac. A different image/kernel or Mac model needs its own checks. |
| Broadcom Wi-Fi | Recorded configuration and owner report | BCM4360 using `wl`; temporary iPhone USB internet was used during troubleshooting. |
| Second-Mac preparation | Owner-reported workflow | Remote preparation over SSH, with AI assistance. |
| Command shortcuts | Configuration inspected | Left modifier swap and GNOME search settings were recorded. Readers must verify their own apps and layout conflicts. |
| Optional Ghostty clipboard bindings | Documented, not functionally verified here | Test copy, paste and interrupt before relying on them. |
| YouTube playback | Owner-reported experience | Stats for nerds was checked. Loading felt laggy before the extension and almost instant afterward. No timing measurement was made. |
| Active GPU video decoder | Not established by the available evidence | Needs active-player diagnostics; `avc1` and responsiveness do not prove offload. |
| Audio, brightness and lid wake | Reader checks required | No systematic pass/fail record for every feature is supplied here. |
| Full battery runtime, game FPS, NVMe upgrade | Not validated | No performance or compatibility promise is made. |

## Memory observations

Earlier notes reported roughly 5.5 GB used at idle on Big Sur and 1.5 GB on Ubuntu. Different accounting and uncontrolled conditions make this an observation, not a controlled application benchmark or a guaranteed saving.

## Short display-power comparison

The recorded sequence was lower resolution / native Retina / lower resolution again, with a busy Chrome workload and two 15-second samples per run.

| Run | GPU mean power | Package mean power |
| --- | --- | --- |
| Lower resolution | 2.58 W | 17.355 W |
| Native Retina | 7.455 W | 23.355 W |
| Lower resolution again | 2.90 W | 15.375 W |

Package power includes GPU power; do not add the two figures. Browser load and brightness varied. These short samples do not establish a battery-runtime benefit or a universal performance improvement. Raw private project logs are not distributed in this guide.

Native 2880 × 1800 at 200% scaling is sharper. 1440 × 900 at 100% offers the same logical workspace with softer upscaled text. Choose based on your own readability and workload checks.

## What to verify on your machine

Use the [specification checklist](SPEC.md#success-criteria-for-a-viewer-repeating-this-project). Record actual versions, observations and failures. Keep personal identifiers out of any shared results. If comparing performance, use consistent conditions and record the method before drawing conclusions.


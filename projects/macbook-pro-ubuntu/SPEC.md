# Example specification — MacBook Pro revival

## Goal

Make a previously unused Mac useful for coding, terminal work, browsing and reading. Use existing hardware and install the tools needed for that workload.

Out of scope: Apple silicon installation, gaming performance promises, NVMe replacement and guaranteed all-day battery life.

## Reference configuration

| Component | Configuration |
| --- | --- |
| Model | Late 2013 15-inch Retina MacBook Pro; MacBookPro11,2 |
| CPU | Intel Core i7-4750HQ, 2.0 GHz; 4 cores / 8 threads |
| Graphics | Intel Iris Pro 5200 |
| Memory | 16 GB 1600 MHz DDR3L |
| Display | 15.4-inch Retina, 2880 × 1800 |
| Storage | Existing 256 GB Apple PCIe SSD |
| Wireless | Broadcom BCM4360; PCI device ID 14e4:43a0 |
| Starting OS | macOS Big Sur |
| Target | Ubuntu 24.04 LTS, Desktop amd64 |

## Workflow roles

| Label | Role | Where commands run |
| --- | --- | --- |
| CONTROL MAC | Second Mac, used to start the SSH session and work with the AI agent | Its local macOS terminal |
| OLD MAC | MacBook being converted; downloads the ISO and writes its connected USB | macOS terminal reached through SSH, or its local terminal |
| UBUNTU MAC | Same MacBook after installation | Ubuntu terminal; desktop settings require its logged-in graphical session |

Use `USERNAME`, `OLD_MAC_IP`, `OFFICIAL_ISO_URL` and `diskN` as placeholders. Their actual values belong in a private local note.

## Choices and reasons

- **Ubuntu 24.04 LTS:** the owner's working release on this configuration. Ubuntu 26.04 was considered but not installed for a comparison; the owner did not need its additional features. Reevaluate another model independently.
- **Existing SSD:** sufficient for the owner's work. No upgrade required.
- **Second Mac and SSH:** convenient for remote preparation with AI assistance. Other workflows are possible.
- **Temporary iPhone USB internet:** used while the Wi-Fi driver was being fixed.
- **Optional tools:** Ghostty, Claude Code, familiar Command shortcuts and enhanced-h264ify.

Ubuntu 24.04 standard security maintenance ends May 2029. Ubuntu Pro provides expanded security maintenance through May 2034, free for personal use on up to five machines after registration and activation. Phone/ticket support is a separate paid service. Third-party applications have their own support policies. See the [release schedule](https://ubuntu.com/about/release-cycle) and [Ubuntu Pro](https://ubuntu.com/pro).

## Success criteria for a viewer repeating this project

- [ ] Required data from every account is backed up and recoverable before erasing.
- [ ] The selected installer matches the Intel architecture and its official checksum.
- [ ] Ubuntu boots from the internal drive; desktop and internet work.
- [ ] Supported updates are installed and required restarts completed.
- [ ] Wi-Fi, audio, graphics, brightness and lid wake have each been checked.
- [ ] Required apps work; optional keyboard changes pass copy, paste, search and interrupt checks.
- [ ] Video playback is usable; codec and active hardware decoder checks are recorded separately.
- [ ] Results, limitations and recovery steps are documented.

These are the viewer's acceptance checks, not a claim that every item was independently validated for the example. Consult [RESULTS.md](RESULTS.md).


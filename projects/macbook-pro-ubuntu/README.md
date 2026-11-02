# Revive a 2013 MacBook Pro with Ubuntu

Turn an older Intel Mac into a useful machine for terminal work, coding, browsing and reading. This example follows the Use AI with Tech Dad video, **“Don't Throw Away Your Old MacBook.”** A direct video URL will be added when the episode is published.

This is a completed example of the [blank project templates](../../templates/README.md), with instructions you can adapt. The preparation workflow uses another Mac over SSH, with an AI agent helping interpret checks and plan each stage. Preparing the installer directly on the old Mac is another option.

**Reference machine:** Late 2013 15-inch Retina MacBook Pro, MacBookPro11,2.

**Chosen OS:** Ubuntu 24.04 LTS, Desktop amd64.

**Guide prepared:** 2026-11-01. Recheck current documentation and your model before applying it.

## What you need

- The Intel MacBook Pro being converted, still running macOS for this preparation method.
- An erasable USB stick, at least 8 GB; 16 GB was used. Check the selected installer image fits.
- A separate destination for a verified backup of required data from every account.
- Another Mac for the remote preparation workflow, on the same trusted network.
- Temporary internet access if Wi-Fi needs a driver: compatible Ethernet adapter and router, or an iPhone with USB Personal Hotspot. The iPhone route worked for the owner.

## Read in order

1. [SPEC.md](SPEC.md): the actual hardware, choices and desired outcome.
2. [PROMPTS.md](PROMPTS.md): staged requests for an AI agent.
3. [STEPS.md](STEPS.md): preparation, installation, drivers, updates and optional tools.
4. [RESULTS.md](RESULTS.md): what was observed, measured and left unverified.

## Adapt before you act

This workflow targets Intel Macs without an Apple T2 chip. Apple silicon and T2 Macs need different installation paths; for T2, see [T2 Linux](https://wiki.t2linux.org/). Other Intel Mac models may have different graphics, network adapters and firmware behavior.

The USB flashing command erases the selected USB. Choosing “Erase disk and install Ubuntu” erases the selected internal drive. Verify backups and exact disk identities before either action. The guide does not assume a disk number for your machine.

The example keeps the existing 256 GB SSD. Storage upgrades are optional projects, not prerequisites.


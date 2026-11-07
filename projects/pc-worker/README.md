# Build your own AI worker — prompt guide

Give a spare PC a useful role processing jobs for coding agents on your main computer.

## Get the prompt

Open [PROMPT.txt](PROMPT.txt), or [download the plain-text prompt](https://raw.githubusercontent.com/useaitechdad/ai-project-guides/main/projects/pc-worker/PROMPT.txt).

1. Start with an AI coding agent on your main computer. Terminal access is needed for the agent to inspect or install anything; without it, the agent can help you plan.
2. Copy the text between `BEGIN PROMPT` and `END PROMPT` into the agent.
3. Fill in the `MY DETAILS` fields: your computers and operating systems, hardware if known, data to preserve, disk space, first task, existing SSH access and authorized work folder. Leave unknown details blank.
4. Let the agent inspect and propose a small first milestone. Review the plan before approving changes to the spare PC.
5. Have the agent demonstrate submission, queue order, failure handling and a verified result fetched back to your computer before calling the setup complete.

## What it covers

- Private-network SSH and a reusable host alias.
- One global heavy-job queue, with prompt submission and persistent job IDs.
- Agent instructions for independent work, status checks, ownership and dependencies.
- Fetching selected outputs while intermediate files and caches stay on the worker.
- Explicit storage and retention choices, including optional second-disk storage.
- Configuration documentation, troubleshooting and verification.

This is a starter prompt for building a similar workflow. It is not an installer or a release of the private PC Worker software. The first queue demonstration does not require a GPU; your agent must adapt the implementation to your hardware and check current official documentation. Keep your filled-in copy private. Do not include credentials, private keys or personal files in prompts or issues.

The guide text is covered by the repository's [MIT license](../../LICENSE).

# AI Project Guides — Use AI with Tech Dad

Use an AI agent to plan a practical project, work through it in stages, and check the result.

These guides accompany [Use AI with Tech Dad](https://github.com/useaitechdad). Each project includes a specification, prompts, instructions and an honest results record. You can use them with your preferred assistant; command execution and SSH capabilities vary by tool.

## Start here

1. Read the [MacBook-to-Ubuntu example](projects/macbook-pro-ubuntu/README.md), or copy the [blank templates](templates/README.md) into your own local project folder.
2. Fill in `SPEC.md` with your situation. Treat example hardware and settings as context, not defaults for your machine.
3. Paste the first prompt from `PROMPTS.md` into your assistant and provide the relevant files.
4. Follow one stage of `STEPS.md` at a time, checking the outcome before moving on.
5. Record what actually happened in `RESULTS.md`.

Keep your filled-in working copy private. Replace private account names, addresses, paths and identifiers before sharing it. Never put credentials, private keys, personal documents or full machine dumps into an issue or prompt.

## Guides

| Project | Purpose | Reference configuration |
| --- | --- | --- |
| [MacBook Pro → Ubuntu](projects/macbook-pro-ubuntu/README.md) | Give an older laptop a useful role with AI-assisted preparation | Late 2013 Intel MacBookPro11,2; Ubuntu 24.04 LTS |

The templates distinguish a reported experience, an observed configuration and a measured result. An AI suggestion is not a completed check. For example, a video codec label does not by itself prove hardware decoding.

## How these files fit together

| File | Use |
| --- | --- |
| `README.md` | Orientation, prerequisites and navigation |
| `SPEC.md` | Your starting point, goal, constraints and success criteria |
| `PROMPTS.md` | Requests to give an AI agent at each stage |
| `STEPS.md` | Actions, command locations, expected results and recovery |
| `RESULTS.md` | Evidence, limitations and unresolved issues |

Guides are dated examples. Check current official documentation and your own hardware before applying them. Destructive steps require a verified backup and confirmation of the exact target.

## Reuse

The original guide text and templates are available under the [MIT license](LICENSE). Referenced applications and third-party documentation retain their own licenses and terms.


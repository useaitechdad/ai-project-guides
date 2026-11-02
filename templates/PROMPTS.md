# Prompts for your AI agent

Replace placeholders before use. Provide only the relevant project files and sanitized output. Start with read-only inspection; do not give the agent access to unrelated directories.

## 1. Understand my project

```text
Read SPEC.md and STEPS.md from this project folder. Summarize my goal,
constraints and definition of done. Identify missing information that changes
the plan. Start with read-only checks and explain what each check establishes.
Do not invent device identifiers, test results or compatibility claims.
```

## 2. Make a plan

```text
Create a staged plan for my actual configuration and write it into STEPS.md.
For each stage, state its
prerequisites, the machine and OS involved, expected results, verification,
and recovery options. Separate required work from optional improvements.
Verify changing technical claims against current official documentation.
Show unresolved assumptions and stop conditions before proposing execution.
```

## 3. Work through one stage

```text
Help me complete stage [NAME]. Label every command with the machine, OS and
session where it runs. Explain its effect and expected output. Confirm actual
identifiers before substituting placeholders. Make only the changes authorized
for this stage, verify the result, and update RESULTS.md.
Before erasing or deleting anything, show the exact target and obtain my
explicit confirmation. Do not publish, upload or spend money without approval.
```

## 4. Troubleshoot

```text
Expected result: [EXPECTED]
Actual result: [OBSERVED]
Sanitized error/output: [OUTPUT]
Last successful step: [STEP]

Identify likely causes and the smallest read-only checks that distinguish
them. Change one thing at a time. Explain how to undo each proposed change.
Do not apply a fix for a different device, OS release or component without
showing why it applies here. Preserve my working fallback.
```

## 5. Review the result

```text
Compare RESULTS.md with SPEC.md's definition of done. Mark each requirement
as verified, owner-reported, inferred, not tested or blocked. Do not turn a
subjective impression into a measured performance claim. List remaining
checks and the evidence needed to complete them.
```

## 6. Prepare a shareable copy

```text
Review only the intended sharing folder. Flag personal details, credentials,
private keys, internal addresses, private repository links and unrelated code.
Check factual claims, commands, references and placeholders. Produce a report
with file and line references. Do not upload or publish anything. Wait for my
explicit approval after I have reviewed the final proposed files.
```


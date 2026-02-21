---
description: Generate a commit message based on recent changes with a specified size (small, medium, detailed)
---

# Generate Commit Message Workflow

This workflow automatically analyzes recent modifications inside the repository and generates a structured Git commit message according to the desired level of detail. It will never commit the code without your explicit approval.

1. **Analyze Changes**: Review the current changes using the project context or using terminal tools to run `git status` and `git diff` (or `git diff --cached` if files are staged) to understand the scope of the modifications.
2. **Determine the Scope**: Consider the `size` parameter provided by the user (small, medium, detailed) to craft the message:
   - **small**: Generate a concise commit message containing a short summary line (`<type>: <short description>`) without an extended body, or perhaps just 1-2 bullet points.
   - **medium**: Generate a standard commit message containing a concise summary line, an empty line, and a brief descriptive body explaining the 'what' and 'why' of the main changes.
   - **detailed**: Generate a comprehensive commit message dividing the changes into clear sections (e.g., Features, Fixes, Refactoring, UI/UX), elaborating on specific files modified, implementation choices, and the reasoning behind them.
3. **Present the Draft**: Show the generated commit message to the user in a clear code block.
4. **Wait for Approval**: **CRITICAL**: Do NOT execute any `git commit` command automatically. Ask the user if they are satisfied with the generated message and if they want you to proceed with staging and committing the changes.
5. **Execute Commit (Only upon Explicit Approval)**: If the user explicitly approves the message and requests the commit to be made, run `git add .` (if they want to stage everything) and `git commit -m "<message>"`. Provide the output to confirm the commit was successful.

**Usage example:**
"run workflow generate-commit size=detailed"

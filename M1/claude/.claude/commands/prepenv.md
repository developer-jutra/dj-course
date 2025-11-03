---
allowed-tools: Bash(deactivate:*), Bash(rm: -rf .venv), Bash(python: -m venv .venv), Bash(source: .venv/bin/activate), Bash(source: .venv/Scripts/activate)
description: Creates a fresh Python virtual environment (venv) and activates it.
---

## Context

The current state of your environment needs to be prepared for a new virtual environment setup.

## Your task

Your task is to implement the following steps:

1.  **Deactivate** any existing virtual environment to ensure a clean slate.
2.  **Remove** the `venv` directory if it already exists, ensuring a fresh installation.
3.  **Create** a new virtual environment named `venv` using Python's built-in `venv` module.
4.  **Activate** the newly created virtual environment.

***

**Command Implementation (for Unix/Linux/macOS):**

```bash
deactivate 2>/dev/null || true # Safely deactivate any active venv, suppressing errors if none is active
rm -rf venv
python -m venv .venv
pip install -r requirements.txt
source .venv/bin/activate
```
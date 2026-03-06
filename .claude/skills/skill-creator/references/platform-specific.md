# Platform-Specific Instructions

## Claude.ai

No subagents available. Adapt the workflow:

**Running test cases:** Read the skill's SKILL.md, then follow its instructions to complete the test prompt yourself, one at a time. You wrote the skill and you're running it, so you have full context — less rigorous than independent subagents, but the human review step compensates. Skip baseline runs.

**Reviewing results:** Can't open a browser. Present results directly in conversation — show each prompt and its output. For file outputs (.docx, .xlsx), save to the filesystem and tell the user the path to download it. Ask for feedback inline: "How does this look? Anything you'd change?"

**Benchmarking:** Skip — relies on baseline comparisons that aren't meaningful without subagents.

**Iteration loop:** Same as main workflow, but without the browser reviewer. Organize results in iteration directories if a filesystem is available.

**Description optimization:** Requires `claude -p` CLI (Claude Code only). Skip.

**Blind comparison:** Requires subagents. Skip.

**Packaging:** `python -m scripts.package_skill <skill-path>` works anywhere with Python. User can download the `.skill` file.

---

## Cowork

Subagents work. Browser doesn't.

**Eval viewer:** Use `--static <output_path>` to write a standalone HTML file instead of starting a server. Provide the path as a link the user can click. The "Submit All Reviews" button downloads `feedback.json` — you may need to request access before reading it.

**Generate the eval viewer before evaluating inputs yourself.** Cowork environments tend to skip this step — don't. Use `generate_review.py`, not custom HTML. Get results in front of the human before making any revisions.

**Description optimization:** `run_loop.py` works fine via subprocess. Save it until the skill is fully in good shape.

**Packaging:** Works normally.

**Timeouts:** If parallel subagent runs hit timeouts, it's OK to run test prompts in series rather than parallel.

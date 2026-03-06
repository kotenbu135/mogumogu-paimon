# Running and Evaluating Test Cases

This is a continuous sequence — don't stop partway through. Do NOT use `/skill-test` or any other testing skill.

Put results in `<skill-name>-workspace/` as a sibling to the skill directory. Organize by iteration (`iteration-1/`, `iteration-2/`, etc.), and within each iteration, one directory per test case. Create directories as you go — don't create everything upfront.

## Step 1: Spawn all runs in the same turn

For each test case, spawn two subagents in parallel — one with the skill, one without. Launch everything at once. Subagents run in isolated (forked) contexts, so they don't accumulate tokens in the main conversation — use this to keep the main context lean.

**With-skill run:**

```
Execute this task:
- Skill path: <path-to-skill>
- Task: <eval prompt>
- Input files: <eval files if any, or "none">
- Save outputs to: <workspace>/iteration-<N>/<eval-name>/with_skill/outputs/
- Outputs to save: <what the user cares about — e.g., "the .docx file", "the final CSV">
```

**Baseline run** (same prompt, context adjusted):
- **New skill**: no skill at all. Save to `without_skill/outputs/`.
- **Improving existing skill**: snapshot first (`cp -r <skill-path> <workspace>/skill-snapshot/`), point baseline at the snapshot. Save to `old_skill/outputs/`.

Write `eval_metadata.json` for each test case (assertions can be empty for now). Use descriptive names based on what the eval is testing:

```json
{
  "eval_id": 0,
  "eval_name": "descriptive-name-here",
  "prompt": "The user's task prompt",
  "assertions": []
}
```

## Step 2: Draft assertions while runs are in progress

Don't wait — use this time productively. Draft quantitative assertions for each test case and explain them to the user. Good assertions are objectively verifiable and have clear names readable at a glance in the benchmark viewer. Subjective skills (writing style, design quality) don't need forced assertions — qualitative human review is better.

Update `eval_metadata.json` and `evals/evals.json` with assertions. See `references/schemas.md` for the full schema.

Also explain to the user what they'll see in the viewer.

## Step 3: Capture timing data as runs complete

When each subagent finishes, you get a notification with `total_tokens` and `duration_ms`. Save it immediately — this is the only chance to capture it:

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3
}
```

Save to `timing.json` in the run directory. Process each notification as it arrives.

## Step 4: Grade, aggregate, and launch the viewer

**Grade each run** — spawn a grader subagent pointing at `agents/grader.md`. Save results to `grading.json`. The viewer requires these exact field names:

```json
{"text": "assertion description", "passed": true, "evidence": "why it passed or failed"}
```

For programmatic checks, write a script — faster, more reliable, reusable.

**Aggregate:**

```bash
python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>
```

Produces `benchmark.json` and `benchmark.md`. Put with_skill before baseline in ordering.

**Analyst pass** — read `agents/analyzer.md` to surface patterns the aggregate stats might hide: non-discriminating assertions (always pass regardless of skill), high-variance evals (possibly flaky), time/token tradeoffs.

**Launch the viewer:**

```bash
nohup python <skill-creator-path>/eval-viewer/generate_review.py \
  <workspace>/iteration-N \
  --skill-name "my-skill" \
  --benchmark <workspace>/iteration-N/benchmark.json \
  > /dev/null 2>&1 &
VIEWER_PID=$!
```

For iteration 2+: add `--previous-workspace <workspace>/iteration-<N-1>`.

**Headless / Cowork environments:** Use `--static <output_path>` instead of starting a server. The "Submit All Reviews" button downloads `feedback.json`.

**Generate the eval viewer before evaluating inputs yourself.** Get results in front of the human first — then improve based on their actual feedback, not your own assessment.

Tell the user: "I've opened the results in your browser. 'Outputs' tab lets you review each test case and leave feedback; 'Benchmark' tab shows the quantitative comparison. Come back when you're done."

### What the user sees

**Outputs tab**: prompt, output files (rendered inline where possible), previous output (iteration 2+, collapsed), assertion grades (collapsed), feedback textbox, previous feedback (iteration 2+).

**Benchmark tab**: pass rates, timing, token usage per configuration, with per-eval breakdowns and analyst notes.

Navigation: prev/next buttons or arrow keys. "Submit All Reviews" saves to `feedback.json`.

## Step 5: Read the feedback

```json
{
  "reviews": [
    {"run_id": "eval-0-with_skill", "feedback": "chart missing axis labels"},
    {"run_id": "eval-1-with_skill", "feedback": ""},
    {"run_id": "eval-2-with_skill", "feedback": "perfect, love this"}
  ],
  "status": "complete"
}
```

Empty feedback = satisfied. Focus improvements on specific complaints.

Kill the viewer server when done:

```bash
kill $VIEWER_PID 2>/dev/null
```

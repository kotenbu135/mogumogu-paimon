# Improving the Skill

This is the heart of the loop. You've run tests, the user has reviewed results — now make the skill better.

## How to think about improvements

**1. Generalize from the feedback.**
You're iterating on a handful of examples, but the skill will run across millions of different prompts. Don't make overfitty changes tuned to specific test cases. If something is stubbornly wrong, try a completely different framing — a different metaphor, a different pattern of working. It's cheap to try and you might land on something great.

**2. Keep it lean.**
Read the transcripts, not just the final outputs. If the skill is making the model spend time on unproductive steps, find the instruction driving that behavior and remove or rephrase it. Every token in SKILL.md costs something every time the skill runs. Remove anything that isn't clearly pulling its weight.

**3. Explain the why.**
LLMs reason better when they understand purpose. If you catch yourself writing "ALWAYS" or "NEVER" in all caps, that's a signal: step back and explain *why* that behavior matters instead. Instructions with reasoning behind them generalize better than rigid rules. More humane and more effective.

**4. Bundle repeated work.**
Read the subagent transcripts across all test cases. If every run independently wrote the same `create_docx.py` or `build_chart.py`, that script belongs in `scripts/`. Write it once, bundle it, and save every future invocation from reinventing the wheel.

Take time here. Draft a revision, then set it down and read it fresh before finalizing. Really get into the head of the user.

## The iteration loop

1. Apply your improvements to the skill
2. Rerun all test cases into `iteration-<N+1>/`, including baseline runs
   - **New skill**: baseline is always `without_skill` (no skill)
   - **Improving existing skill**: use the original version the user came in with as baseline, or the previous iteration — your judgment based on what's most informative
3. Launch the eval viewer with `--previous-workspace <workspace>/iteration-<N>`
4. Wait for the user to review and say they're done
5. Read the new `feedback.json`, improve, repeat

Keep going until:
- The user says they're happy
- All feedback entries are empty (everything looked good)
- You're not making meaningful progress

## Advanced: Blind comparison

For more rigorous version comparison ("is the new version actually better?"), read `agents/comparator.md` and `agents/analyzer.md`. An independent subagent judges two outputs without knowing which is which. Optional — the human review loop is usually sufficient.

---
name: skill-creator
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, update or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.
---

# Skill Creator

A skill for creating new skills and iteratively improving them.

The core loop:
1. Understand what the skill should do
2. Write or edit a skill draft
3. Run test cases via parallel subagents (skill vs. baseline)
4. Help the user evaluate results qualitatively and quantitatively
5. Improve the skill based on feedback
6. Repeat until satisfied
7. Optionally: optimize the description for better triggering

Jump in wherever the user is. If they have an existing skill already, go straight to step 3. If they say "just vibe with me," skip the formal eval loop and iterate directly.

**Context efficiency note**: Subagents run in isolated (forked) contexts and don't accumulate tokens in the main conversation. Use them freely for eval runs and grading — this keeps the main context focused on planning and writing the skill itself.

## Communicating with the user

People using this skill range from beginners to experienced engineers. Read context cues carefully:
- "evaluation" and "benchmark" are OK
- "JSON" and "assertion" need context cues before using without explanation

Brief definitions are welcome when in doubt.

---

## Creating a skill

### Capture Intent

Check the conversation history first — tools used, corrections made, and input/output patterns may already tell you a lot.

1. What should this skill enable Claude to do?
2. When should this skill trigger? (what user phrases/contexts)
3. What's the expected output format?
4. Should we set up test cases? Skills with objectively verifiable outputs (file transforms, code generation, fixed workflows) benefit from them. Subjective skills (writing style, art) often don't. Suggest a default, let the user decide.

### Interview and Research

Ask about edge cases, example files, success criteria, and dependencies. Don't write test prompts until this is settled.

Check available MCPs — if useful for research, spawn parallel subagents to research in the background while you continue interviewing the user.

### Write the SKILL.md

Components to fill in:

- **name**: lowercase, hyphens, max 64 chars
- **description**: what it does + when to use it. This is the primary trigger mechanism. Make it a bit "pushy" — Claude tends to undertrigger. Instead of "helps with dashboards," write "Use this whenever the user mentions dashboards, data visualization, or internal metrics, even if they don't say 'dashboard'."
- **the rest of the skill**

#### Anatomy of a Skill

```
skill-name/
├── SKILL.md (required, <500 lines)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code (runs without loading into context)
    ├── references/ - Docs loaded as needed (zero cost until accessed)
    └── assets/     - Templates, icons, fonts
```

#### Progressive Disclosure

Three loading levels — keep this in mind as the skill grows:
1. **Metadata** (name + description) — always in context
2. **SKILL.md body** — loaded when skill triggers (keep under 500 lines)
3. **Bundled resources** — loaded or executed only as needed, no context cost until accessed

When SKILL.md grows large, move detailed content to `references/` and add clear pointers. When a skill covers multiple domains, organize by domain so only the relevant file gets loaded:

```
bigquery-skill/
├── SKILL.md (overview + navigation)
└── references/
    ├── finance.md
    ├── sales.md
    └── product.md
```

Keep references 1 level deep — nested references cause partial reads and missed information.

#### Writing Style

- Use imperative form
- Explain *why*, not just *what* — LLMs reason better with purpose than rigid rules
- Prefer one clear approach over multiple options
- Start with a draft, read it fresh, improve it

#### Principle of Lack of Surprise

Skills must not contain malware, exploit code, or deceptive content. A skill's behavior should match exactly what its description promises.

### Test Cases

Come up with 2-3 realistic test prompts — what a real user would actually type. Share them: "Here are a few test cases I'd like to try. Do these look right, or do you want to add more?" Then run them.

Save test cases to `evals/evals.json`:

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's task prompt",
      "expected_output": "Description of expected result",
      "files": []
    }
  ]
}
```

See `references/schemas.md` for the full schema including the `assertions` field.

---

## Running and evaluating test cases

Read `references/running-evals.md` for the complete step-by-step process (Steps 1–5).

**Overview:**
1. Spawn all runs (with-skill + baseline) as parallel subagents in the same turn — subagents run in forked contexts, keeping main conversation lean
2. While runs are in progress, draft quantitative assertions
3. Capture timing data from each subagent completion notification (only opportunity to get it)
4. Grade, aggregate into benchmark, launch eval viewer
5. Read user feedback from `feedback.json`

Do NOT stop partway through — this is one continuous sequence.

---

## Improving the skill

Read `references/improving-skill.md` for detailed guidance.

Key principles:
- **Generalize** from examples — don't overfit to specific test cases
- **Keep it lean** — remove instructions that aren't pulling their weight
- **Explain the why** — reasoning beats rigid rules
- **Bundle repeated work** — if subagents independently write the same helper script across test cases, bundle it in `scripts/`

After improving, rerun all test cases into a new `iteration-N+1/` directory and repeat.

---

## Description Optimization

Read `references/description-optimization.md` for the full workflow.

**Overview:**
1. Generate 20 eval queries (mix of should-trigger and should-not-trigger)
2. Review with user via `assets/eval_review.html`
3. Run `scripts/run_loop.py` in background to iteratively optimize
4. Apply `best_description` to SKILL.md frontmatter

Do this after the skill itself is in good shape — not before.

---

## Platform-specific notes

Read `references/platform-specific.md` for Claude.ai and Cowork adaptations.

Short version:
- **Claude Code**: Full workflow (subagents, browser viewer, description optimization)
- **Claude.ai**: No subagents → run tests inline, skip baselines and benchmarking
- **Cowork**: Use `--static` for viewer (no browser), feedback downloads as `feedback.json`

---

## Reference files

| File | When to read |
|------|--------------|
| `references/running-evals.md` | When starting eval runs (Steps 1–5) |
| `references/improving-skill.md` | When iterating on feedback |
| `references/description-optimization.md` | When optimizing trigger description |
| `references/platform-specific.md` | When on Claude.ai or Cowork |
| `references/schemas.md` | When checking JSON schemas for evals/grading |
| `agents/grader.md` | When spawning grader subagent |
| `agents/comparator.md` | When doing blind A/B comparison |
| `agents/analyzer.md` | When analyzing benchmark results |

---

## The loop (summary)

1. Understand the skill
2. Draft or edit SKILL.md
3. Run tests → `references/running-evals.md`
4. User reviews in eval viewer
5. Improve → `references/improving-skill.md`
6. Repeat until satisfied
7. Optimize description → `references/description-optimization.md`
8. Package (if `present_files` is available): `python -m scripts.package_skill <skill-path>`

Add these as TodoList items. Good luck!

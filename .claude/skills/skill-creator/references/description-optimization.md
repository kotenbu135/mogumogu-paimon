# Description Optimization

The `description` field in SKILL.md frontmatter is the primary mechanism determining whether Claude invokes a skill. Optimize it after the skill itself is in good shape — not before.

## How skill triggering works

Skills appear in Claude's `available_skills` list with name + description. Claude consults a skill only when it can't easily handle the task alone — simple one-step queries ("read this PDF") may not trigger even with a perfect description. Your eval queries need to be complex enough that Claude would genuinely benefit from consulting a skill.

## Step 1: Generate trigger eval queries

Create 20 queries — a mix of should-trigger and should-not-trigger. Save as JSON:

```json
[
  {"query": "the user prompt", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

Queries must be realistic and specific. Include file paths, company names, personal context, abbreviations, typos, casual speech. Mix lengths. Focus on edge cases — the user will review them.

**Should-trigger (8-10):** Different phrasings of the same intent (formal and casual). Include cases where the user doesn't name the skill explicitly but clearly needs it. Include uncommon use cases and cases where this skill competes with another.

**Should-not-trigger (8-10):** Near-misses — queries sharing keywords with the skill but actually needing something different. Adjacent domains, ambiguous phrasing, same concepts in a context where another tool wins. Don't make these obviously irrelevant — that doesn't test anything.

**Bad:** `"Format this data"`, `"Extract text from PDF"`, `"Create a chart"`

**Good:** `"ok so my boss just sent me this xlsx file (its in my downloads, called something like 'Q4 sales final FINAL v2.xlsx') and she wants me to add a column that shows the profit margin as a percentage. The revenue is in column C and costs are in column D i think"`

## Step 2: Review with user

1. Read the template from `assets/eval_review.html`
2. Replace placeholders:
   - `__EVAL_DATA_PLACEHOLDER__` → the JSON array (no quotes — it's a JS variable assignment)
   - `__SKILL_NAME_PLACEHOLDER__` → skill name
   - `__SKILL_DESCRIPTION_PLACEHOLDER__` → current description
3. Write to `/tmp/eval_review_<skill-name>.html` and open: `open /tmp/eval_review_<skill-name>.html`
4. User edits queries, toggles should-trigger, adds/removes entries, clicks "Export Eval Set"
5. Check `~/Downloads/` for `eval_set.json` (grab the most recent if there are duplicates)

This step matters — bad eval queries produce bad descriptions.

## Step 3: Run the optimization loop

Tell the user: "This will take some time — I'll run it in the background and check in periodically."

**事前準備（初回のみ）:** Python環境をセットアップする。

```bash
# skill-creator ディレクトリに移動してセットアップ
cd .claude/skills/skill-creator
bash setup.sh
```

**認証設定（いずれか1つ）:**
```bash
# API Keyを使う場合
export ANTHROPIC_API_KEY=sk-ant-...

# サブスクプランのTOKENを使う場合
export ANTHROPIC_AUTH_TOKEN=your-token
```

Save the eval set to the workspace, then run:

```bash
cd .claude/skills/skill-creator
python -m scripts.run_loop \
  --eval-set <path-to-trigger-eval.json> \
  --skill-path <path-to-skill> \
  --model <model-id-from-system-prompt> \
  --max-iterations 5 \
  --verbose
```

Use the model ID from your system prompt — the triggering test should match what the user actually experiences.

The loop automatically: splits 60% train / 40% held-out test, evaluates the current description (3 runs per query for reliability), uses extended thinking to propose improvements based on failures, re-evaluates, iterates up to 5 times. Returns `best_description` selected by test score (not train score, to avoid overfitting).

Periodically tail the output to give the user progress updates.

## Step 4: Apply the result

Take `best_description` from the JSON output. Update SKILL.md frontmatter. Show the user before/after and report the scores.

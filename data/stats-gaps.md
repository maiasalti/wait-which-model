---
type: Data Gap Report
title: Stats gaps ledger
description: Cells researched by the stats-filler protocol that could not be verified, so re-runs skip them. Remove a row
  to have the next run re-check it.
tags:
- data
generated:
  by: human:maia
  at: '2026-08-16T00:27:36Z'
---

# Stats gaps ledger

Cells researched by the stats-filler protocol that could **not** be verified, so re-runs skip them. Remove a row to have the next run re-check it.

Sweep sources checked on 2026-07-04: LMArena (arena.ai) leaderboard, llm-stats.com (ARC-AGI-2, HLE, MMLU-Pro), benchlm.ai, Artificial Analysis (HLE/AIME pages + model pages), lastexam.ai, vals.ai, official lab announcements/model cards.

| model-id | field | checked | reason |
|---|---|---|---|
| gpt-4 | mmluPro | 2026-07-04 | MMLU-Pro (May 2024) postdates model; original GPT-4 not in TIGER-Lab results or trackers |
| gpt-4 | sweBench | 2026-07-04 | predates SWE-bench Verified; only full-split assisted figures exist (not comparable) |
| gpt-4 | aime | 2026-07-04 | never publicly evaluated on AIME |
| gpt-4 | hle | 2026-07-04 | predates benchmark (HLE Jan 2025); never evaluated |
| gpt-4 | arcAgi2 | 2026-07-04 | predates benchmark (Mar 2025); not on any ARC-AGI-2 leaderboard |
| gpt-4-turbo | sweBench | 2026-07-04 | predates SWE-bench Verified; no comparable public figure |
| gpt-4-turbo | aime | 2026-07-04 | never publicly evaluated on AIME |
| gpt-4-turbo | hle | 2026-07-04 | predates benchmark; not on official HLE leaderboard |
| gpt-4-turbo | arcAgi2 | 2026-07-04 | predates benchmark; never evaluated |
| gpt-4o | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards (llm-stats, benchlm, ARC Prize) |
| o1 | mmluPro | 2026-07-04 | OpenAI never reported; no verifiable third-party figure found |
| o1 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards; near-0% unofficial claims only |
| gpt-4-1 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| gpt-5-1 | mmluPro | 2026-07-04 | OpenAI stopped reporting MMLU-Pro; no distinct GPT-5.1 figure found |
| gpt-5-1 | aime | 2026-07-04 | no distinct GPT-5.1 AIME figure (GPT-5 figures widely conflated) |
| gpt-5-1 | arcAgi2 | 2026-07-04 | ambiguous "17% ARC-AGI" claims don't specify v1 vs v2; unverifiable |
| gpt-5-5 | mmluPro | 2026-07-04 | not reported by OpenAI; only implausible third-party figure (58.0) found — rejected |
| gpt-5-5 | aime | 2026-07-04 | not reported; AIME saturated, OpenAI moved to newer math evals |
| claude-3-opus | aime | 2026-07-04 | never publicly evaluated on AIME |
| claude-3-opus | hle | 2026-07-04 | predates benchmark; never evaluated |
| claude-3-opus | arcAgi2 | 2026-07-04 | predates benchmark; never evaluated |
| claude-3-5-sonnet | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| claude-3-7-sonnet | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| claude-sonnet-4 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards (Opus 4 was tested, Sonnet 4 was not) |
| claude-opus-4-1 | mmluPro | 2026-07-04 | Anthropic never reported; no verifiable third-party figure |
| claude-opus-4-1 | hle | 2026-07-04 | no public figure distinct from Opus 4 / 4.5 found |
| claude-opus-4-1 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| claude-sonnet-4-5 | mmluPro | 2026-07-04 | Anthropic never reported; no verifiable third-party figure |
| claude-haiku-4-5 | mmluPro | 2026-07-04 | not reported; AA publishes only composite index for Haiku 4.5 |
| claude-haiku-4-5 | hle | 2026-07-04 | not on official HLE / llm-stats / AA leaderboards |
| claude-haiku-4-5 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| claude-opus-4-5 | mmluPro | 2026-07-04 | Anthropic retired saturated benchmarks; no verifiable figure |
| claude-opus-4-5 | aime | 2026-07-04 | not reported; no verifiable third-party figure |
| claude-opus-4-5 | hle | 2026-07-04 | not on checked HLE leaderboards (Opus 4.6+ figures only) |
| claude-opus-4-8 | mmluPro | 2026-07-04 | Anthropic retired saturated benchmarks from official reporting |
| claude-opus-4-8 | aime | 2026-07-04 | not reported (Anthropic dropped AIME); no verifiable third-party figure |
| claude-fable-5 | mmluPro | 2026-07-04 | Anthropic retired saturated benchmarks; BenchLM hides non-public rows |
| claude-fable-5 | aime | 2026-07-04 | not reported; no verifiable third-party figure |
| claude-fable-5 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards as of July 2026 — **superseded 2026-09-22: ARC Prize results page (anthropic-claude-fable-5) gives a verified 89.2% at max effort ($5.45/task) — filled** |
| gemini-1-5-pro | sweBench | 2026-07-04 | Google never reported SWE-bench for 1.5 Pro; no comparable figure |
| gemini-1-5-pro | aime | 2026-07-04 | never publicly evaluated on AIME |
| gemini-1-5-pro | arcAgi2 | 2026-07-04 | predates benchmark; never evaluated |
| gemini-2-0-flash | aime | 2026-07-04 | Google reported MATH, not AIME; no public AIME figure |
| gemini-2-0-flash | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| gemini-3-1-pro | mmluPro | 2026-07-04 | not reported by Google; not on MMLU-Pro trackers |
| gemini-3-5-flash | mmluPro | 2026-07-29 | absent from official DeepMind model card (card lists MMMU-Pro 83.6%, a different multimodal benchmark — do not conflate) |
| gemini-3-5-flash | gpqaDiamond | 2026-07-29 | absent from official DeepMind model card; only an approximate "~92.2%" third-party claim exists |
| gemini-3-5-flash | aime | 2026-07-29 | absent from official DeepMind model card; not reported at I/O 2026 |
| llama-3-1-405b | sweBench | 2026-07-04 | Meta reported HumanEval, not SWE-bench; no public figure |
| llama-3-1-405b | aime | 2026-07-04 | Meta reported MATH, not AIME; no public figure |
| llama-3-1-405b | hle | 2026-07-04 | predates benchmark; not on official HLE leaderboard |
| llama-3-1-405b | arcAgi2 | 2026-07-04 | predates benchmark; never evaluated |
| llama-4-maverick | sweBench | 2026-07-04 | Meta never reported; not on SWE-bench leaderboard |
| llama-4-maverick | aime | 2026-07-04 | Meta reported MATH-500, not AIME |
| llama-4-maverick | hle | 2026-07-04 | not on HLE leaderboards |
| llama-4-maverick | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| muse-spark | mmluPro | 2026-07-04 | not reported (MMMU-Pro 80.5 is multimodal, a different benchmark) |
| muse-spark | aime | 2026-07-04 | not reported by Meta or trackers |
| muse-spark | maxOutput | 2026-07-04 | closed hosted model; not disclosed |
| muse-spark | inputPrice | 2026-07-04 | no public API — private-preview pricing undisclosed |
| muse-spark | outputPrice | 2026-07-04 | no public API — private-preview pricing undisclosed |
| muse-spark | knowledgeCutoff | 2026-07-04 | not disclosed (AA lists it as not disclosed) |
| grok-3 | sweBench | 2026-07-04 | xAI never reported SWE-bench for Grok 3; no verifiable figure |
| grok-3 | hle | 2026-07-04 | no Grok 3 figure on HLE leaderboards (Grok 4 figures only) |
| grok-3 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| grok-4-1 | mmluPro | 2026-07-04 | xAI reported EQ/writing benchmarks at launch; no academic figures |
| grok-4-1 | sweBench | 2026-07-04 | no public figure distinct from Grok 4 |
| grok-4-1 | aime | 2026-07-04 | no public figure distinct from Grok 4 |
| grok-4-1 | hle | 2026-07-04 | no public figure distinct from Grok 4 |
| grok-4-1 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| grok-4-3 | mmluPro | 2026-07-04 | AA benchmark chart referenced but no exact public number retrievable |
| grok-4-3 | sweBench | 2026-07-04 | no exact public figure found (AA/OpenRouter pages omit it) |
| grok-4-3 | aime | 2026-07-04 | no public figure; search results conflate with Grok 4 |
| grok-4-3 | hle | 2026-07-04 | no public figure; search results conflate with Grok 4 |
| grok-4-3 | lmarenaElo | 2026-07-04 | not in LMArena top listings as of July 2026 |
| grok-4-3 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards (Grok 4.20 tested, 4.3 not) |
| grok-4-3 | maxOutput | 2026-07-04 | xAI documents no fixed output cap — no number to record |
| grok-4-3 | knowledgeCutoff | 2026-07-04 | not disclosed by xAI |
| mistral-large-2 | sweBench | 2026-07-04 | Mistral reported HumanEval, not SWE-bench; no public figure |
| mistral-large-2 | aime | 2026-07-04 | never publicly evaluated on AIME |
| mistral-large-2 | hle | 2026-07-04 | predates benchmark; not on HLE leaderboards |
| mistral-large-2 | arcAgi2 | 2026-07-04 | predates benchmark; never evaluated |
| mistral-medium-3 | sweBench | 2026-07-04 | no public SWE-bench Verified figure found |
| mistral-medium-3 | aime | 2026-07-04 | no public AIME figure found |
| mistral-medium-3 | hle | 2026-07-04 | not on HLE leaderboards |
| mistral-medium-3 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| mistral-large-3 | mmluPro | 2026-07-04 | only vague "low eighties" third-party claim; no exact figure |
| mistral-large-3 | sweBench | 2026-07-04 | only rank-style third-party data (vals.ai); no exact score |
| mistral-large-3 | aime | 2026-07-04 | Mistral's 85% AIME figure is for Ministral 3 14B reasoning, not Large 3 |
| mistral-large-3 | hle | 2026-07-04 | not on HLE leaderboards; non-reasoning model |
| mistral-large-3 | lmarenaElo | 2026-07-04 | Mistral cites rank ("#2 OSS non-reasoning") but no Elo number found |
| mistral-large-3 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| mistral-large-3 | knowledgeCutoff | 2026-07-04 | not disclosed (HF card and docs omit it) |
| mistral-small-4 | sweBench | 2026-07-04 | not reported (Mistral cites LiveCodeBench/AA LCR instead) |
| mistral-small-4 | aime | 2026-07-04 | only relative claim ("matches GPT-OSS 120B"); no number |
| mistral-small-4 | hle | 2026-07-04 | not on HLE leaderboards |
| mistral-small-4 | arcAgi2 | 2026-07-04 | only relative claim on ARC-AGI tasks; no exact ARC-AGI-2 number |
| mistral-small-4 | maxOutput | 2026-07-04 | not specified in model card or docs |
| mistral-small-4 | knowledgeCutoff | 2026-07-04 | not disclosed |
| deepseek-v3 | hle | 2026-07-04 | HLE postdates model; not on official leaderboard |
| deepseek-v3 | arcAgi2 | 2026-07-04 | predates benchmark; never evaluated |
| deepseek-v3-2 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| deepseek-v4 | aime | 2026-07-04 | DeepSeek reports GSM8K/HMMT-style evals; no AIME figure found |
| deepseek-v4 | lmarenaElo | 2026-07-04 | not in LMArena top listings as of July 2026 |
| deepseek-v4 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| deepseek-v4 | knowledgeCutoff | 2026-07-04 | not disclosed |
| qwen3-235b | sweBench | 2026-07-04 | Alibaba never reported SWE-bench Verified for this variant |
| qwen3-235b | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| qwen3-max | hle | 2026-07-04 | not on HLE leaderboards |
| qwen3-max | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| qwen3-5 | aime | 2026-07-04 | Alibaba reports HMMT, not AIME, for Qwen3.5 |
| qwen3-5 | hle | 2026-07-04 | only the 27B variant's figure published; 397B not evaluated |
| qwen3-5 | lmarenaElo | 2026-07-04 | not in LMArena top listings |
| qwen3-5 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| qwen3-5 | knowledgeCutoff | 2026-07-04 | not disclosed |
| qwen3-7-max | aime | 2026-07-04 | Alibaba reports HMMT 2026 (97.1) instead of AIME |
| qwen3-7-max | lmarenaElo | 2026-07-04 | not in LMArena top listings as of July 2026 |
| qwen3-7-max | arcAgi2 | 2026-07-04 | single ambiguous "12.4% ARC-AGI" blog claim; version unclear — rejected |
| qwen3-7-max | knowledgeCutoff | 2026-07-04 | not disclosed |
| kimi-k2 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| kimi-k2-thinking | arcAgi2 | 2026-07-04 | not in Moonshot's model-card benchmark table or tracker leaderboards |
| kimi-k3 | mmluPro | 2026-07-21 | only third-party blog aggregators (78.5) days after launch; not in Moonshot's own table (which reports MMMU-Pro 81.6, a different multimodal benchmark) — rejected |
| kimi-k3 | sweBench | 2026-07-21 | Moonshot reports its own coding suite (DeepSWE 67.5, Terminal-Bench 2.1 88.3, FrontierSWE 81.2, SWE Marathon 42.0) instead of standard SWE-bench Verified; a 76.8/49% figure appears on some aggregator sites but is unconfirmed/contradictory |
| kimi-k3 | aime | 2026-07-21 | conflicting unofficial figures (88% vs 96.1%) across secondary sources, neither traceable to an official table |
| kimi-k3 | arcAgi2 | 2026-07-21 | ~~not on ARC-AGI-2 leaderboards as of July 2026; one blog cites "ARC-AGI: 8%" with version unclear — rejected~~ **superseded 2026-08-18: ARC Prize published a verified 60.4% (max effort, $1.59/task) on 2026-07-31 — filled** |
| kimi-k3 | knowledgeCutoff | 2026-07-21 | not disclosed by Moonshot in launch materials or API docs |

Data-gap-finder sweep on 2026-07-22 (models released within the last 6 months, primary sources only: lab announcements/model cards, arena.ai, official benchmark leaderboards).

| model-id | field | checked | reason |
|---|---|---|---|
| glm-5-2 | sweBench | 2026-07-22 | Zhipu/Z.ai's official reporting and HF model card give SWE-bench Pro (62.1), not SWE-bench Verified; no verified figure published |
| gpt-5-6 | sweBench | 2026-07-22 | OpenAI's GPT-5.6 announcement omits SWE-bench Verified (leads instead with Terminal-Bench, Agents' Last Exam, BrowseComp, OSWorld); no primary-source figure found |
| gpt-5-6 | aime | 2026-07-22 | not reported by OpenAI for GPT-5.6; no distinct primary-source figure found (only unrelated GPT-5 base figures) |
| soofi-s-30b-a3b | sweBench | 2026-07-22 | not evaluated in SOOFI consortium's technical report (arXiv:2607.09424) or HF model card |
| soofi-s-30b-a3b | aime | 2026-07-22 | not evaluated in arXiv:2607.09424 (Minerva Math/GSM8K reported instead) |
| soofi-s-30b-a3b | hle | 2026-07-22 | not evaluated in arXiv:2607.09424 or HF org page |
| soofi-s-30b-a3b | lmarenaElo | 2026-07-22 | not listed on arena.ai as of July 2026 |
| soofi-s-30b-a3b | arcAgi2 | 2026-07-22 | not evaluated in arXiv:2607.09424 (GPQA-Diamond/ARC-Challenge reported, not ARC-AGI-2) |
| soofi-s-30b-a3b | contextWindow | 2026-07-22 | ambiguous in arXiv:2607.09424 — base checkpoint iter_1056000 (the released model) is evaluated before the long-context Phase 3 extension to 1M tokens; a separate "Soofi S long context" checkpoint is benchmarked on RULER, so no single confirmed context-window figure for the released weights |
| soofi-s-30b-a3b | maxOutput | 2026-07-22 | not disclosed — research-preview checkpoint with no serving/API documentation |
| soofi-s-30b-a3b | inputPrice | 2026-07-22 | no public API — open-weights research preview only |
| soofi-s-30b-a3b | outputPrice | 2026-07-22 | no public API — open-weights research preview only |
| soofi-s-30b-a3b | knowledgeCutoff | 2026-07-22 | not stated in arXiv:2607.09424 or Hugging Face org page |

Stats-filler sweep on 2026-07-27. Sources checked: arena.ai text leaderboard, Artificial Analysis (model pages + gpqa-diamond / humanitys-last-exam / mmlu-pro evaluation leaderboards), BenchLM model + benchmark leaderboards (arcAgi2, mmluPro), ARC Prize verified-results pages, llm-stats ARC-AGI-v2, vals.ai MMLU-Pro, OpenRouter, official lab material (blog.google Gemini 3.6 Flash / 3.5 Flash-Lite post, anthropic.com/news/claude-opus-5, ai.meta.com Muse Spark 1.1 evaluation report, docs.x.ai Grok 4.5).

| model-id | field | checked | reason |
|---|---|---|---|
| claude-opus-5 | mmluPro | 2026-07-27 | not in Anthropic's announcement or system card; absent from AA's and BenchLM's MMLU-Pro leaderboards (both stop at Opus 4.5/4.6). A "91.59%" figure appears only in a search snippet attributed to vals.ai and could not be reproduced on the vals.ai page — rejected |
| claude-opus-5 | aime | 2026-07-27 | not published; Anthropic leads with Frontier-Bench v0.1 (43.3%), GDPval-AA v2 and ARC-AGI-3 instead |
| claude-opus-5 | lmarenaElo | 2026-07-27 | no Claude Opus 5 listing on arena.ai's text leaderboard as of 2026-07-27 (three days post-launch); BenchLM also shows Arena Elo "Not listed" — **superseded 2026-09-22: arena.ai now lists claude-opus-5-high at 1493 (max 1487) — filled** |
| claude-sonnet-5 | mmluPro | 2026-07-27 | not in Anthropic's system card; not on AA or BenchLM MMLU-Pro leaderboards |
| claude-sonnet-5 | aime | 2026-07-27 | Anthropic did not publish AIME for Sonnet 5; no third-party figure found |
| claude-sonnet-5 | arcAgi2 | 2026-07-27 | not on ARC Prize, BenchLM (19 models) or llm-stats ARC-AGI-2 leaderboards |
| claude-fable-5 | mmluPro | 2026-07-27 | re-checked: a "91.50%" vals.ai figure surfaced in search snippets but the vals.ai MMLU-Pro page could not be made to show it, and AA/BenchLM MMLU-Pro leaderboards omit Fable 5 — unverifiable, still null |
| gemini-3-6-flash | mmluPro | 2026-07-29 | absent from official DeepMind model card; Google published no academic table; BenchLM lists only MMMU-Pro 83.2 (a different, multimodal benchmark) |
| gemini-3-6-flash | sweBench | 2026-07-29 | Google reports SWE-Bench Pro 58.7% and DeepSWE v1.1 49% instead; no SWE-bench Verified figure |
| gemini-3-6-flash | aime | 2026-07-29 | not reported at launch; not on any tracker |
| gemini-3-6-flash | arcAgi2 | 2026-07-29 | ~~not on ARC Prize, BenchLM or llm-stats ARC-AGI-2 leaderboards~~ **superseded 2026-08-18: ARC Prize has since published a verified 60.4% ($0.61/task) — filled** |
| gemini-3-5-flash-lite | mmluPro | 2026-07-29 | absent from official DeepMind model card; BenchLM lists only MMMU-Pro 79.0 (different benchmark) |
| gemini-3-5-flash-lite | sweBench | 2026-07-29 | Google reports SWE-Bench Pro 54.2%; no SWE-bench Verified figure |
| gemini-3-5-flash-lite | aime | 2026-07-29 | not reported at launch; not on any tracker |
| gemini-3-5-flash-lite | arcAgi2 | 2026-07-29 | not on ARC-AGI-2 leaderboards |
| qwen3-8-max | mmluPro | 2026-08-06 | re-checked after 2026-08-03 GA launch. Not in Alibaba's own benchmark table (Aug 3 announcement) or on Artificial Analysis's mmlu-pro evaluation leaderboard (AA's Intelligence Index v4.1 no longer includes MMLU-Pro as a component) |
| qwen3-8-max | sweBench | 2026-08-06 | Alibaba's own table reports SWE-bench Pro 67.7, not SWE-bench Verified (different benchmark, not the variant this field tracks); AA has no dedicated SWE-bench Verified leaderboard entry for this model either (dropped from Intelligence Index v4.1) |
| qwen3-8-max | aime | 2026-08-06 | not in Alibaba's official benchmark table; absent from Artificial Analysis's aime-2025 evaluation leaderboard (not part of Intelligence Index v4.1) |
| qwen3-8-max | arcAgi2 | 2026-08-06 | not in Alibaba's official benchmark table; not on ARC Prize's arcprize.org/leaderboard as of 2026-08-06 |
| qwen3-8-max | costPerTask.usd | 2026-08-06 | Artificial Analysis's structured data does report a per-task figure (costPerIntelligenceIndexTask ≈ $3.26) but lists Qwen3.8 Max as a single, undifferentiated configuration with no disclosed reasoning-effort label (unlike sibling comparisons such as "GPT-5.6 Sol (high/xhigh/max)"); left unset per this run's mandatory usd/effort pairing rather than guess an effort tier |
| qwen3-8-max | costPerTask.effort | 2026-08-06 | same — no effort tier disclosed by Artificial Analysis for this model |
| qwen3-8-max | speed.outputTokensPerSec | 2026-08-06 | Artificial Analysis reports outputSpeed ≈ 61.8 t/s but, as above, discloses no effort tier for this model; left unset per the mandatory speed/effort pairing |
| qwen3-8-max | speed.timeToFirstTokenSec | 2026-08-06 | same — AA reports TTFT ≈ 2.56s but with no disclosed effort tier |
| qwen3-8-max | speed.effort | 2026-08-06 | same — no effort tier disclosed by Artificial Analysis for this model |
| qwen3-8-max | knowledgeCutoff | 2026-08-06 | re-checked after GA launch; not disclosed on Alibaba's Aug 3 announcement, Alibaba Cloud Model Studio's model-info page, or Artificial Analysis's model page |
| muse-spark-1-1 | mmluPro | 2026-07-27 | Meta's Muse Spark 1.1 Evaluation Report is a safety/preparedness document with no MMLU/GPQA/AIME/ARC table; not on MMLU-Pro leaderboards |
| muse-spark-1-1 | sweBench | 2026-07-27 | Meta reports SWE-Bench Pro 61.5% and "24 of 42 SWE-Bench Verified Hard tasks resolved at least once" — neither is a SWE-bench Verified score |
| muse-spark-1-1 | aime | 2026-07-27 | not in Meta's evaluation report or on trackers |
| muse-spark-1-1 | arcAgi2 | 2026-07-27 | only the original Muse Spark (42.5%) is on the ARC-AGI-2 leaderboards; 1.1 has not been tested |
| muse-spark-1-1 | knowledgeCutoff | 2026-07-27 | not stated in Meta's evaluation report or Meta Model API docs |
| grok-4-5 | mmluPro | 2026-07-27 | xAI published no classic academic benchmarks at launch; not on MMLU-Pro leaderboards |
| grok-4-5 | sweBench | 2026-07-27 | xAI leads with SWE-Bench Pro 64.7% / SWE Marathon 29.0%; no SWE-bench Verified figure |
| grok-4-5 | aime | 2026-07-27 | not published by xAI; no third-party figure |
| grok-4-5 | maxOutput | 2026-07-27 | xAI's docs (docs.x.ai/developers/models/grok-4.5) document the 500K context and tiered pricing but state no output cap; a "30K" figure appears only on secondary blogs |
| gemma-4 | sweBench | 2026-07-27 | Google published no coding table; only SWE-Rebench 41.6% (a different split) is available via BenchLM |
| gemma-4 | arcAgi2 | 2026-07-27 | not on ARC Prize, BenchLM or llm-stats ARC-AGI-2 leaderboards |
| gemma-4 | maxOutput | 2026-07-27 | not specified on OpenRouter, Artificial Analysis or BenchLM for the 31B variant; a "262,144" figure seen in one search snippet just echoes the context window |
| gpt-5-6-terra | mmluPro | 2026-07-29 | OpenAI published only agentic suites per tier; no per-tier academic table |
| gpt-5-6-terra | gpqaDiamond | 2026-07-29 | not on Artificial Analysis' Terra model page (Intelligence Index only); a 92.5% figure appears on routing catalogues but is untraceable to a primary source |
| gpt-5-6-terra | sweBench | 2026-07-29 | not published for any GPT-5.6 tier |
| gpt-5-6-terra | aime | 2026-07-29 | not published for any GPT-5.6 tier |
| gpt-5-6-terra | hle | 2026-07-29 | component of AA's Intelligence Index but not broken out per tier |
| gpt-5-6-terra | lmarenaElo | 2026-07-29 | no gpt-5.6-terra listing on arena.ai (only the Sol variants) |
| gpt-5-6-terra | arcAgi2 | 2026-07-29 | ARC Prize published Sol only; Terra untested — **superseded 2026-09-22: ARC Prize has since published a Terra results page — 83.9% at max effort — filled** |
| gpt-5-6-terra | knowledgeCutoff | 2026-07-29 | not disclosed per tier; Sol's 2026-02 not confirmed to apply to Terra |
| nemotron-3-ultra | mmluPro | 2026-07-29 | NVIDIA's technical report has ablation/quantisation tables rather than one headline model table; could not attribute a final-model figure |
| nemotron-3-ultra | gpqaDiamond | 2026-07-29 | same — report shows both 'GPQA Diamond' and 'GPQA no tools' rows across many configs; no unambiguous final figure |
| nemotron-3-ultra | sweBench | 2026-07-29 | not reported for Ultra — **superseded 2026-09-22: NVIDIA's BF16 model card on Hugging Face has a single evaluation table with SWE-Bench Verified 70.7 — filled (Terminal Bench 2.1 56.4 and HLE no-tools 26.7 filled from the same table)** |
| nemotron-3-ultra | aime | 2026-07-29 | not reported; report cites IMO AnswerBench instead |
| nemotron-3-ultra | hle | 2026-07-29 | multiple HLE rows across ablations (no-tools and with-tools); no unambiguous final figure — **superseded 2026-09-22: model card table gives "HLE (no tools)" 26.7 / "HLE (with tools)" 37.4 — filled with the no-tools figure** |
| nemotron-3-ultra | lmarenaElo | 2026-07-29 | no Nemotron 3 Ultra listing on arena.ai |
| nemotron-3-ultra | arcAgi2 | 2026-07-29 | not tested by ARC Prize |
| nemotron-3-super | gpqaDiamond | 2026-07-29 | reported 79.23 is labelled 'GPQA no tools', which NVIDIA's report treats as distinct from GPQA Diamond |
| nemotron-3-super | lmarenaElo | 2026-07-29 | no Nemotron 3 Super listing on arena.ai |
| nemotron-3-super | arcAgi2 | 2026-07-29 | not tested by ARC Prize |

Weekly release-scan sweep on 2026-08-02 (new model: DeepSeek-V4-Flash-0731, released 2026-07-31). Sources checked: DeepSeek API changelog coverage, Artificial Analysis model/comparison pages, Hugging Face model card, TechTimes, MarkTechPost, OfficeChai, XenoSpectrum. WebFetch was unavailable for primary-source pages this run (proxy returned 403 on all fetches, including non-target control URLs); findings rest on WebSearch-synthesized excerpts from the sources above, cross-checked across at least two independent outlets each.

| model-id | field | checked | reason |
|---|---|---|---|
| deepseek-v4-flash-0731 | mmluPro | 2026-08-02 | not broken out for this build in any source found; only a vague "close to V4-Pro-Max" claim, no number |
| deepseek-v4-flash-0731 | sweBench | 2026-08-02 | DeepSeek reports DeepSWE and DSBench-FullStack instead of SWE-bench Verified; no comparable figure |
| deepseek-v4-flash-0731 | aime | 2026-08-02 | not reported by DeepSeek or Artificial Analysis for this build |
| deepseek-v4-flash-0731 | lmarenaElo | 2026-08-02 | not listed on arena.ai as of 2026-08-02 |
| deepseek-v4-flash-0731 | knowledgeCutoff | 2026-08-02 | not disclosed for the 0731 build specifically; only an unverifiable inference that it matches the April preview's cutoff |
| deepseek-v4-flash-0731 | costPerTask.usd | 2026-08-02 | Artificial Analysis states only an approximate "~$0.03 at max effort"; the precise `intelligenceIndexCostPerTask.cost.total` figure this field requires could not be retrieved (AA's model page returned 403 on direct fetch) |

Stats-filler sweep on 2026-08-03, scoped to `laguna-s-2-1`. Sources checked: poolside.ai/blog/introducing-laguna-s-2-1, Hugging Face model cards (poolside/Laguna-S-2.1 and Laguna-S-2.1-FP8), OpenRouter, Artificial Analysis (model slug 404, open-source model list, creator filter), arena.ai text leaderboard, BenchLM model page, ARC Prize leaderboard, llm-stats/pricepertoken HLE + MMLU-Pro leaderboards, The Decoder, VentureBeat, MarkTechPost.

| model-id | field | checked | reason |
|---|---|---|---|
| laguna-s-2-1 | mmluPro | 2026-08-03 | never evaluated — poolside published agentic coding evals only; BenchLM shows "not listed" and the model is absent from MMLU-Pro leaderboards |
| laguna-s-2-1 | gpqaDiamond | 2026-08-03 | never evaluated — no knowledge/science benchmark in poolside's blog or model card, and no third-party run found |
| laguna-s-2-1 | sweBench | 2026-08-03 | poolside reports SWE-bench Multilingual (78.5) and SWE-Bench Pro public (59.4), not SWE-bench Verified; neither is a Verified score and no Verified figure exists for this model (its sibling XS 2.1 does have one — do not carry it across) |
| laguna-s-2-1 | aime | 2026-08-03 | never evaluated — coding specialist, no maths benchmark published or run by any tracker |
| laguna-s-2-1 | hle | 2026-08-03 | never evaluated — not on Artificial Analysis, llm-stats or pricepertoken HLE leaderboards |
| laguna-s-2-1 | lmarenaElo | 2026-08-03 | no poolside/Laguna entry on arena.ai's text leaderboard (385 models) as of 2026-08-03 |
| laguna-s-2-1 | arcAgi2 | 2026-08-03 | not on ARC Prize or BenchLM ARC-AGI-2 leaderboards; never tested |
| laguna-s-2-1 | costPerTask.usd | 2026-08-03 | Artificial Analysis does not cover poolside at all — no model page (404), and poolside is absent from AA's open-source model list and creator filter, so there is no Intelligence Index cost-per-task figure at any effort level |
| laguna-s-2-1 | costPerTask.effort | 2026-08-03 | same — no AA coverage, so no effort level to record |

New-model-release research on 2026-08-05, scoped to `claude-sonnet-4-6`. Sources checked: anthropic.com/news/claude-sonnet-4-6, Claude Sonnet 4.6 system card (www-cdn.anthropic.com/78073f739564e986ff3e28522761a7a0b4484f84.pdf), platform.claude.com/docs/en/about-claude/models/overview, platform.claude.com/docs/en/about-claude/model-deprecations, docs.aws.amazon.com Bedrock model card, arena.ai text leaderboard, artificialanalysis.ai model pages (claude-sonnet-4-6 and claude-sonnet-4-6-adaptive).

| model-id | field | checked | reason |
|---|---|---|---|
| claude-sonnet-4-6 | mmluPro | 2026-08-05 | not reported — the system card's capability table reports MMMLU (89.3%) and MMMU-Pro (multimodal), neither of which is MMLU-Pro; not found on any MMLU-Pro leaderboard |
| claude-sonnet-4-6 | terminalBench | 2026-08-05 | system card reports Terminal-Bench **2.0** only (59.1%, default thinking); per house style 2.0 scores aren't comparable to the tracked 2.1 metric, so left null and the 2.0 figure recorded in notes instead |

New-model-release research on 2026-08-06, scoped to `mach-1-additive-35b`. Sources checked: withsyzygy.com/mach-1, withsyzygy.com/about, X/@syzygyeng announcement post, Hugging Face org and model page (SyzygyResearch/Mach-1-Additive-35B, incl. raw README/config.json/LICENSE), Hugging Face API metadata, GitHub org SyzygyResearch, search for Artificial Analysis/OpenRouter/LMArena coverage.

| model-id | field | checked | reason |
|---|---|---|---|
| mach-1-additive-35b | mmluPro | 2026-08-06 | Syzygy publishes only retention % vs its teacher (Qwen3.6-35B-A3B) across 12 evals (MMLU-Redux, not MMLU-Pro, among them); no absolute score on any tracked benchmark |
| mach-1-additive-35b | gpqaDiamond | 2026-08-06 | not evaluated/published anywhere found |
| mach-1-additive-35b | sweBench | 2026-08-06 | not evaluated/published; closest reported evals are BFCL-v3 and τ²-bench, both as retention % |
| mach-1-additive-35b | terminalBench | 2026-08-06 | not evaluated/published |
| mach-1-additive-35b | aime | 2026-08-06 | only AIME25/AIME26 *retention* percentages (99.1%/99.5%) vs teacher published, not an absolute score |
| mach-1-additive-35b | hle | 2026-08-06 | not evaluated/published |
| mach-1-additive-35b | lmarenaElo | 2026-08-06 | no LMArena listing found; too new (released 2026-08-03) |
| mach-1-additive-35b | arcAgi2 | 2026-08-06 | not evaluated/published |
| mach-1-additive-35b | maxOutput | 2026-08-06 | not disclosed in model card, config.json, or landing page |
| mach-1-additive-35b | knowledgeCutoff | 2026-08-06 | not disclosed by Syzygy; teacher model's cutoff not confirmed either |
| mach-1-additive-35b | speed | 2026-08-06 | not covered by Artificial Analysis; Syzygy's own claim ("up to 120 tokens/sec" on consumer hardware) is vendor-reported, not an AA measurement, so left null per the required AA sourcing and quoted in notes instead |
| mach-1-additive-35b | costPerTask | 2026-08-06 | no public API and no Artificial Analysis coverage |
| mach-1-additive-35b | pricing | 2026-08-06 | no public API — weights-only / local inference, no per-token price exists |

New-model-release research on 2026-08-07, scoped to `seed-2-0-pro` and `seed-2-1-pro` (new company ByteDance). Sources checked: Seed2.0 Model Card PDF (lf3-static.bytednsdoc.com, official ByteDance Seed technical report, full text/tables extracted directly), seed.bytedance.com blog posts for Seed2.0 and Seed2.1, research.doubao.com/en/seed2, docs.volcengine.com model docs, artificialanalysis.ai (searched, no Doubao Seed 2.x Pro coverage found), llm-stats.com, CloudPrice, datanorth.ai, aibase.com, llmreference.com, benchquill.com, ofox.ai.

| model-id | field | checked | reason |
|---|---|---|---|
| seed-2-0-pro | terminalBench | 2026-08-07 | official model card Table 11 reports Terminal-Bench **2.0** (55.8), not the tracked 2.1 metric; recorded in notes instead |
| seed-2-0-pro | lmarenaElo | 2026-08-07 | model card cites only a leaderboard rank ("ranks 6th... as of Feb 16, 2026"), not an Elo score; no exact figure found on arena.ai |
| seed-2-0-pro | costPerTask.usd/.effort | 2026-08-07 | Artificial Analysis has no model page for Doubao Seed 2.0 Pro found |
| seed-2-0-pro | speed | 2026-08-07 | same — no Artificial Analysis coverage found |
| seed-2-0-pro | knowledgeCutoff | 2026-08-07 | not stated in the official model card; a third-party "January 2024" claim (llm-stats.com) is implausibly stale for a Feb 2026 SOTA-claiming release and was rejected as unreliable |
| seed-2-0-pro | contextWindow/maxOutput | 2026-08-07 | not found on an official ByteDance spec page; used third-party API-tracker consensus (256K/128K) instead, flagged as secondary-sourced in notes |
| seed-2-1-pro | mmluPro/gpqaDiamond/sweBench/terminalBench/aime/hle/lmarenaElo/arcAgi2 | 2026-08-07 | ByteDance published no model card or benchmark table for Seed 2.1 at launch (confirmed via research.doubao.com/en/seed2, which lists only the Seed2.0 model card); official blog makes qualitative claims only ("leading scores on Terminal Bench 2.1, SWE-Pro and SciCode") with no numbers |
| seed-2-1-pro | costPerTask/speed | 2026-08-07 | no Artificial Analysis coverage found |
| seed-2-1-pro | knowledgeCutoff | 2026-08-07 | not published by ByteDance for Seed 2.1 (explicitly noted as unpublished by multiple secondary sources) |
| seed-2-1-pro | maxOutput | 2026-08-07 | conflicting/confused third-party figures (some list max output equal to the 256K context window, which reads like a table-parsing error); left null rather than guess |

New-model-release research on 2026-08-07, scoped to `minimax-m2`, `minimax-m2-5` and `minimax-m3` (new company MiniMax). Sources checked: minimax.io/news (m2, m25) and minimax.io/blog/minimax-m3, huggingface.co/MiniMaxAI model cards (M2, M2.5, M3) and their README/LICENSE files, github.com/MiniMax-AI license files, platform.minimax.io/docs (release-notes/models, guides/text-generation), artificialanalysis.ai model pages, openrouter.ai listings, aiknowledgecutoff.com.

| model-id | field | checked | reason |
|---|---|---|---|
| minimax-m2 | terminalBench | 2026-08-07 | HF README reports "Terminal-Bench: 46.3" with no version label (2.0 vs 2.1); not the confirmed 2.1 metric this field tracks |
| minimax-m2 | lmarenaElo | 2026-08-07 | no MiniMax-M2 text-arena Elo found on arena.ai |
| minimax-m2 | arcAgi2 | 2026-08-07 | not on ARC Prize's official leaderboard or any tracker checked |
| minimax-m2 | maxOutput | 2026-08-07 | MiniMax's own API docs state no max-output figure; a third-party 131,072 (OpenRouter) figure was not corroborated by an official source |
| minimax-m2 | knowledgeCutoff | 2026-08-07 | not stated by MiniMax; third-party trackers (aiknowledgecutoff.com) don't list a cutoff for M2 specifically |
| minimax-m2 | costPerTask.usd/.effort | 2026-08-07 | Artificial Analysis renders the per-task figure as a JS/SVG chart not extractable via static fetch |
| minimax-m2-5 | mmluPro | 2026-08-07 | absent from MiniMax's own Hugging Face benchmark table; a third-party 74% figure is uncorroborated and inconsistent with M2's official 82 given M2.5's gains elsewhere |
| minimax-m2-5 | terminalBench | 2026-08-07 | no Terminal-Bench 2.1 figure found for M2.5 specifically |
| minimax-m2-5 | lmarenaElo | 2026-08-07 | no MiniMax-M2.5 text-arena Elo found on arena.ai |
| minimax-m2-5 | arcAgi2 | 2026-08-07 | not on ARC Prize's official leaderboard or any tracker checked |
| minimax-m2-5 | maxOutput | 2026-08-07 | not stated in MiniMax's official docs; conflicting uncorroborated third-party figures (8K vs 196,608) found |
| minimax-m2-5 | knowledgeCutoff | 2026-08-07 | not stated by MiniMax |
| minimax-m2-5 | costPerTask.usd/.effort | 2026-08-07 | same JS/SVG rendering issue on Artificial Analysis |
| minimax-m3 | mmluPro | 2026-08-07 | MiniMax's launch benchmark table is an embedded image, not machine-readable; no independent source reproduced this score |
| minimax-m3 | gpqaDiamond | 2026-08-07 | same — image-only benchmark table, not reproduced elsewhere |
| minimax-m3 | aime | 2026-08-07 | same — image-only benchmark table, not reproduced elsewhere |
| minimax-m3 | hle | 2026-08-07 | same — image-only benchmark table, not reproduced elsewhere |
| minimax-m3 | lmarenaElo | 2026-08-07 | no MiniMax-M3 text-arena Elo found on arena.ai — **superseded 2026-09-22: arena.ai now lists minimax-m3 at 1441 — filled** |
| minimax-m3 | arcAgi2 | 2026-08-07 | not on ARC Prize's official leaderboard or any tracker checked |
| minimax-m3 | maxOutput | 2026-08-07 | MiniMax's own docs describe only "up to 1M tokens context window with a guaranteed minimum of 512K," no separate max-output figure stated |
| minimax-m3 | knowledgeCutoff | 2026-08-07 | not stated by MiniMax; a third-party "January 2026" claim found in search snippets was not traced to a primary source |
| minimax-m3 | costPerTask.usd/.effort | 2026-08-07 | same JS/SVG rendering issue on Artificial Analysis |

New-model-release research on 2026-08-07, scoped to `gpt-oss-120b` and `gpt-oss-20b`. Sources checked: openai.com/index/introducing-gpt-oss/ (403 on direct fetch, used via search cache), huggingface.co/openai/gpt-oss-120b and /gpt-oss-20b model cards, arxiv.org/html/2508.10925v1 (official model card, Table 3), developers.openai.com/api/docs/models/gpt-oss-120b and /gpt-oss-20b, docs.aws.amazon.com Bedrock model cards, artificialanalysis.ai model pages for both, openrouter.ai listings, vals.ai Terminal-Bench 2.1 leaderboard, Hacker News threads on real-world use.

| model-id | field | checked | reason |
|---|---|---|---|
| gpt-oss-120b | terminalBench | 2026-08-07 | only a Terminal-Bench **2.0** figure (18.7±2.7%) found, not the tracked 2.1 metric; recorded in notes instead |
| gpt-oss-120b | lmarenaElo | 2026-08-07 | not found on arena.ai's current leaderboard or in any tracker with an exact Elo number |
| gpt-oss-120b | arcAgi2 | 2026-08-07 | not on ARC Prize's official leaderboard or any tracker checked |
| gpt-oss-120b | costPerTask.usd | 2026-08-07 | Artificial Analysis' model page renders the per-task figure as a JS/SVG chart not extractable via static fetch; only the total cost to run the full Intelligence Index suite ($94.61–$96.28, not a per-task figure) was textually retrievable |
| gpt-oss-120b | costPerTask.effort | 2026-08-07 | same — no per-task figure to attach an effort label to |
| gpt-oss-20b | terminalBench | 2026-08-07 | only Terminal-Bench **2.0** figures found (conflicting: 3.1% vs 3.4%), not the tracked 2.1 metric; recorded in notes instead |
| gpt-oss-20b | lmarenaElo | 2026-08-07 | not found on arena.ai's current leaderboard with an exact Elo number |
| gpt-oss-20b | arcAgi2 | 2026-08-07 | not on ARC Prize's official leaderboard or any tracker checked |
| gpt-oss-20b | costPerTask.usd | 2026-08-07 | same JS/SVG rendering issue as gpt-oss-120b; only total suite cost ($32.69) was textually retrievable |
| gpt-oss-20b | costPerTask.effort | 2026-08-07 | same — no per-task figure to attach an effort label to |

New-model-release research on 2026-08-06, scoped to `ling-2-6-1t`. Sources checked: huggingface.co/inclusionAI/Ling-2.6-1T (model page, raw README, raw config.json — no raw config found, benchmark table appears to be an embedded image not extractable via text fetch), github.com/inclusionAI/Ling-V2 (does not cover the 1T-scale checkpoints), arxiv.org/abs/2606.15079 (Ling and Ring 2.6 Technical Report — PDF not machine-readable via fetch tool), artificialanalysis.ai/models/ling-2-6-1t, openrouter.ai/inclusionai/ling-2.6-1t, ant-ling.com and developer.ant-ling.com/en/blogs, plus aggregator cross-checks (aiflashreport.com, howaiworks.ai, i-scoop.eu, phemex.com, ufukozen.com) and Chinese coverage (yicai.com, ithome.com, chinaz.com, sohu.com) for the announcement date.

| model-id | field | checked | reason |
|---|---|---|---|
| ling-2-6-1t | mmluPro | 2026-08-06 | not reported in any source found (official or third-party) |
| ling-2-6-1t | terminalBench | 2026-08-06 | aiflashreport.com reports "TerminalBench-Hard: 31.1%", a different variant from the tracked Terminal-Bench 2.1; not recorded per house style |
| ling-2-6-1t | lmarenaElo | 2026-08-06 | no arena.ai listing found as of 2026-08-06 |
| ling-2-6-1t | arcAgi2 | 2026-08-06 | not reported by Ant Group or on ARC Prize/tracker leaderboards |
| ling-2-6-1t | knowledgeCutoff | 2026-08-06 | not disclosed in the HF model card, technical report abstract, or any secondary source found |
| ling-2-6-1t | costPerTask | 2026-08-06 | Artificial Analysis' model page did not surface an Intelligence Index cost-per-task figure via available fetch; only a composite Intelligence Index score (~26, "estimated") was retrievable |
| ling-2-6-1t | speed | 2026-08-06 | Artificial Analysis' page reported output speed as "N/A"/unmeasured at time of check |
| ling-2-6-1t | releaseDate | 2026-08-06 | sources conflict: Chinese press (yicai.com, ithome.com, chinaz.com, sohu.com) converge on an April 24 announcement with April 30 open-source date; Artificial Analysis and aiflashreport.com both state April 23; phemex.com states April 27. Used the April 24 date (best-corroborated across independent outlets); April 30 open-source date noted separately in the model's `notes` |
| ling-2-6-1t | predecessorId | 2026-08-06 | secondary sources name different predecessors inconsistently (phemex.com says Ling-1T; howaiworks.ai says Ling-2.5-1T/Ring-2.5-1T from 2026-02-15); no explicit primary-source replacement statement found, and neither candidate is tracked in this dataset regardless — left null |

New-model-release research on 2026-08-07, scoped to `ernie-5-0` and `ernie-5-1` (Baidu, new company). Sources checked: ernie.baidu.com/blog (5.0 launch post, 5.1 release post, LMArena-update posts for both preview builds), arxiv.org/abs/2602.04705 (ERNIE 5.0 Technical Report), arena.ai/leaderboard/text (official LMArena leaderboard), artificialanalysis.ai (searched, no ERNIE 5.0/5.1 model page found — only "ERNIE 5.0 Thinking Preview", a different variant), llmreference.com, apidog.com API guides, aigazine.com and felloai.com hands-on coverage, VentureBeat, the-decoder.com.

| model-id | field | checked | reason |
|---|---|---|---|
| ernie-5-0 | sweBench | 2026-08-07 | not reported in the Technical Report (which covers LiveCodeBench/HumanEval+ instead) or any independent leaderboard found |
| ernie-5-0 | terminalBench | 2026-08-07 | not reported anywhere found |
| ernie-5-0 | arcAgi2 | 2026-08-07 | not on ARC Prize's official leaderboard or any tracker checked |
| ernie-5-0 | knowledgeCutoff | 2026-08-07 | not disclosed by Baidu in the model card, technical report, or any secondary source |
| ernie-5-0 | costPerTask | 2026-08-07 | Artificial Analysis has not indexed ERNIE 5.0 (only a separate "ERNIE 5.0 Thinking Preview" variant with $0 pricing shown, evidently a free-preview listing, not usable as this model's cost) |
| ernie-5-0 | speed | 2026-08-07 | same — no AA measurement for this specific checkpoint |
| ernie-5-1 | mmluPro | 2026-08-07 | Baidu's own release post says only "approaches leading closed-source models," no exact figure given; a third-party aggregator figure (85.6) could not be corroborated against a primary source, so left null rather than used |
| ernie-5-1 | gpqaDiamond | 2026-08-07 | same as mmluPro — no exact official figure; an uncorroborated third-party figure (82.1) not used |
| ernie-5-1 | sweBench | 2026-08-07 | not reported by Baidu or found on any independent leaderboard |
| ernie-5-1 | terminalBench | 2026-08-07 | not reported anywhere found |
| ernie-5-1 | hle | 2026-08-07 | not reported anywhere found |
| ernie-5-1 | arcAgi2 | 2026-08-07 | not on ARC Prize's official leaderboard or any tracker checked |
| ernie-5-1 | knowledgeCutoff | 2026-08-07 | not disclosed by Baidu anywhere found |
| ernie-5-1 | costPerTask | 2026-08-07 | Artificial Analysis has not indexed ERNIE 5.1 as of this check |
| ernie-5-1 | speed | 2026-08-07 | same — no AA measurement found |

New-model-release research on 2026-08-07, scoped to `nova-premier` and `nova-2-pro` (Amazon, new company). Sources checked: aws.amazon.com/blogs/aws (Nova Premier launch post), docs.aws.amazon.com/bedrock/latest/userguide (Nova Premier and Nova 2 Lite model-card pages — Nova 2 Pro's returns 404), docs.aws.amazon.com/nova/latest/nova2-userguide (What is Nova 2 / What's new in Nova 2), assets.amazon.science/.../nova-2-0-technical-report2.pdf (official Nova 2 Family Technical Report, PDF, rendered via pdftotext), artificialanalysis.ai/models/nova-premier and /nova-2-0-pro and /nova-2-0-pro-reasoning-medium, TechCrunch, aboutamazon.com re:Invent announcement.

| model-id | field | checked | reason |
|---|---|---|---|
| nova-premier | terminalBench | 2026-08-07 | only a Terminal-Bench **1.0** figure (11.3%) found in the official technical report, not the tracked 2.1 metric; recorded in notes instead |
| nova-premier | hle | 2026-08-07 | not reported by Amazon or found on any independent leaderboard |
| nova-premier | arcAgi2 | 2026-08-07 | not reported by Amazon or found on any independent leaderboard |
| nova-premier | lmarenaElo | 2026-08-07 | Nova Premier is not listed on arena.ai's Text leaderboard |
| nova-premier | costPerTask | 2026-08-07 | Artificial Analysis' Nova Premier page shows only a composite Intelligence Index score (13), not a per-task USD figure |
| nova-2-pro | terminalBench | 2026-08-07 | only a Terminal-Bench **1.0** figure (41.3%) found in the official technical report, not the tracked 2.1 metric; recorded in notes instead |
| nova-2-pro | hle | 2026-08-07 | not reported by Amazon or found on any independent leaderboard |
| nova-2-pro | arcAgi2 | 2026-08-07 | not reported by Amazon or found on any independent leaderboard |
| nova-2-pro | lmarenaElo | 2026-08-07 | not listed on arena.ai's Text leaderboard as of this check |
| nova-2-pro | costPerTask | 2026-08-07 | neither the non-reasoning nor medium-reasoning Artificial Analysis pages for Nova 2.0 Pro Preview publish a per-task USD figure |
| nova-2-pro | knowledgeCutoff | 2026-08-07 | not disclosed by Amazon anywhere found (Nova 2 Lite's cutoff, Oct 2025, is published, but Pro's specifically is not) |

New-model-release research on 2026-08-07, scoped to `command-a` and `command-a-plus` (Cohere, new company). Sources checked: cohere.com/blog (Command A and Command A+ announcement posts), docs.cohere.com (command-a, command-a-plus, models list, pricing/rate-limits pages), huggingface.co/CohereLabs (c4ai-command-a-03-2025 and command-a-plus-05-2026 model cards), artificialanalysis.ai/models/command-a and /command-a-plus, openrouter.ai/cohere/command-a, arena.ai/leaderboard/text (no Cohere models present).

| model-id | field | checked | reason |
|---|---|---|---|
| command-a | mmluPro / gpqaDiamond / sweBench / terminalBench / aime / hle / lmarenaElo / arcAgi2 | 2026-08-07 | Cohere's launch blog renders its comparison charts as images, not extractable text; not on arena.ai; Artificial Analysis' page gives only a composite Intelligence Index score (7), not isolable per-benchmark figures |
| command-a | costPerTask | 2026-08-07 | Artificial Analysis' Command A page doesn't surface a per-task USD figure, only pricing and the composite index |
| command-a-plus | mmluPro / gpqaDiamond / sweBench / terminalBench / aime / hle / lmarenaElo / arcAgi2 | 2026-08-07 | Cohere's own announcement reports only Cohere-specific/multimodal suites (MMMU, MathVista, CharXiv, τ²-Bench, Terminal-Bench Hard) and a composite AA Intelligence Index (37), none of which map onto the tracked eight keys; not on arena.ai |
| command-a-plus | pricing (input/output) | 2026-08-07 | neither Cohere's pricing page nor docs list a rate for command-a-plus-05-2026 (both defer to a sales-contact flow); Artificial Analysis shows $0.00/$0.00, read as an unpopulated placeholder rather than a real price and not used |
| command-a-plus | costPerTask | 2026-08-07 | same placeholder issue — AA shows $0.00 cost per task for this model, not used |
| command-a-plus | knowledgeCutoff | 2026-08-07 | not disclosed by Cohere anywhere found |
| gpt-5-6-cyber | mmluPro / gpqaDiamond / sweBench / terminalBench / aime / hle / lmarenaElo / arcAgi2 | 2026-08-12 | OpenAI published only cyber-specific evals for this model (Advanced Cybersecurity Completion Rate 95.0%, ExploitGym, Preparedness cyber rating High) — none map onto the tracked eight keys; no third-party general-capability scores exist because access is gated behind Daybreak Red, and it is absent from arena.ai and Artificial Analysis |
| grok-4-6 | mmluPro / gpqaDiamond / sweBench / aime / hle / lmarenaElo | 2026-08-14 | xAI's own card reports only deepSwe, CursorBench, FrontierCode, SWE-Marathon, Terminal-Bench 3.0, APEX-Agents, DeepSearchQA and CyberGym — none map to these keys; AA publishes the composite index plus Terminal-Bench 2.1 (recorded) but no per-benchmark breakdown for the rest; no arena.ai listing exists, and the widely-quoted "1753 Elo" is GDPval-AA v2, not LMArena. (arcAgi2 was originally in this row; superseded 2026-08-18 when ARC Prize published a verified 67.1% ($0.76/task) — filled) |
| qwen3-8-2-4t-a95b | mmluPro / sweBench / aime / lmarenaElo / arcAgi2 | 2026-08-14 | absent from Alibaba's own model-card benchmark table (which reports GPQA Diamond, Terminal-Bench 2.1, HLE, SWE-bench Pro, Deep SWE, PaperBench and IFBench); SWE-bench Pro 67.7 is not the Verified variant tracked here; no arena.ai listing for the open-weight variant |
| nemotron-3-5-lightning | aime / lmarenaElo / arcAgi2 | 2026-08-14 | not in NVIDIA's model-card benchmark table (which covers MMLU-Pro, GPQA Diamond, SWE-bench Verified, Terminal-Bench 2.1, HLE, SciCode, IFBench and AA-LCR); no arena.ai listing |

New-model-release research on 2026-08-16, scoped to `gemini-3-7-flash`, `qwen3-8-27b` and `glm-5-3`. WebFetch returned `EGRESS_BLOCKED` for nearly every target domain this session (blog.google, deepmind.google, ai.google.dev, artificialanalysis.ai, huggingface.co, docs.z.ai, marktechpost.com, venturebeat.com, openrouter.ai, and most secondary trackers; storage.googleapis.com PDFs were reachable but image-based/not machine-readable) — findings rest on WebSearch-synthesized excerpts, cross-checked across multiple independent outlets each where possible.

| model-id | field | checked | reason |
|---|---|---|---|
| gemini-3-7-flash | mmluPro | 2026-08-16 | not reported by Google at launch (headline table is DeepSWE v1.1/FrontierCode 1.1/AutomationBench/WebDev Arena instead); not found on any MMLU-Pro tracker |
| gemini-3-7-flash | sweBench | 2026-08-16 | Google published no SWE-bench Verified figure for 3.7 Flash (DeepSWE v1.1 65.3% and FrontierCode 1.1 Main 43.6% reported instead, neither of which is SWE-bench) |
| gemini-3-7-flash | aime | 2026-08-16 | not reported by Google; not found on any AIME tracker |
| gemini-3-7-flash | lmarenaElo | 2026-08-16 | ~~not found on arena.ai's text leaderboard; only the separate WebDev Arena Elo (1588, a different arena) was published~~ **superseded 2026-09-03: arena.ai now lists 'gemini-3.7-flash-high' at 1491 (rank 11, preliminary) — filled** |
| gemini-3-7-flash | arcAgi2 | 2026-08-16 | ~~not reported by Google; not found on ARC Prize or tracker leaderboards~~ **superseded 2026-09-03: ARC Prize has since published a verified 84.6% at high effort ($0.25/task; arcprize.org/results/google-gemini-3-7-flash) — filled** |
| qwen3-8-27b | mmluPro | 2026-08-16 | not in Alibaba's own release material or on any MMLU-Pro tracker found |
| qwen3-8-27b | sweBench | 2026-08-16 | Alibaba reports SWE-bench Pro (61.7%), not the Verified variant this field tracks |
| qwen3-8-27b | aime | 2026-08-16 | no AIME figure published or found on any tracker |
| qwen3-8-27b | hle | 2026-08-16 | secondary coverage references the model's HLE standing relative to Qwen3.7-Plus and Opus 4.6 Max without giving an absolute score; no exact figure traceable to a primary source |
| qwen3-8-27b | lmarenaElo | 2026-08-16 | no arena.ai text-leaderboard listing found |
| qwen3-8-27b | arcAgi2 | 2026-08-16 | not reported by Alibaba; not on ARC Prize or tracker leaderboards |
| qwen3-8-27b | knowledgeCutoff | 2026-08-16 | not disclosed by Alibaba in the GitHub repo, HF listing (blocked from direct fetch) or any secondary source found; explicitly called out as undisclosed by one source |
| glm-5-3 | mmluPro / gpqaDiamond / sweBench / aime / hle / lmarenaElo / arcAgi2 | 2026-08-16 | Z.ai's launch benchmark table is entirely agentic/coding/cyber (Terminal-Bench 2.1/3.0, DeepSWE v1.1, SWE-Marathon v1.1, AutomationBench, Agents' Last Exam, CyberGym) — none of the tracked knowledge/reasoning keys were re-reported, consistent with Z.ai's stated "same base model, post-training only" framing; not on arena.ai or Artificial Analysis (too new, no public API pricing or weights yet) — **lmarenaElo superseded 2026-09-22: arena.ai now lists glm-5.3-max at 1483 — filled; the other cells stand** |
| glm-5-3 | knowledgeCutoff | 2026-08-16 | not disclosed for the 5.3 post-training run specifically; GLM-5.2's cutoff (2026-03) is not confirmed to carry over |
| glm-5-3 | pricing (input/output) | 2026-08-16 | Z.ai's official pricing table still ends at GLM-5.2 with no GLM-5.3 row; only the GLM Coding Plan's flat monthly subscription tiers ($18/$80/$168) are public, not a per-token rate |

New-model-release research on 2026-08-18 (daily sweep), scoped to `deepseek-v4-pro-0813` (released 2026-08-13; missed by the 08-14 and 08-17 scans). WebFetch was not permitted at all this session — findings rest on WebSearch-synthesized excerpts, cross-checked across at least two independent outlets each. Sources checked: DeepSeek's Hugging Face model card (huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813, via mirrored README text on Fireworks/DeepInfra), DeepSeek's API-pricing post on X (x.com/deepseek_ai/status/2087864589895798968), Artificial Analysis model/providers pages and X post, Vals AI model page, arena.ai, ARC Prize, SCMP, TechTimes, Yahoo/Quartz, Engadget, InfoWorld, Fortune, MindStudio, codersera, dsv4pro.novcog.us.com, gHacks, OfficeChai, aihubmix.

| model-id | field | checked | reason |
|---|---|---|---|
| deepseek-v4-pro-0813 | mmluPro | 2026-08-18 | not in DeepSeek's 0813 card table as reported by any outlet; the 87.5 aggregators carry is April's preview (V4-Pro-Max) figure, not re-run for 0813 |
| deepseek-v4-pro-0813 | aime | 2026-08-18 | not reported by DeepSeek, Artificial Analysis or Vals AI for this build |
| deepseek-v4-pro-0813 | lmarenaElo | 2026-08-18 | no 0813-specific text-arena listing found; only an approximate "~1450" for the un-dated "DeepSeek V4 Pro" and a Code Arena WebDev score (1607, a different arena) — **superseded 2026-09-22: arena.ai now lists deepseek-v4-pro-high-20260813 at 1463 — filled** |
| deepseek-v4-pro-0813 | arcAgi2 | 2026-08-18 | ARC Prize has verified V4-Flash-0731 (61.4%) but published no V4-Pro-0813 result as of this check — **superseded 2026-09-22: ARC Prize results page (deepseek-v4-pro-0813) gives 61.3% at max effort ($0.60/task) — filled** |
| deepseek-v4-pro-0813 | knowledgeCutoff | 2026-08-18 | not disclosed anywhere in DeepSeek's documentation for V4 or the 0813 build; explicitly called out as unpublished by secondary coverage |
| deepseek-v4-pro-0813 | costPerTask.usd | 2026-08-18 | Artificial Analysis publishes only the total Intelligence Index evaluation cost ($604.51 at max effort) in reachable excerpts; the per-task `intelligenceIndexCostPerTask.cost.total` figure could not be retrieved (AA page not fetchable this session) — never derive it |

Stats-filler sweep on 2026-08-18 (daily sweep, unattended). WebFetch was not permitted at all this session — every finding rests on WebSearch-synthesised excerpts, cross-checked across at least two independent outlets or an official/leaderboard excerpt. Sources checked: arena.ai (via its X announcements and llm-stats/swfte/metatext relays), ARC Prize verified leaderboard and x.com/arcprize posts, Artificial Analysis (Terminal-Bench v2.1 evaluation leaderboard, Muse Spark 1.2 / Muse Glimmer / Inkling articles, model pages for GLM-5.x, Qwen3.8 27B, Qwen3.8 2.4T A95B, Muse Glimmer, Inkling), Vals AI Terminal-Bench 2.1, BenchLM, tbench.ai (Terminal-Bench 2.1 published 2026-04-30), Anthropic/Meta/OpenAI/NVIDIA/Thinking Machines/poolside/Alibaba launch material as relayed by Vellum, codersera, llm-stats, MarkTechPost, kingy.ai, orcarouter, eesel. Rows below are cells researched this pass and left null; three ledger rows above (grok-4-6 arcAgi2, gemini-3-6-flash arcAgi2, kimi-k3 arcAgi2) were superseded because ARC Prize published verified results after those rows were logged — see the amended rows.

| model-id | field | checked | reason |
|---|---|---|---|
| muse-spark-1-2 | mmluPro | 2026-08-18 | not published by Meta; not on Artificial Analysis (Intelligence Index v4.1.1 dropped MMLU-Pro) or any MMLU-Pro tracker found |
| muse-spark-1-2 | sweBench | 2026-08-18 | Meta reports SWE-bench Pro / DeepSWE-style suites, no SWE-bench Verified figure; none found on trackers |
| muse-spark-1-2 | aime | 2026-08-18 | not published by Meta; not on AA's AIME 2025 leaderboard excerpts |
| muse-spark-1-2 | arcAgi2 | 2026-08-18 | ARC Prize's verified board (as relayed by search) lists the original Muse Spark (42.5%) only; 1.2 not tested as of this check |
| muse-spark-1-2 | knowledgeCutoff | 2026-08-18 | not stated on developer.meta.com model page, Meta's research blog post, or OpenRouter listing |
| muse-glimmer | maxOutput | 2026-08-18 | not stated by Meta; Artificial Analysis gives only the 131K context window |
| muse-glimmer | costPerTask.usd/.effort | 2026-08-18 | Artificial Analysis has now indexed Muse Glimmer (high) at Intelligence Index 35, but reachable excerpts give only the total suite cost ($105.03) and per-token price ($0.32/$1.35), not the per-task figure — never derive it |
| gpt-5-6-cyber | costPerTask | 2026-08-18 | Artificial Analysis has not indexed the Daybreak Red-gated model (search surfaces only Sol/Terra pages) |
| gpt-5-6-sol | aime | 2026-08-18 | OpenAI published no AIME for the GPT-5.6 family; not on Artificial Analysis's AIME 2025 leaderboard excerpts (not part of Intelligence Index v4.1) |
| gpt-5-6-luna | mmluPro | 2026-08-18 | OpenAI published no per-tier academic table; BenchLM/BenchmarkList list the benchmark name without a Luna score |
| gpt-5-6-luna | aime | 2026-08-18 | same — OpenAI explicitly did not publish AIME for the 5.6 family; no third-party run found |
| grok-4-6 | maxOutput | 2026-08-18 | xAI's docs document context and tiered pricing but no output cap (same as Grok 4.5 / 4.3); no number to record |
| qwen3-8-2-4t-a95b | knowledgeCutoff | 2026-08-18 | not disclosed by Alibaba; Artificial Analysis model page excerpt lists no cutoff |
| qwen3-8-2-4t-a95b | costPerTask.usd/.effort | 2026-08-18 | Artificial Analysis has a model page (Intelligence Index 58, $2/$6 per MTok, "4 of 4" cost band) but the exact per-task USD figure was not retrievable from search excerpts and no effort tier is stated |
| qwen3-8-27b | costPerTask.usd/.effort | 2026-08-18 | Artificial Analysis model page shows Intelligence Index 52 but pricing $0.00/$0.00 and "Cost per Intelligence Index task: Unknown" |
| glm-5-3 | costPerTask.usd/.effort | 2026-08-18 | Artificial Analysis has no GLM-5.3 page yet (GLM-5.2 max is the latest); Z.ai's pricing table also still ends at 5.2 |
| qwen3-7-flash | mmluPro / gpqaDiamond / sweBench / terminalBench / aime / hle / lmarenaElo / arcAgi2 | 2026-08-18 | Alibaba published no benchmark table, eval name or percentage for the Flash model (confirmed by two independent reviews); not indexed by Artificial Analysis (no model page), arena.ai or ARC Prize |
| qwen3-7-flash | knowledgeCutoff | 2026-08-18 | not disclosed in the QwenCloud changelog entry or Model Studio docs found |
| qwen3-7-flash | costPerTask.usd/.effort | 2026-08-18 | no Artificial Analysis model page exists for Qwen3.7 Flash |
| laguna-xs-2-1 | mmluPro / gpqaDiamond / aime / hle / lmarenaElo / arcAgi2 | 2026-08-18 | poolside publishes agentic-coding evals only (SWE-bench Verified/Multilingual/Pro, Terminal-Bench 2.0); no knowledge/maths/reasoning benchmark in the HF card, NVIDIA Build card or technical report excerpts; not on arena.ai or ARC Prize |
| laguna-xs-2-1 | terminalBench | 2026-08-18 | poolside reports Terminal-Bench **2.0** (37.5%) only, not the tracked 2.1 metric |
| laguna-xs-2-1 | knowledgeCutoff | 2026-08-18 | not disclosed by poolside in any source found |
| laguna-xs-2-1 | costPerTask.usd/.effort | 2026-08-18 | Artificial Analysis does not cover poolside (no model page, as with Laguna S 2.1) |
| inkling | maxOutput | 2026-08-18 | Thinking Machines' model card and Artificial Analysis state no max-output figure (only 256K Tinker / 1M open-weights context) |
| inkling | knowledgeCutoff | 2026-08-18 | model card says only "limited to information available as of its training cutoff" with no date; third-party reviews explicitly note it is unpublished |
| inkling | costPerTask.usd/.effort | 2026-08-18 | Artificial Analysis lists Inkling (xhigh) at Intelligence Index 41 and 25K output tokens per task, but the per-task USD figure was not retrievable from excerpts — never derive it |
| inkling-small | maxOutput | 2026-08-18 | not stated on Thinking Machines' Inkling-Small model card or Artificial Analysis |
| inkling-small | knowledgeCutoff | 2026-08-18 | not stated on the model card (same wording as Inkling); unpublished per third-party reviews |
| nemotron-3-ultra | maxOutput | 2026-08-18 | NVIDIA's own docs state no output cap in the material seen; a 65,536 / "66K" figure appears only on third-party API listings (Puter, Together, DeepInfra) |
| nemotron-3-super | maxOutput | 2026-08-18 | only a third-party "up to 32,768 output tokens" listing found, not an NVIDIA figure |
| nemotron-3-super | knowledgeCutoff | 2026-08-18 | sources conflict — most model-card relays say pre-training cutoff June 2025 (post-training February 2026) but the HF Base page reportedly says December 2025; unresolved without fetching the cards |
| gpt-5-5 | terminalBench | 2026-08-18 | no OpenAI-reported Terminal-Bench 2.1 figure (GPT-5.5 launched 2026-04-23, a week before 2.1 was published; OpenAI's headline 82.7% is 2.0); Anthropic's Opus 4.8 comparison table gives 78.2 on Terminus-2 and mentions 83.4 via Codex CLI — conflicting harnesses, third-party-run, so left null pending a primary figure |
| hy3 | mmluPro / aime / arcAgi2 | 2026-08-18 | Tencent's Hy3 image table (transcribed by launch coverage) has no MMLU-Pro or AIME row (USAMO 2026 72.0 reported instead); the only MMLU-Pro figure found (65.8) is for the Hy3 pre-trained *base* checkpoint in the April Hy3-preview README, not the released post-trained model — rejected; not on ARC Prize's verified board as relayed by search |
| hy3 | knowledgeCutoff | 2026-08-18 | not disclosed by Tencent in any source found |
| longcat-2-0 | mmluPro / sweBench / aime / lmarenaElo / arcAgi2 | 2026-08-18 | Meituan's harness table has no MMLU-Pro/AIME/SWE-bench Verified rows (SWE-bench Pro and Multilingual instead); no arena.ai listing or ARC Prize result surfaced by this pass's sweeps |
| longcat-2-0 | knowledgeCutoff | 2026-08-18 | not disclosed by Meituan |
| motif-3-beta | mmluPro / sweBench / aime / lmarenaElo / arcAgi2 | 2026-08-18 | Motif publishes no benchmark table beyond the Artificial Analysis index; AA's per-benchmark breakdown covers GPQA/HLE/Terminal-Bench only; no arena.ai or ARC Prize listing surfaced |
| motif-3-beta | maxOutput / inputPrice / outputPrice / knowledgeCutoff / costPerTask | 2026-08-18 | preview checkpoint with no hosted API — no per-token price exists, so no AA cost per task; max output and cutoff not stated in the HF card |

New-model-release research on 2026-08-18 (daily sweep follow-up), scoped to `motif-3` (final release, announced 2026-08-13). WebFetch unavailable this session — WebSearch excerpts only, cross-checked across TechTimes (articles/324260), Digital Today (digitaltoday.co.kr/en/view/92837), BigGo Finance, orcarouter, AI Weekly, the mirrored Hugging Face card text (huggingface.co/Motif-Technologies/Motif-3), the technical report listing (arxiv.org/abs/2608.09119) and Artificial Analysis (artificialanalysis.ai/models/motif-3).

| model-id | field | checked | reason |
|---|---|---|---|
| motif-3 | mmluPro | 2026-08-18 | the technical report's MMLU-Pro row is for the pretrained base model (Table 4), not the instruct release; no instruct figure surfaced |
| motif-3 | aime | 2026-08-18 | not in Motif's card table (which reports SWE-bench Verified, Terminal-Bench 2.1, GPQA Diamond, τ²-Bench Telecom, AA-Omniscience) and not found on any tracker |
| motif-3 | hle | 2026-08-18 | not in Motif's card table; Artificial Analysis' per-benchmark breakdown for the final release could not be read (only the composite index of 47 surfaced) |
| motif-3 | lmarenaElo | 2026-08-18 | no arena.ai listing found for Motif-3 or Motif-3-Beta |
| motif-3 | arcAgi2 | 2026-08-18 | not on ARC Prize; never tested |
| motif-3 | maxOutput / pricing (input/output) / knowledgeCutoff / costPerTask | 2026-08-18 | no inference provider or aggregator hosts the model, so no per-token price and no AA cost per task exist; max output and knowledge cutoff are not stated in the card or report as far as reachable excerpts show |
| motif-3 | speed | 2026-08-18 | Artificial Analysis lists no hosted endpoint for the final release, so no throughput/latency measurement |
| hy4-preview | sweBench | 2026-08-31 | Tencent's benchmark appendix (model-card image at huggingface.co/tencent/Hy4-preview/resolve/main/assets/benchmark-appendix.jpg, read directly) has no SWE-bench Verified row — only SWE-bench Pro 65.7 and SWE-bench Multilingual 82.9; no third-party Verified run found |
| hy4-preview | mmluPro / aime / arcAgi2 | 2026-08-31 | absent from Tencent's appendix table (its math rows are MathArena Apex 2025, HorizonMath, ArXivMath, BrokenArXiv); not indexed by Artificial Analysis and not on ARC Prize's board as relayed by search |
| hy4-preview | lmarenaElo | 2026-08-31 | not on arena.ai's text leaderboard as of its 2026-08-27 update (only Hy3, 1456); Arena's 2026-08-30 X post gives a WebDev Code Arena AutoEval of 1633, which is a different board and an automated score |
| hy4-preview | knowledgeCutoff | 2026-08-31 | not disclosed on the tencent.com announcement, HF card, GitHub README or Tencent Cloud's Hy4 preview FAQ (tencentcloud.com/techpedia/148044) |
| claude-fable-5-1 | gpqaDiamond | 2026-09-02 | Anthropic dropped GPQA from official reporting; not among the Fable 5.1 variants on Artificial Analysis' gpqa-diamond leaderboard as of launch day, and Vals AI's GPQA page shows no usable Fable 5.1 figure (search excerpts relay an anomalous 0.0% for it) — rejected |
| claude-fable-5-1 | sweBench | 2026-09-02 | Anthropic no longer reports SWE-bench Verified (Terminal-Bench 4.0 / Terminal-Bench-Science instead); Vals AI's SWE-bench Verified board has no Fable 5.1 entry as of 2026-09-02 |
| claude-fable-5-1 | aime | 2026-09-02 | Anthropic retired AIME from reporting as saturated; no third-party AIME run found for Fable 5.1 |
| claude-fable-5-1 | lmarenaElo | 2026-09-02 | not yet on arena.ai's text leaderboard one day after release (claude-fable-5 still tops it at 1507); re-check |

| glm-5-3 | mmluPro / gpqaDiamond / sweBench / aime / hle / lmarenaElo / arcAgi2 | 2026-08-16 | Z.ai's launch benchmark table is entirely agentic/coding/cyber (Terminal-Bench 2.1/3.0, DeepSWE v1.1, SWE-Marathon v1.1, AutomationBench, Agents' Last Exam, CyberGym) — none of the tracked knowledge/reasoning keys were re-reported, consistent with Z.ai's stated "same base model, post-training only" framing; not on arena.ai; Artificial Analysis now lists it (Intelligence Index 60 at max effort) but AA per-benchmark cells were not readable via search snippets on 2026-09-02 — **lmarenaElo superseded 2026-09-22: arena.ai now lists glm-5.3-max at 1483 — filled; the other cells stand** |
Release-protocol research on 2026-09-02 (daily sweep), scoped to `hy4-preview` (released 2026-08-28). WebFetch was unavailable this session; findings rest on WebSearch excerpts restricted to primary domains, cross-checked across independent trackers where possible.
| hy4-preview | mmluPro | 2026-09-02 | not in Tencent's launch chart (GPQA Diamond, HLE, Terminal-Bench 2.1, SWE-bench Pro/Multilingual, DeepSWE, SkillsBench, HorizonMath, BioMysteryBench); no tracker figure found |
| hy4-preview | sweBench | 2026-09-02 | Tencent's chart reports SWE-bench Pro (65.7) and Multilingual (82.9), not Verified; the HF community-eval PR (discussions/3) covers the same set, and no Verified figure surfaced on any leaderboard |
| hy4-preview | hle | 2026-09-02 | no-tools figure (43.4%) appears only in a single transcription set of Tencent's chart image (Medium/DataLearner); with-tools 55.4% is corroborated but is not the cell this site records — both kept in notes, cell null until the chart is readable or AA runs it |
| hy4-preview | aime | 2026-09-02 | not reported by Tencent; no third-party figure traceable to a primary source |
| hy4-preview | lmarenaElo | 2026-09-02 | arena.ai changelog lists hy4-preview on the Code Arena only; no text-leaderboard entry or score found |
| hy4-preview | arcAgi2 | 2026-09-02 | not reported by Tencent; not on the ARC Prize leaderboard |
| hy4-preview | costPerTask | 2026-09-02 | Artificial Analysis has not listed the model (searches on artificialanalysis.ai return only Hy3/Hy3-preview) |
| hy4-preview | knowledgeCutoff | 2026-09-02 | not disclosed on the HF model card, GitHub README, Tencent press release, or Tencent Cloud FAQ per any excerpt found |
| qwen3-8-flash-next | mmluPro | 2026-09-02 | the only MMLU-Pro figure in Qwen's card (73.23) is for the pretrained Qwen3.8-Flash-Next-Base checkpoint, not the released post-trained model; no post-trained figure on any tracker |
| qwen3-8-flash-next | sweBench | 2026-09-02 | Qwen reports SWE-bench Pro (62.5, Claude Code harness) and SWE-bench Multilingual (81.0), not the Verified variant this field tracks |
| qwen3-8-flash-next | terminalBench | 2026-09-02 | Qwen's card references a Terminal-Bench 2.0 (Harbor/Terminus-2) harness but no figure surfaced; AA folds TB 2.1 into its index without publishing the component; no 2.1 figure found |
| qwen3-8-flash-next | aime | 2026-09-02 | no AIME/HMMT figure in Qwen's card, blog, or on any tracker found |
| qwen3-8-flash-next | lmarenaElo | 2026-09-02 | arena.ai has it only in Agent Arena (#24 overall, #7 open) and Code Arena: WebDev (1617 AutoEval); no text-leaderboard Elo |
| qwen3-8-flash-next | arcAgi2 | 2026-09-02 | not reported by Qwen; no arcprize.org leaderboard entry |
| qwen3-8-flash-next | knowledgeCutoff | 2026-09-02 | not disclosed in the Qwen blog, HF model card, GitHub README, or on the AA page |
| qwen3-8-flash-next | costPerTask.effort / speed.effort | 2026-09-02 | Artificial Analysis lists a single unsuffixed "Qwen3.8-Flash-Next" variant with no disclosed effort tier (model default is xhigh); left null rather than assume |

Release-protocol research on 2026-09-03, scoped to `gemini-3-8-flash` and `gemini-3-8-flash-cyber` (both announced 2026-09-02). Sources read: Google's launch post, the DeepMind model card, the evaluation-methodology PDF (storage.googleapis.com/deepmind-media/gemini/gemini_3-8_flash_model_evaluation.pdf), ai.google.dev model/pricing/deprecations/changelog pages, the Fairwind Program page, Artificial Analysis model and evaluation pages, arena.ai and arcprize.org.
| gemini-3-8-flash | mmluPro | 2026-09-03 | not in Google's evaluation table (DeepSWE, GDPval-AA, Vals Finance, Harvey, Terminal-Bench 2.1/4.0, GDP.PDF, CharXiv, LVBench, HLE-Verified, OSWorld, BioMysteryBench, LABBench2); no tracker figure found |
| gemini-3-8-flash | sweBench | 2026-09-03 | Google published no SWE-bench Verified figure (DeepSWE v1.1 73.7% instead); not on any Verified leaderboard found |
| gemini-3-8-flash | sweBenchPro | 2026-09-03 | not in Google's evaluation table or model card; DataCamp quotes 61.6% (and 60.4% for 3.7 Flash) alongside a Terminal-Bench 90.8% that contradicts Google's own 89.4%, so the DataCamp figures are not traceable to a primary source — rejected |
| gemini-3-8-flash | aime | 2026-09-03 | not reported by Google; no tracker figure found |
| gemini-3-8-flash | arcAgi2 | 2026-09-03 | arcprize.org/results/google-gemini-3-8-flash returns 404 one day after launch; not on the ARC Prize leaderboard yet — re-check (3.7 Flash was verified on its launch day) |
| gemini-3-8-flash | gdpvalAA (3.7 Flash conflict) | 2026-09-03 | for the record: Google's 3.8 Flash table cites 3.7 Flash at 1482 while AA's gdpval-aa board lists 3.7 Flash (high) at 1516, (medium) 1492, (low) 1446 — 3.7 Flash's cell left null pending a stable AA figure; 3.8 Flash's 1545 agrees across both sources |
| gemini-3-8-flash-cyber | mmluPro / gpqaDiamond / sweBench / sweBenchPro / terminalBench / aime / hle / lmarenaElo / gdpvalAA / arcAgi2 | 2026-09-03 | Google reports only cyber evals (CWE-Bench 47.2% pass@1, CyberGym "surpasses 3.5 Flash Cyber", >70% internal 20-language discovery, Chrome 2.6x patches, Wiz recall); no model card exists (deepmind.google/models/model-cards/gemini-3-8-flash-cyber/ 404) and Google does not state that 3.8 Flash's scores apply; Fairwind gating rules out third-party indexing |
| gemini-3-8-flash-cyber | contextWindow / maxOutput / knowledgeCutoff | 2026-09-03 | no model card or docs page publishes them; Google says only that both models share 'the same foundational intelligence' — not copied from 3.8 Flash |
| gemini-3-8-flash-cyber | inputPrice / outputPrice | 2026-09-03 | not on ai.google.dev pricing; the Fairwind page says only 'a fraction of the operating cost of traditional frontier models' — no figure |
| gemini-3-8-flash-cyber | costPerTask | 2026-09-03 | not indexed by Artificial Analysis; vetted-access gating makes indexing unlikely |

Release-protocol research on 2026-09-03 (daily sweep), scoped to `gemini-3-8-flash` (released 2026-09-02), `qwen3-8-max-0902` (2026-09-02) and `deepseek-v4-flash-vision-exp` (2026-08-21, missed by earlier sweeps). WebFetch was denied for every URL this session; findings rest on WebSearch excerpts of primary pages (blog.google, ai.google.dev, deepmind.google model card, docs.cloud.google.com, x.com/Alibaba_Qwen, x.com/arena, x.com/ArtificialAnlys, api-docs.deepseek.com, huggingface.co) cross-checked across independent trackers and launch coverage (Artificial Analysis articles, OfficeChai, The Register, 9to5Google, CellCog, TheNextWeb, OpenRouter).
| gemini-3-8-flash | mmluPro | 2026-09-03 | not in Google's launch table (Terminal-Bench 2.1/4.0, HLE-Verified, DeepSWE v1, OSWorld-2.0, Vals Finance Agent, Harvey legal, CharXiv, LVBench); AA's index no longer carries MMLU-Pro; no tracker figure found |
| gemini-3-8-flash | sweBench | 2026-09-03 | Google reports SWE-Bench Pro ("barely moved" from 3.7 Flash) and DeepSWE v1 71.0%, not Verified; BenchmarkList's 68.70% has no stated source and looks like an older Flash model's figure — rejected |
| gemini-3-8-flash | aime | 2026-09-03 | not reported by Google; not on any AIME tracker found |
| gemini-3-8-flash | arcAgi2 | 2026-09-03 | ARC Prize has published no 3.8 Flash result (arcprize.org/results shows 3.7 Flash only); BenchmarkList's 33.60% is Gemini 3 Flash Preview's December 2025 score, misattributed |
| deepseek-v4-flash-vision-exp | mmluPro | 2026-09-03 | not in DeepSeek's eleven-benchmark launch table; not on any tracker found |
| deepseek-v4-flash-vision-exp | gpqaDiamond | 2026-09-03 | not published by DeepSeek; AA folds it into the model's Intelligence Index (51, max effort) but the per-eval figure was not readable via search snippets |
| deepseek-v4-flash-vision-exp | sweBench | 2026-09-03 | DeepSeek reports DeepSWE 59.3, not SWE-bench Verified |
| deepseek-v4-flash-vision-exp | aime | 2026-09-03 | not reported by DeepSeek or found on any tracker |
| deepseek-v4-flash-vision-exp | hle | 2026-09-03 | same as gpqaDiamond — inside AA's index, per-eval figure not readable |
| deepseek-v4-flash-vision-exp | lmarenaElo | 2026-09-03 | no arena.ai listing found |
| deepseek-v4-flash-vision-exp | arcAgi2 | 2026-09-03 | not reported by DeepSeek; not on ARC Prize's leaderboard |
| deepseek-v4-flash-vision-exp | costPerTask | 2026-09-03 | AA covers the model (max effort) but only the whole-index run total ($235.89) surfaced; the per-task figure this site records was not readable and must not be derived |
| deepseek-v4-flash-vision-exp | knowledgeCutoff | 2026-09-03 | not disclosed on the HF card, API release note or any coverage found |
| deepseek-v4-flash-vision-exp | maxOutput | 2026-09-03 | sources say "384,000" / "384K"; recorded 393,216 to match the sibling 0731 entry's reading of DeepSeek's 384K recommendation — confirm the exact cap on api-docs.deepseek.com when fetchable |
| qwen3-8-max-0902 | mmluPro / gpqaDiamond / sweBench / terminalBench / aime / hle / lmarenaElo / arcAgi2 | 2026-09-03 | Qwen's 0902 table is coding/agent only (Terminal-Bench 3.0 29.0%, DeepSWE 1.1 69.3%, NL2Repo 64.9%, ProgramBench, SWE-Marathon, CoWorkBench, JobBench, Toolathlon, AutomationBench, two visual-reasoning sets) — no tracked key; TB 3.0 is not the 2.1 cell; the GPQA 92.6 / HLE 43.6 / TB 2.1 86.6 figures in coverage are the August Qwen3.8-Max numbers, not re-runs; Arena lists it only on Code Arena: WebDev (1691), no Text Arena Elo; ARC Prize has not tested it |
| qwen3-8-max-0902 | costPerTask | 2026-09-03 | Artificial Analysis shows a single "Qwen3.8 Max" listing (Index 58) with no separate 0902 snapshot and no disclosed effort tier — cannot attribute a per-task figure to this snapshot |
| qwen3-8-max-0902 | knowledgeCutoff | 2026-09-03 | not disclosed in Qwen's X post or on the QwenCloud / Model Studio pages per any excerpt found |
| qwen3-8-max-0902 | contextWindow (precision) | 2026-09-03 | recorded Qwen's own "1M context tokens"; Model Studio's exact usable-input figure for this snapshot (the sibling qwen3-8-max records 983,616) was not readable — re-check alibabacloud.com/help/en/model-studio/qwen3-8-max when fetchable |
Stats-filler sweep on 2026-09-03 (daily sweep), two batches: (a) recent/unknown/frontier models with open cells, (b) a Terminal-Bench 2.1 and Artificial Analysis cost-per-task leaderboard pass over older models. WebFetch was denied for every URL this session and the shared WebSearch budget ran out mid-run, so tbench.ai, vals.ai, artificialanalysis.ai and lab pages were never read directly; every fill and gap rests on WebSearch excerpts cross-checked across independent outlets. Cells that were merely unreadable this session (AA chart-rendered figures, unread model cards, single uncorroborated excerpts) are deliberately NOT logged here so the next run re-checks them — see the sweep PR body for that list. Sources consulted via excerpts: arena.ai + Arena's X posts; AA model pages and the terminalbench-v2-1 board; tbench.ai 2.1 leaderboard/announcement; vals.ai TB 2.1 and its BenchLM/Snorkel mirrors; benchmarklist.com; ARC Prize, llm-stats and Epoch ARC-AGI-2 boards; OpenAI DevDay post and model docs; Meta's Muse Spark 1.2 launch chart (as transcribed by Medium, kingy.ai, eesel); developer.meta.com / NVIDIA NIM cards; Thinking Machines model cards; poolside blog and HF/NVIDIA Laguna cards; HF cards for Ornith, Motif-3, Hy3, LongCat-2.0, Qwen3.8-2.4T, Nemotron 3 Ultra, Soofi-S; help.aliyun.com qwen3.7-flash page; Z.ai docs via DataCamp/Semgrep; DeepSeek's V4-Pro-0813 comparison table via MindStudio/codersera; Alibaba's Qwen3.8-Max table via DataCamp/Together.
| qwen3-7-flash | mmluPro | 2026-09-03 | no benchmark published by Alibaba (QwenCloud changelog only); not indexed by Artificial Analysis (only Qwen3.7 Max/Plus and Qwen3.8-Flash-Next appear); BenchLM page is spec-only |
| qwen3-7-flash | gpqaDiamond | 2026-09-03 | same — no Alibaba figure, no AA page, no tracker figure |
| qwen3-7-flash | sweBench | 2026-09-03 | same — no figure anywhere found |
| qwen3-7-flash | terminalBench | 2026-09-03 | same — no figure anywhere found |
| qwen3-7-flash | aime | 2026-09-03 | same — no figure anywhere found |
| qwen3-7-flash | hle | 2026-09-03 | same — no figure anywhere found |
| qwen3-7-flash | lmarenaElo | 2026-09-03 | no qwen3.7-flash listing on arena.ai's text leaderboard found |
| qwen3-7-flash | arcAgi2 | 2026-09-03 | not on ARC Prize or tracker ARC-AGI-2 leaderboards |
| qwen3-7-flash | knowledgeCutoff | 2026-09-03 | not stated on help.aliyun.com's qwen3.7-flash model-info page (per excerpts), the QwenCloud changelog, OrcaRouter or BenchLM |
| qwen3-7-flash | costPerTask | 2026-09-03 | Artificial Analysis has no Qwen3.7 Flash model page, so no Intelligence Index cost-per-task figure exists |
| muse-spark-1-2 | mmluPro | 2026-09-03 | not published by Meta (launch material is three agentic bar charts); AA's Intelligence Index v4.1.1 no longer includes MMLU-Pro; no tracker figure found |
| muse-spark-1-2 | sweBench | 2026-09-03 | Meta published no SWE-bench Verified figure for 1.2 (only a 42.9% 'hard subset' preparedness figure, not a Verified score) |
| muse-spark-1-2 | aime | 2026-09-03 | not published by Meta; no tracker figure found |
| muse-spark-1-2 | arcAgi2 | 2026-09-03 | no Muse Spark 1.2 result on arcprize.org, llm-stats or Epoch AI ARC-AGI-2 boards; only the original Muse Spark (42.5%) has been tested |
| muse-glimmer | mmluPro | 2026-09-03 | not in Meta's model card (which reports MMMU-Pro 74%, a different multimodal benchmark); not on AA's MMLU-Pro leaderboard per excerpts |
| muse-glimmer | lmarenaElo | 2026-09-03 | no Muse Glimmer listing on arena.ai's text leaderboard found |
| muse-glimmer | arcAgi2 | 2026-09-03 | not on ARC Prize or tracker ARC-AGI-2 leaderboards |
| muse-glimmer | maxOutput | 2026-09-03 | developer.meta.com and NVIDIA NIM cards state only a combined input+output context of 131,072 tokens; OpenRouter's 'max output 131,072' echoes the context window, so no distinct output cap is published |
| ornith-1-5-397b | inputPrice | 2026-09-03 | open weights only — BenchLM and Benchgen state DeepReinforce has announced no hosted API tier; Hugging Face has no inference-provider mapping; not on OpenRouter, Together, Fireworks or Nebius |
| ornith-1-5-397b | outputPrice | 2026-09-03 | same — no hosted API or per-token price exists |
| ornith-1-5-397b | costPerTask | 2026-09-03 | Artificial Analysis has not indexed Ornith-1.5-397B, and with no hosted price there is no cost-per-task figure |
| laguna-xs-2-1 | mmluPro | 2026-09-03 | never evaluated — poolside publishes agentic coding evals only; absent from MMLU-Pro trackers |
| laguna-xs-2-1 | gpqaDiamond | 2026-09-03 | never evaluated — no knowledge/science benchmark in poolside's blog or model card; no third-party run found |
| laguna-xs-2-1 | terminalBench | 2026-09-03 | poolside reports Terminal-Bench 2.0 (37.5%) only; no 2.1 figure from poolside, Vals, AA or BenchLM |
| laguna-xs-2-1 | aime | 2026-09-03 | never evaluated — coding specialist; no maths benchmark published or run by any tracker |
| laguna-xs-2-1 | hle | 2026-09-03 | never evaluated — not on AA, llm-stats or other HLE boards |
| laguna-xs-2-1 | lmarenaElo | 2026-09-03 | no poolside/Laguna entry on arena.ai's text leaderboard |
| laguna-xs-2-1 | arcAgi2 | 2026-09-03 | not on ARC Prize or tracker ARC-AGI-2 leaderboards |
| laguna-xs-2-1 | costPerTask | 2026-09-03 | Artificial Analysis still does not cover poolside models, so no Intelligence Index cost-per-task figure exists |
| inkling | mmluPro | 2026-09-03 | model card reports Global-MMLU-Lite 88.7%, not MMLU-Pro; AA's index no longer includes MMLU-Pro; no tracker figure |
| inkling | maxOutput | 2026-09-03 | model card states no output cap — only 64K/256K Tinker context tiers and a 256K max-token trajectory limit used for coding evals |
| inkling-small | mmluPro | 2026-09-03 | model card reports Global-MMLU-Lite 86.7%, not MMLU-Pro; no tracker figure |
| inkling-small | maxOutput | 2026-09-03 | not stated in the Inkling-Small model card or on OpenRouter/AA per excerpts |
| inkling-small | knowledgeCutoff | 2026-09-03 | Inkling-Small model card gives only generic 'limited to its training cutoff' language with no date (unlike Inkling's April 2026); nothing on AA or OpenRouter |
| motif-3-beta | mmluPro | 2026-09-03 | Motif publishes no benchmark table (OrcaRouter: no MMLU, GPQA or HumanEval scores published for Motif-3); AA's Motif 3 (Beta) page exposes only the composite Intelligence Index |
| motif-3-beta | sweBench | 2026-09-03 | not published by Motif or measured by any tracker found |
| motif-3-beta | aime | 2026-09-03 | not published by Motif or measured by any tracker found |
| motif-3-beta | lmarenaElo | 2026-09-03 | no Motif listing on arena.ai's text leaderboard |
| motif-3-beta | arcAgi2 | 2026-09-03 | no ARC-AGI scores published for Motif-3 and none on ARC Prize |
| motif-3-beta | maxOutput | 2026-09-03 | HF model card states only the 262,144 context length; the max_new_tokens=512 in its sample code is an example, not a cap |
| motif-3-beta | inputPrice | 2026-09-03 | no hosted API — only the free chat.motiftech.io demo; no aggregator serves it |
| motif-3-beta | outputPrice | 2026-09-03 | same — no per-token price exists |
| motif-3-beta | knowledgeCutoff | 2026-09-03 | not stated in the HF model card or any coverage found |
| motif-3-beta | costPerTask | 2026-09-03 | AA has a Motif 3 (Beta) page but with no hosted price there is no cost-per-task figure |
| hy3 | mmluPro | 2026-09-03 | Tencent's Hy3 card reports MMLU 5-shot 79.26 (not MMLU-Pro); no MMLU-Pro figure from Tencent or trackers |
| hy3 | aime | 2026-09-03 | Tencent reports IMOAnswerBench / FrontierScience-Olympiad / a Tsinghua PhD qualifying exam instead of AIME; no tracker figure |
| hy3 | arcAgi2 | 2026-09-03 | not on ARC Prize or tracker ARC-AGI-2 leaderboards |
| hy3 | knowledgeCutoff | 2026-09-03 | not stated in the HF model card, GitHub README or any coverage found |
| longcat-2-0 | mmluPro | 2026-09-03 | not in Meituan's HF benchmark table; the only MMLU-Pro figure found (77.02) belongs to LongCat-Next, a different model |
| longcat-2-0 | sweBench | 2026-09-03 | Meituan reports SWE-bench Pro 59.5 and Multilingual 77.3, not Verified; the 60.40 Verified figure found belongs to LongCat-Flash, a different model |
| longcat-2-0 | aime | 2026-09-03 | not in Meituan's benchmark table; no tracker figure |
| longcat-2-0 | lmarenaElo | 2026-09-03 | no LongCat listing on arena.ai's text leaderboard found |
| longcat-2-0 | arcAgi2 | 2026-09-03 | not on ARC Prize or tracker ARC-AGI-2 leaderboards |
| longcat-2-0 | knowledgeCutoff | 2026-09-03 | not stated in the HF model card or any coverage found |
| gpt-5-6-luna | mmluPro | 2026-09-03 | OpenAI published no MMLU-Pro; the only figure found (84.7%) is a blog's own plain-MMLU test and was rejected |
| gpt-5-6-luna | aime | 2026-09-03 | OpenAI did not publish AIME for any GPT-5.6 tier; no exact third-party score found |
| qwen3-8-2-4t-a95b | knowledgeCutoff | 2026-09-03 | not stated in the HF model card, DeepInfra listing, NVIDIA serving blog or MindStudio overview |
| nemotron-3-ultra | maxOutput | 2026-09-03 | NVIDIA's cards state only the 1M max context; no output cap published |
| soofi-s-30b-a3b | terminalBench | 2026-09-03 | not evaluated in arXiv:2607.09424 or the HF card (base model; only HumanEval/MBPP coding evals); no tracker run |
| soofi-s-30b-a3b | costPerTask | 2026-09-03 | no public API and no Artificial Analysis coverage |
| gpt-5-6-sol | aime | 2026-09-03 | OpenAI published no AIME for GPT-5.6; the only figure found is a percentile rank on AIME 2026, not a score |
| muse-spark | terminalBench | 2026-09-03 | Meta's April 2026 launch reported Terminal-Bench 2.0 only (59.0); 2.1 figures exist only for the 1.1+ builds |
| muse-spark | costPerTask | 2026-09-03 | no public API pricing (private preview), so AA publishes no per-task cost for the original Muse Spark; AA per-task figures exist only for the 1.2/1.3 builds |
| claude-haiku-4-5 | terminalBench | 2026-09-03 | only a Terminal-Bench 2.0 figure found (41.6), not 2.1; no 2.1 row on any board excerpt |
| claude-sonnet-4-5 | terminalBench | 2026-09-03 | the widely quoted 50.0 is Anthropic's launch-era (pre-2.0) Terminal-Bench figure — not comparable; no 2.1 row surfaced on tbench.ai/vals.ai/AA excerpts |
| deepseek-v3-2 | terminalBench | 2026-09-03 | DeepSeek's V3.2 paper reports Terminal-Bench 2.0 (38.2 pass@1), not 2.1; no 2.1 row surfaced |
| gpt-5 | terminalBench | 2026-09-03 | LayerLens reports 42.5 (Terminus 2) with no version label, and TB 2.1 postdates the model by eight months; no 2.1 row surfaced |
| claude-opus-4-1 | terminalBench | 2026-09-03 | the 46.5 in circulation is Anthropic's launch-era (pre-2.0) score, not 2.1; no 2.1 row surfaced |
| kimi-k2-thinking | terminalBench | 2026-09-03 | only Terminal-Bench 2.0 figures exist (36.0 pass@1 in DeepSeek's V3.2 paper); no 2.1 row surfaced |
| kimi-k2 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 (2026-04-19) by nine months; not in any 2.1 leaderboard excerpt |
| grok-4 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by nine months; not in any 2.1 leaderboard excerpt |
| claude-opus-4 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by eleven months; not in any 2.1 leaderboard excerpt |
| claude-sonnet-4 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by eleven months; not in any 2.1 leaderboard excerpt |
| mistral-medium-3 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by eleven months; not in any 2.1 leaderboard excerpt |
| qwen3-235b | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by a year; not in any 2.1 leaderboard excerpt |
| o3 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by a year; not in any 2.1 leaderboard excerpt |
| gpt-4-1 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by a year; not in any 2.1 leaderboard excerpt |
| llama-4-maverick | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by a year; not in any 2.1 leaderboard excerpt |
| gemini-2-5-pro | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by a year; not in any 2.1 leaderboard excerpt |
| claude-3-7-sonnet | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by 14 months; not in any 2.1 leaderboard excerpt |
| grok-3 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by 14 months; not in any 2.1 leaderboard excerpt |
| deepseek-r1 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by 15 months; not in any 2.1 leaderboard excerpt |
| deepseek-v3 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by 16 months; not in any 2.1 leaderboard excerpt |
| gemini-2-0-flash | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by 16 months; not in any 2.1 leaderboard excerpt |
| o1 | terminalBench | 2026-09-03 | predates Terminal-Bench 2.1 by 16 months; not in any 2.1 leaderboard excerpt |
| mistral-large-2 | terminalBench | 2026-09-03 | predates Terminal-Bench (all versions); never evaluated on any board excerpt |
| llama-3-1-405b | terminalBench | 2026-09-03 | predates Terminal-Bench (all versions); never evaluated on any board excerpt |
| claude-3-5-sonnet | terminalBench | 2026-09-03 | predates Terminal-Bench (all versions); never evaluated on any board excerpt |
| gpt-4o | terminalBench | 2026-09-03 | predates Terminal-Bench (all versions); never evaluated on any board excerpt |
| claude-3-opus | terminalBench | 2026-09-03 | predates Terminal-Bench (all versions); never evaluated on any board excerpt |
| gemini-1-5-pro | terminalBench | 2026-09-03 | predates Terminal-Bench (all versions); never evaluated on any board excerpt |
| gpt-4-turbo | terminalBench | 2026-09-03 | predates Terminal-Bench (all versions); never evaluated on any board excerpt |
| gpt-4 | terminalBench | 2026-09-03 | predates Terminal-Bench (all versions); never evaluated on any board excerpt |
| gpt-6-astra | sweBench | 2026-09-04 | OpenAI stopped publishing SWE-bench Verified in Feb 2026; no Verified score in the launch table or system card |
| gpt-6-astra | sweBenchPro | 2026-09-04 | Not on the Scale/SWE-bench Pro public leaderboard as of 2026-09-04; OpenAI reported DeepSWE v1.1 74.1 instead |
| gpt-6-astra | terminalBench | 2026-09-04 | OpenAI reports Terminal-Bench 4.0 (57.7%); no 2.1 run published, and versions are not comparable |
| gpt-6-astra | hle | 2026-09-04 | Only a with-tools figure published (57.2%); no no-tools score from OpenAI or AA |
| gpt-6-astra | lmarenaElo | 2026-09-04 | Not yet rated on LMArena/Arena text leaderboard — **superseded 2026-09-22: arena.ai now lists gpt-6-astra-max at 1480±12 — filled** |
| gpt-6-astra | gdpvalAA | 2026-09-04 | AA's launch article cites only a ~80 Elo regression vs GPT-5.6 Sol, no absolute rating |
| gpt-6-astra | arcAgi2 | 2026-09-04 | ARC Prize published only ARC-AGI-3 results; secondary claims of a 95.0% ARC-AGI-2 score are unverified by ARC Prize — **superseded 2026-09-22: ARC Prize's results page (openai-gpt-6-astra) now carries ARC-AGI-2 95.0% at max effort — filled** |
| gpt-6-astra | mmluPro | 2026-09-04 | Retired benchmark; not in OpenAI's launch table |
| gpt-6-astra | aime | 2026-09-04 | Retired benchmark; not in OpenAI's launch table |
| muse-spark-1-3 | maxOutput | 2026-09-04 | not stated on developer.meta.com's Muse Spark page, Meta's research blog post, or the OpenRouter listing (which echoes the 1,048,576 context window) |
| muse-spark-1-3 | knowledgeCutoff | 2026-09-04 | not disclosed by Meta on the model page or launch post; Artificial Analysis' model page leaves it blank |
| muse-spark-1-3 | mmluPro | 2026-09-04 | not published by Meta (launch material is agent/coding/instruction-following/long-context charts); AA's Intelligence Index v4.1.1 no longer includes MMLU-Pro |
| muse-spark-1-3 | aime | 2026-09-04 | not published by Meta; no tracker figure found |
| muse-spark-1-3 | sweBench | 2026-09-04 | Meta reports DeepSWE v1.1 (75.4) and SWEAtlas CodeBase QnA (59.4), neither a SWE-bench Verified score; none found on trackers |
| muse-spark-1-3 | sweBenchPro | 2026-09-04 | not reported for 1.3 by Meta or any tracker found (1.1 was the last Muse Spark with a SWE-bench Pro figure) |
| muse-spark-1-3 | arcAgi2 | 2026-09-04 | no Muse Spark 1.3 result on ARC Prize, llm-stats or Epoch AI ARC-AGI-2 boards; only the original Muse Spark (42.5%) has been tested |
| muse-spark-1-3 | lmarenaElo | 2026-09-04 | no Muse Spark 1.3 listing on arena.ai's text leaderboard two days after launch — **superseded 2026-09-22: arena.ai now lists muse-spark-1.3-max at 1493 — filled** |

Weekly release-scan sweep on 2026-09-13, scoped to `fugu-max` and `fugu-ultra-v2` (both 2026-09-11); `deepseek-v4-1-flash` was independently researched and committed the same day (see the 2026-09-15 sweep below for its remaining gaps). WebFetch returned EGRESS_BLOCKED for every domain tried this session (api-docs.deepseek.com, huggingface.co, openrouter.ai, deepseek.com, artificialanalysis.ai, datanorth.ai, heise.de, cellcog.ai, bitrue.com, anthropic.com) — findings rest entirely on WebSearch-synthesized excerpts, cross-checked across at least two independent outlets each where possible. Sources checked via excerpts: Sakana's own site (sakana.ai/fugu-max-release, sakana.ai/fugu, sakana.ai/company-info), OpenRouter, modelgrep.com, datanorth.ai, orcarouter.ai, marktechpost.com, alphasignal.ai, theroboticsmedia.com, pondero.ai, forkast.news.

| fugu-max | gpqaDiamond | 2026-09-13 | Sakana's launch post claims a best-overall score but renders the actual percentage only in a chart image, not extractable text; no third-party leaderboard listing found |
| fugu-max | terminalBench | 2026-09-13 | same chart-image issue as gpqaDiamond; Sakana claims best-overall on Terminal-Bench 2.1 but no numeric figure found in text |
| fugu-max | sweBench | 2026-09-13 | not reported; Sakana's own evals (SWEFish, AutomationBench) don't map to SWE-bench Verified |
| fugu-max | sweBenchPro | 2026-09-13 | not reported by Sakana; not on the SWE-bench Pro public leaderboard |
| fugu-max | hle | 2026-09-13 | not found in any text-extractable source for this specific model |
| fugu-max | mmluPro | 2026-09-13 | not reported |
| fugu-max | aime | 2026-09-13 | not reported |
| fugu-max | lmarenaElo | 2026-09-13 | no arena.ai listing found |
| fugu-max | arcAgi2 | 2026-09-13 | not reported |
| fugu-max | gdpvalAA | 2026-09-13 | Sakana reports its own "GDP.pdf" (a Surge AI benchmark), a different benchmark from Artificial Analysis' GDPval-AA v2 — no mapping made; AA has not scored any Fugu model |
| fugu-max | costPerTask.usd | 2026-09-13 | no Artificial Analysis Intelligence Index page exists for any Fugu model as of this check |
| fugu-max | speed | 2026-09-13 | no Artificial Analysis measurement exists; third-party OpenRouter/ModelGrep throughput numbers are not AA-sourced and conflict with each other (13-72 tok/s across trackers), so none were recorded per the AA-only rule for this field |
| fugu-ultra-v2 | gpqaDiamond | 2026-09-13 | same chart-image issue as fugu-max; Sakana reportedly evaluated it but no extractable numeric figure found for the v2.0 build specifically (a 95.5% figure found in comparisons is attributed to the original June 2026 Fugu/Fugu Ultra, not confirmed as the v2.0 build's own score) |
| fugu-ultra-v2 | terminalBench | 2026-09-13 | same issue; an 82.1% figure found in comparisons is attributed to the original Fugu Ultra, not confirmed as v2.0-specific |
| fugu-ultra-v2 | sweBench | 2026-09-13 | not reported; Sakana's own SWE Bench Pro claim doesn't specify a numeric score in extractable text |
| fugu-ultra-v2 | sweBenchPro | 2026-09-13 | Sakana claims state-of-the-art on SWE-bench Pro but the number is only in a chart image |
| fugu-ultra-v2 | hle | 2026-09-13 | Sakana says it evaluated HLE (incl. multimodal, no tools) but no extractable numeric score found |
| fugu-ultra-v2 | mmluPro | 2026-09-13 | not reported |
| fugu-ultra-v2 | aime | 2026-09-13 | not reported |
| fugu-ultra-v2 | lmarenaElo | 2026-09-13 | no arena.ai listing found |
| fugu-ultra-v2 | arcAgi2 | 2026-09-13 | not reported |
| fugu-ultra-v2 | gdpvalAA | 2026-09-13 | Sakana's "GDP.pdf" is a different, Surge-AI-authored benchmark, not Artificial Analysis' GDPval-AA v2 — no mapping made; AA has not scored any Fugu model |
| fugu-ultra-v2 | costPerTask.usd | 2026-09-13 | no Artificial Analysis Intelligence Index page exists for any Fugu model |
| fugu-ultra-v2 | speed | 2026-09-13 | no Artificial Analysis measurement exists; third-party trackers disagree (49-55 tok/s range) and are not AA-sourced, so left null per the AA-only rule |

Weekly release-scan sweep on 2026-09-15, scoped to `deepseek-v4-1-flash` (2026-09-10).

| deepseek-v4-1-flash | mmluPro | 2026-09-15 | DeepSeek publishes MMLU-Pro only for the base model (74.1, 5-shot) in the HF card; no instruct-model figure, and AA's Intelligence Index v4.3 no longer includes MMLU-Pro |
| deepseek-v4-1-flash | sweBench | 2026-09-15 | DeepSeek reports DeepSWE v1.1 (74.2), not SWE-bench Verified; Vals AI's model page lists no SWE-bench Verified run for it |
| deepseek-v4-1-flash | sweBenchPro | 2026-09-15 | not in DeepSeek's launch table; not on the Scale SWE-bench Pro public leaderboard as of 2026-09-15 |
| deepseek-v4-1-flash | aime | 2026-09-15 | not published by DeepSeek (reports MathArena Apex 65.6 and Codeforces 3471 instead); AA's index no longer carries AIME |
| deepseek-v4-1-flash | lmarenaElo | 2026-09-15 | no V4.1-Flash listing on arena.ai's text leaderboard (only deepseek-v4-pro variants, ranks 50/57); Design Arena's 1347 is a different arena |
| deepseek-v4-1-flash | arcAgi2 | 2026-09-15 | ARC Prize has verified V4-Flash-0731 (61.4%) but has no V4.1-Flash results page (arcprize.org/results/deepseek-v4-1-flash returns 404) |
| deepseek-v4-1-flash | knowledgeCutoff | 2026-09-15 | not disclosed in DeepSeek's HF card, API docs or launch post; AA's model page records knowledgeCutoffDate null |
| jev | gpqaDiamond, sweBench, sweBenchPro, terminalBench, hle, lmarenaElo, gdpvalAA, arcAgi2, mmluPro, aime | 2026-09-21 | not applicable, not merely unpublished: Jev is a typed-decision model that cannot generate text, so no generative benchmark can be run on it; independent evals (priorbench/jev, scienthoon/jev-ood-calibration, beri.net) measure classification accuracy and calibration only |
| jev | maxOutput | 2026-09-21 | no output-token limit published; output is a fixed set of typed values, not a token stream, and output tokens are unmetered |
| jev | knowledgeCutoff | 2026-09-21 | not disclosed on TypeSafe's models page, blog or docs |
| jev | costPerTask | 2026-09-21 | no Artificial Analysis coverage of any TypeSafe model as of launch |

Stats-filler sweep on 2026-09-22 (first pass over the new `sweBenchPro` / `gdpvalAA` keys plus a re-check of frontier/unknown models). Sources checked: labs.scale.com SWE-Bench Pro public leaderboard and the SWE-Bench Pro paper (arXiv 2509.16941), arena.ai text leaderboard (2026-09-13 update), arcprize.org/results index and per-model pages, artificialanalysis.ai/evaluations/gdpval-aa (now v2.1), AA model pages, tbench.ai/Snorkel and BenchLM Terminal-Bench 2.1 boards, llm-stats SWE-bench Pro board, official model cards (Google DeepMind 3.1 Pro / 3.7 Flash, Hugging Face cards for DeepSeek-V4-Pro, Ornith-1.5-397B, GLM-5.3, GLM-5.3-Flash, Kimi K3, MiniMax M2/M2.5, Nemotron 3 Ultra), Meta's Muse Spark Eval Methodology PDF, Anthropic/OpenAI launch coverage (openai.com and Anthropic's Fable 5 page were not fetchable; system-card PDFs too large). **GDPval-AA note:** Artificial Analysis rescaled its board to v2.1 between the last sweep and this one; every `gdpvalAA` cell on record is a v2 figure, so no v2.1 figures were filled — the rows below carry the v2.1 ratings seen so a future migration of the key is cheap.

| model-id | field | checked | reason |
|---|---|---|---|
| gpt-4 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gpt-4 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gpt-4-turbo | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gpt-4-turbo | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gpt-4o | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gpt-4o | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| o1 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| o1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gpt-4-1 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gpt-4-1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| o3 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| o3 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gpt-5 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gpt-5-1 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gpt-5-1 | terminalBench | 2026-09-22 | not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards; OpenAI reported 2.0 only |
| gpt-5-1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-3-opus | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| claude-3-opus | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-3-5-sonnet | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| claude-3-5-sonnet | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-3-7-sonnet | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| claude-3-7-sonnet | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-opus-4 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| claude-opus-4 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-sonnet-4 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-opus-4-1 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| claude-opus-4-1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-sonnet-4-5 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-haiku-4-5 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-opus-4-5 | terminalBench | 2026-09-22 | not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards; Anthropic reported 2.0 only |
| claude-opus-4-5 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gemini-1-5-pro | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gemini-1-5-pro | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gemini-2-0-flash | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gemini-2-0-flash | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gemini-2-5-pro | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gemini-2-5-pro | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gemini-3-pro | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| llama-3-1-405b | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| llama-4-maverick | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| grok-3 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| grok-3 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| grok-4 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| grok-4 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| grok-4-1 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| grok-4-1 | terminalBench | 2026-09-22 | not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards |
| grok-4-1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| mistral-large-2 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| mistral-large-2 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| mistral-medium-3 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| mistral-medium-3 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| deepseek-v3 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| deepseek-v3 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| deepseek-r1 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| deepseek-r1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| deepseek-v3-2 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| qwen3-235b | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| qwen3-max | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| qwen3-max | terminalBench | 2026-09-22 | not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards |
| qwen3-max | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| kimi-k2 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| kimi-k2-thinking | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| kimi-k2-thinking | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| kimi-k3 | sweBenchPro | 2026-09-22 | Moonshot's HF model card table (DeepSWE 67.5, Terminal-Bench 2.1 88.3, ProgramBench, Kimi Code Bench, SWE-Marathon, SciCode) has no SWE-bench Pro row; not on Scale's leaderboard |
| mistral-large-3 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| mistral-large-3 | terminalBench | 2026-09-22 | not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards |
| mistral-large-3 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gemini-3-1-pro | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| qwen3-5 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| qwen3-5 | terminalBench | 2026-09-22 | not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards |
| qwen3-5 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| mistral-small-4 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| mistral-small-4 | terminalBench | 2026-09-22 | not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards |
| mistral-small-4 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| muse-spark | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gpt-5-5 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| deepseek-v4 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| grok-4-3 | sweBenchPro | 2026-09-22 | xAI published tau2-Bench/IFBench at launch; not on Scale's leaderboard (Grok 4.5 was the first Grok with a SWE-bench Pro figure) |
| grok-4-3 | terminalBench | 2026-09-22 | not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards |
| grok-4-3 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gemini-3-5-flash | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| qwen3-8-max | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1596 — migrate the key before using it |
| qwen3-7-max | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-opus-4-8 | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1438 (max) — migrate the key before using it |
| gemma-4 | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gemma-4 | terminalBench | 2026-09-22 | not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards |
| gemma-4 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| glm-5-2 | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1358 (max) — migrate the key before using it |
| gpt-5-6-terra | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1432 (max) — migrate the key before using it |
| gpt-5-6-luna | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1443 (max) — migrate the key before using it |
| soofi-s-30b-a3b | sweBenchPro | 2026-09-22 | not evaluated in arXiv:2607.09424 |
| soofi-s-30b-a3b | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gemini-3-5-flash-lite | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| claude-sonnet-5 | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1449 (max) — migrate the key before using it |
| grok-4-5 | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1370 (high) — migrate the key before using it |
| muse-spark-1-1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| laguna-s-2-1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| nemotron-3-super | sweBenchPro | 2026-09-22 | not in NVIDIA's model card table |
| nemotron-3-super | terminalBench | 2026-09-22 | not in NVIDIA's Super model card table as read; not on tbench.ai/Snorkel or BenchLM Terminal-Bench 2.1 boards |
| nemotron-3-super | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| nemotron-3-ultra | sweBenchPro | 2026-09-22 | NVIDIA's BF16 model card table has SWE-Bench Verified and Multilingual but no SWE-bench Pro |
| nemotron-3-ultra | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| hy3 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| longcat-2-0 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| motif-3-beta | sweBenchPro | 2026-09-22 | same table set as the final release; no SWE-bench Pro row |
| motif-3-beta | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| laguna-xs-2-1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| qwen3-7-flash | sweBenchPro | 2026-09-22 | no benchmark table exists for this model (changelog-only launch); not on any SWE-bench Pro board |
| qwen3-7-flash | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| deepseek-v4-flash-0731 | sweBenchPro | 2026-09-22 | DeepSeek's 0731 table reports DeepSWE 54.4, NL2Repo, Cybergym, Toolathlon and ALE, not SWE Pro; llm-stats' "DeepSeek-V4-Flash-Max 52.6" is the April Flash build |
| deepseek-v4-flash-0731 | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1427 (max) — migrate the key before using it |
| claude-sonnet-4-6 | sweBenchPro | 2026-09-22 | system card reports SWE-bench Verified and Multilingual only; not on Scale's public leaderboard |
| claude-sonnet-4-6 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| mach-1-additive-35b | sweBenchPro | 2026-09-22 | Syzygy publishes retention percentages only |
| mach-1-additive-35b | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| ling-2-6-1t | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| ling-2-6-1t | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gpt-oss-120b | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gpt-oss-20b | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| gpt-oss-20b | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| minimax-m2 | sweBenchPro | 2026-09-22 | MiniMax's HF card reports SWE-bench Verified, Multi-SWE-Bench and Multilingual, no SWE-bench Pro |
| minimax-m2 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| minimax-m2-5 | sweBenchPro | 2026-09-22 | MiniMax's HF card omits SWE-bench Pro; llm-stats' 55.4 attributed to MiniMax could not be traced to a primary table |
| minimax-m2-5 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| minimax-m3 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| seed-2-0-pro | sweBenchPro | 2026-09-22 | not in the Seed2.0 model card tables as previously read; not on Scale's leaderboard |
| seed-2-0-pro | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| seed-2-1-pro | sweBenchPro | 2026-09-22 | ByteDance published only qualitative "leading scores on SWE-Pro"; llm-stats' 57.5 is untraceable to a ByteDance table |
| seed-2-1-pro | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| ernie-5-0 | sweBenchPro | 2026-09-22 | same |
| ernie-5-0 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| ernie-5-1 | sweBenchPro | 2026-09-22 | Baidu reported no SWE-bench Pro figure; not on Scale's leaderboard |
| ernie-5-1 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| nova-premier | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| nova-premier | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| nova-2-pro | sweBenchPro | 2026-09-22 | Amazon reported SWE-bench Verified only; not on Scale's leaderboard |
| nova-2-pro | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| command-a | sweBenchPro | 2026-09-22 | not on Scale's public-set leaderboard (25 models, checked 2026-09-22) or the SWE-Bench Pro paper's public-set table; lab never reported SWE-bench Pro |
| command-a | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| command-a-plus | sweBenchPro | 2026-09-22 | Cohere reported no SWE-bench variant |
| command-a-plus | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| muse-spark-1-2 | gpqaDiamond | 2026-09-22 | not published by Meta (launch material is agentic bar charts); AA's model page shows only Intelligence Index 40 and now marks the model deprecated in favour of 1.3 |
| muse-spark-1-2 | sweBenchPro | 2026-09-22 | Meta reported Terminal-Bench 2.1 inside Muse Code for 1.2 and no SWE-bench Pro figure (1.1 was the last with one); not on Scale's leaderboard |
| muse-spark-1-2 | hle | 2026-09-22 | same — AA folds HLE into its index without a per-eval figure; Meta published none |
| muse-spark-1-2 | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1482 (xhigh) — migrate the key before using it |
| muse-glimmer | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| gpt-5-6-cyber | sweBenchPro | 2026-09-22 | OpenAI published only cyber evals for this variant |
| gpt-5-6-cyber | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| nemotron-3-5-lightning | sweBenchPro | 2026-09-22 | NVIDIA's model card reports SWE-bench Verified only |
| nemotron-3-5-lightning | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| grok-4-6 | sweBenchPro | 2026-09-22 | xAI's card reports deepSwe, CursorBench, FrontierCode, SWE-Marathon and Terminal-Bench 3.0 but no SWE-bench Pro; not on Scale's public leaderboard; secondary coverage confirms the omission |
| qwen3-8-2-4t-a95b | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1597 — migrate the key before using it |
| gemini-3-7-flash | sweBenchPro | 2026-09-22 | Google's 3.7 Flash model card has no SWE-Bench Pro row (FrontierCode 1.1, DeepSWE v1.1, Terminal-bench 2.1/3.0, AutomationBench, GDPVal-AA v2 1525, Harvey, GDP.pdf, CharXiv, LVBench, MRCR, OSWorld-2.0, BioMysteryBench, LABBench2); DataCamp's 60.4% remains untraceable |
| gemini-3-7-flash | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1371 (high) — migrate the key before using it |
| qwen3-8-27b | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1409 (xhigh) — migrate the key before using it |
| glm-5-3 | sweBenchPro | 2026-09-22 | Z.ai's HF model card table (Terminal-Bench 2.1/3.0, DeepSWE v1.1, CyberGym, ExploitGym, HLE w/ tools, Toolathlon, AutomationBench, ALE-CLI) has no SWE-bench Pro row; not on Scale's leaderboard |
| glm-5-3 | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1646 (max) — migrate the key before using it |
| ornith-1-5-397b | lmarenaElo | 2026-09-22 | no Ornith listing on arena.ai's text leaderboard (402 models, 2026-09-13 update) |
| ornith-1-5-397b | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| ornith-1-5-397b | arcAgi2 | 2026-09-22 | not in ARC Prize's results index; HF model card has no ARC-AGI row |
| ornith-1-5-397b | maxOutput | 2026-09-22 | HF model card states only a 131,072-token generation limit used in its own evaluation runs, not a documented serving cap; no hosted API exists |
| ornith-1-5-397b | knowledgeCutoff | 2026-09-22 | not stated in the HF model card |
| glm-5-3-flash | gpqaDiamond | 2026-09-22 | not in Z.ai's launch table or HF card; the single-source "91.2" AA claim in earlier notes still could not be corroborated on AA's model page (Intelligence Index 42 only) |
| glm-5-3-flash | sweBench | 2026-09-22 | Z.ai reports DeepSWE v1.1 63.4, not SWE-bench Verified; no third-party Verified run found |
| glm-5-3-flash | sweBenchPro | 2026-09-22 | Z.ai's six-benchmark launch table (DeepSWE v1.1, AutomationBench, GDPval-AA v2, Terminal Bench 2.1, Toolathlon, multimodal) has no SWE-bench Pro row; HF card footnotes name the benchmark but no figure is readable; not on Scale's leaderboard |
| glm-5-3-flash | hle | 2026-09-22 | only "HLE w/ tools 55.3" circulates (Qubrid/eesel relaying Z.ai); no no-tools figure, and the tracked cell records no-tools scores |
| glm-5-3-flash | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1641 — migrate the key before using it |
| glm-5-3-flash | arcAgi2 | 2026-09-22 | no GLM-5.3-Flash entry in ARC Prize's results index (17 systems as of 2026-09-22) |
| glm-5-3-flash | knowledgeCutoff | 2026-09-22 | not stated in the HF model card, Z.ai launch coverage, or AA's model page |
| hy4-preview | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| deepseek-v4-pro-0813 | sweBenchPro | 2026-09-22 | DeepSeek's 0813 table (Terminal-Bench 2.1, DeepSWE, NL2Repo, CyberGym, AutomationBench) omits SWE Pro; the HF V4-Pro card's 55.4 is the April V4-Pro-Max figure, already recorded on deepseek-v4 |
| deepseek-v4-pro-0813 | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1441 (max) — migrate the key before using it |
| motif-3 | sweBenchPro | 2026-09-22 | not in Motif's model-card table (SWE-bench Verified, Terminal-Bench 2.1, GPQA Diamond, τ²-Bench Telecom, AA-Omniscience) |
| motif-3 | gdpvalAA | 2026-09-22 | not on Artificial Analysis' GDPval-AA board (now v2.1) and no v2 rating ever published; older/uncovered model |
| qwen3-8-flash-next | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1612 — migrate the key before using it |
| deepseek-v4-flash-vision-exp | sweBenchPro | 2026-09-22 | DeepSeek's eleven-benchmark launch table has no SWE-bench Pro row |
| deepseek-v4-flash-vision-exp | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1534 (max) — migrate the key before using it |
| qwen3-8-max-0902 | sweBenchPro | 2026-09-22 | Qwen's 0902 table (Terminal-Bench 3.0, DeepSWE 1.1, NL2Repo, ProgramBench, SWE-Marathon, CoWorkBench, JobBench, Toolathlon) has no SWE-bench Pro row; llm-stats' "Qwen3.8 Max 67.7" is the August build |
| qwen3-8-max-0902 | gdpvalAA | 2026-09-22 | Artificial Analysis' board has moved to GDPval-AA v2.1 (rescaled — Fable 5.1 max reads 1735 there against the 1853 v2 figure on record), and no v2 rating for this model is retrievable; not filled to avoid mixing scales. v2.1 rating seen 2026-09-22: 1668 — migrate the key before using it |
| qwen3-8-omni-flash | knowledgeCutoff | 2026-09-20 | not stated in launch coverage; one third-party listing's "Apr 2024" appears to describe the earlier Qwen3-Omni line, not this checkpoint, so rejected as unreliable rather than used |
| qwen3-8-omni-flash | mmluPro | 2026-09-20 | not reported by Alibaba for this checkpoint in any source read this session |
| qwen3-8-omni-flash | sweBench | 2026-09-20 | Alibaba reports SWE-bench Pro (63.3, recorded), not SWE-bench Verified, for this checkpoint |
| qwen3-8-omni-flash | terminalBench | 2026-09-20 | not reported by Alibaba for this checkpoint |
| qwen3-8-omni-flash | aime | 2026-09-20 | not reported by Alibaba for this checkpoint |
| qwen3-8-omni-flash | hle | 2026-09-20 | not reported by Alibaba for this checkpoint |
| qwen3-8-omni-flash | lmarenaElo | 2026-09-20 | no arena.ai text-leaderboard listing found for this checkpoint at launch |
| qwen3-8-omni-flash | gdpvalAA | 2026-09-20 | no Artificial Analysis coverage found for this checkpoint; a 1743 figure found elsewhere is for the separate Qwen3.8-Flash-Next model, not used here |
| qwen3-8-omni-flash | arcAgi2 | 2026-09-20 | not reported by Alibaba and no independent leaderboard listing found |
| qwen3-8-omni-flash | costPerTask | 2026-09-20 | no Artificial Analysis Intelligence Index measurement found for this checkpoint |
| qwen3-8-omni-flash | speed | 2026-09-20 | no Artificial Analysis speed measurement found for this checkpoint |
New-model-release sweep on 2026-09-22 (window widened to 2026-09-11 through 2026-09-22), scoped to `atria-dawn-preview`, `kimi-k2-8-preview`, `step-5-preview` and `grok-4-7`. Sources read directly: x.ai/news/grok-4-7, docs.x.ai (models page and grok-4.7 card), artificialanalysis.ai (models leaderboard, grok-4-7 / grok-4-7-high / step-5 model pages, gdpval-aa, humanitys-last-exam and gpqa-diamond evaluation pages), arena.ai text leaderboard (last updated 2026-09-13), arcprize.org/leaderboard (table did not render), StepFun's X announcement (via fxtwitter), platform.stepfun.ai model and pricing docs, CellCog's transcription of StepFun's table, huggingface.co/internlm/Atria-Dawn-Preview, github.com/atria-asi/Atria-Dawn-Preview, arxiv.org/abs/2609.15818, api.atria-asi.ai, llmgateway.io, kimi.com/code docs (what's-new and models pages), platform.kimi.ai pricing, the-decoder, orcarouter, byteiota, forum.cursor.com. Note for the maintainer: Artificial Analysis has replaced GDPval-AA v2 with v2.1 (Intelligence Index v4.3.2) and the Elo scale moved (Grok 4.6 1753 on v2 vs 1632 on v2.1; Claude Fable 5.1 1853 vs 1735; Kimi K3 1668 vs 1524), so `gdpvalAA` — defined in benchmarks.json as v2 — can no longer be filled for new models from AA's live board; the v2.1 figures below are in each model's notes pending a decision on re-keying.
| atria-dawn-preview | gpqaDiamond / hle / sweBench / lmarenaElo / arcAgi2 / mmluPro / aime | 2026-09-22 | not in the model card's 16-benchmark table (which reports SWE-bench Pro, Terminal-Bench 2.1 and agentic/discovery suites instead); no Artificial Analysis page, no arena.ai listing, no ARC Prize entry surfaced |
| atria-dawn-preview | gdpvalAA | 2026-09-22 | the card's "GDPval" 1583 carries no version and its comparison-model figures (Claude Opus 5 1768, GPT-5.6 Sol 1682, Kimi K3 1611) match neither AA's v2 nor v2.1 boards — treated as the lab's own run, not recorded |
| atria-dawn-preview | pricing / costPerTask / speed | 2026-09-22 | api.atria-asi.ai publishes no price (Google sign-in, key issued in console); LLM Gateway serves it free at launch; no AA measurement |
| atria-dawn-preview | knowledgeCutoff | 2026-09-22 | not on the HF card, GitHub README, or arXiv abstract |
| kimi-k2-8-preview | gpqaDiamond / sweBench / sweBenchPro / terminalBench / hle / lmarenaElo / gdpvalAA / arcAgi2 / mmluPro / aime | 2026-09-22 | Moonshot has published no benchmark table or model card — only "performance close to K3"; not on AA, arena.ai or ARC Prize |
| kimi-k2-8-preview | pricing / costPerTask / maxOutput / knowledgeCutoff | 2026-09-22 | subscription-only through the kimi-for-coding alias; platform.kimi.ai pricing lists K3 and K2.7 Code but no K2.8; third-party gateway prices ($0.80-1 / $3.35-4) are unofficial and rejected |
| step-5-preview | hle | 2026-09-22 | StepFun's table lists 46.5% but its footnote says the HLE row is a with-tools row mixing text-only-subset and full-dataset runs; AA's HLE board excerpt did not include the model |
| step-5-preview | gdpvalAA | 2026-09-22 | StepFun's table shows 1571 with an unconfirmed version label (transcribed as "v2"); AA's live board gives 1566 on v2.1, which is not on the v2 scale this key records |
| step-5-preview | sweBench / sweBenchPro / terminalBench / lmarenaElo / arcAgi2 / mmluPro / aime | 2026-09-22 | StepFun reports DeepSWE v1.1 67.7, SWE-Marathon v1.1 72.7 and Terminal-Bench 4.0 33.3 instead of SWE-bench Verified/Pro or TB 2.1; no arena.ai listing; no ARC Prize entry surfaced |
| step-5-preview | knowledgeCutoff | 2026-09-22 | not in the X announcement, platform docs or llms.txt |
| grok-4-7 | gpqaDiamond / hle / sweBench / sweBenchPro / terminalBench / lmarenaElo / arcAgi2 / mmluPro / aime | 2026-09-22 | xAI's card reports only CursorBench 4.0, DeepSWE v1.1, EEBench, AA Briefcase, Terminal-Bench 4.0 (38.0%; AA measures 26%), Harvey Legal Agent and HealthBench Professional — none map to a tracked key and TB 4.0 is not comparable with 2.1; AA publishes only the composite index (46); arena.ai's board predates the release; no ARC Prize entry surfaced |
| grok-4-7 | gdpvalAA | 2026-09-22 | AA rates it 1694 (high) / 1695 (xhigh) on GDPval-AA v2.1 — a different scale from the v2 this key records (see sweep note) |
| grok-4-7 | costPerTask / speed | 2026-09-22 | AA lists both high and xhigh variants with pricing "--" and no speed or cost-per-task figures as of 2026-09-22; re-check |
| grok-4-7 | maxOutput | 2026-09-22 | docs.x.ai documents context, tiered pricing and rate limits but no output cap (same as 4.5 / 4.6) |
| claude-opus-5-5 | gpqaDiamond | 2026-09-23 | not in Anthropic's launch post or system card (GPQA dropped from official reporting); no Opus 5.5 variant on Artificial Analysis' gpqa-diamond leaderboard or Vals AI's model page as of 2026-09-23 |
| claude-opus-5-5 | sweBench | 2026-09-23 | Anthropic's system card reports SWE-bench Pro / Multilingual / Multimodal only; no SWE-bench Verified run on Vals AI or Scale's public board as of 2026-09-23 |
| claude-opus-5-5 | mmluPro | 2026-09-23 | not in the launch post or system card (only Global MMLU 94.3%); absent from Vals AI's page |
| claude-opus-5-5 | aime | 2026-09-23 | not published; Anthropic retired AIME from reporting |
| claude-opus-5-5 | lmarenaElo | 2026-09-23 | arena.ai's text leaderboard (2026-09-13 update) predates the release; no Opus 5.5 listing yet — re-check |
| claude-opus-5-5 | gdpvalAA | 2026-09-23 | Anthropic's system card reports 1846 on GDPval-AA v2.1 (max effort) — a different scale from the v2 this key records |
| claude-opus-5-5 | speed | 2026-09-23 | Artificial Analysis lists only a max-effort variant and shows "No data available" for output speed and first-answer latency on its model and providers pages as of 2026-09-23; re-check |
| gpt-6-sol | gpqaDiamond | 2026-09-23 | not in OpenAI's launch table (which uses AutomationBench, Agents' Last Exam, FrontierCode, DeepSWE, OSWorld only) and absent from Artificial Analysis' GPQA Diamond board and comparison pages; no system card was published |
| gpt-6-sol | sweBench | 2026-09-23 | OpenAI has not published SWE-bench Verified since February 2026; no launch-table or third-party figure |
| gpt-6-sol | sweBenchPro | 2026-09-23 | not on Scale's SWE-bench Pro public board as of 2026-09-23 (no GPT-6 or GPT-5.6 rows at all); OpenAI reports DeepSWE v1.1 68.8% instead |
| gpt-6-sol | terminalBench | 2026-09-23 | only Terminal-Bench 4.0 runs exist (AA 43–44% at max), not the tracked 2.1 |
| gpt-6-sol | lmarenaElo | 2026-09-23 | not on the arena.ai text board (last update 2026-09-13) the day after launch; re-check |
| gpt-6-sol | gdpvalAA | 2026-09-23 | AA rates it 1487 (max) / 1320 (medium) on GDPval-AA v2.1 — a different scale from the v2 this key records; migrate the key before using it |
| gpt-6-sol | arcAgi2 | 2026-09-23 | ARC Prize published a GPT-6 Luna results page on 2026-09-22 but none for Sol (arcprize.org/results index has no Sol entry); re-check |
| gpt-6-sol | mmluPro / aime | 2026-09-23 | retired benchmarks; not in OpenAI's launch table |
| gpt-6-luna | gpqaDiamond | 2026-09-23 | not in OpenAI's launch table and absent from Artificial Analysis' GPQA Diamond board and comparison pages; no system card was published |
| gpt-6-luna | sweBench | 2026-09-23 | OpenAI has not published SWE-bench Verified since February 2026; no launch-table or third-party figure |
| gpt-6-luna | sweBenchPro | 2026-09-23 | not on Scale's SWE-bench Pro public board as of 2026-09-23; OpenAI reports DeepSWE v1.1 66.6% instead |
| gpt-6-luna | terminalBench | 2026-09-23 | only a Terminal-Bench 4.0 run exists (AA 13% at max), not the tracked 2.1 |
| gpt-6-luna | lmarenaElo | 2026-09-23 | not on the arena.ai text board (last update 2026-09-13) the day after launch; re-check |
| gpt-6-luna | gdpvalAA | 2026-09-23 | AA rates it 1367 (max) / 1218 (medium) on GDPval-AA v2.1 — a different scale from the v2 this key records; migrate the key before using it |
| gpt-6-luna | mmluPro / aime | 2026-09-23 | retired benchmarks; not in OpenAI's launch table |

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
| claude-fable-5 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards as of July 2026 |
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
| claude-opus-5 | lmarenaElo | 2026-07-27 | no Claude Opus 5 listing on arena.ai's text leaderboard as of 2026-07-27 (three days post-launch); BenchLM also shows Arena Elo "Not listed" |
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
| gpt-5-6-terra | arcAgi2 | 2026-07-29 | ARC Prize published Sol only; Terra untested |
| gpt-5-6-terra | knowledgeCutoff | 2026-07-29 | not disclosed per tier; Sol's 2026-02 not confirmed to apply to Terra |
| nemotron-3-ultra | mmluPro | 2026-07-29 | NVIDIA's technical report has ablation/quantisation tables rather than one headline model table; could not attribute a final-model figure |
| nemotron-3-ultra | gpqaDiamond | 2026-07-29 | same — report shows both 'GPQA Diamond' and 'GPQA no tools' rows across many configs; no unambiguous final figure |
| nemotron-3-ultra | sweBench | 2026-07-29 | not reported for Ultra |
| nemotron-3-ultra | aime | 2026-07-29 | not reported; report cites IMO AnswerBench instead |
| nemotron-3-ultra | hle | 2026-07-29 | multiple HLE rows across ablations (no-tools and with-tools); no unambiguous final figure |
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
| minimax-m3 | lmarenaElo | 2026-08-07 | no MiniMax-M3 text-arena Elo found on arena.ai |
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
| gemini-3-7-flash | lmarenaElo | 2026-08-16 | not found on arena.ai's text leaderboard; only the separate WebDev Arena Elo (1588, a different arena) was published |
| gemini-3-7-flash | arcAgi2 | 2026-08-16 | not reported by Google; not found on ARC Prize or tracker leaderboards |
| qwen3-8-27b | mmluPro | 2026-08-16 | not in Alibaba's own release material or on any MMLU-Pro tracker found |
| qwen3-8-27b | sweBench | 2026-08-16 | Alibaba reports SWE-bench Pro (61.7%), not the Verified variant this field tracks |
| qwen3-8-27b | aime | 2026-08-16 | no AIME figure published or found on any tracker |
| qwen3-8-27b | hle | 2026-08-16 | secondary coverage references the model's HLE standing relative to Qwen3.7-Plus and Opus 4.6 Max without giving an absolute score; no exact figure traceable to a primary source |
| qwen3-8-27b | lmarenaElo | 2026-08-16 | no arena.ai text-leaderboard listing found |
| qwen3-8-27b | arcAgi2 | 2026-08-16 | not reported by Alibaba; not on ARC Prize or tracker leaderboards |
| qwen3-8-27b | knowledgeCutoff | 2026-08-16 | not disclosed by Alibaba in the GitHub repo, HF listing (blocked from direct fetch) or any secondary source found; explicitly called out as undisclosed by one source |
| glm-5-3 | mmluPro / gpqaDiamond / sweBench / aime / hle / lmarenaElo / arcAgi2 | 2026-08-16 | Z.ai's launch benchmark table is entirely agentic/coding/cyber (Terminal-Bench 2.1/3.0, DeepSWE v1.1, SWE-Marathon v1.1, AutomationBench, Agents' Last Exam, CyberGym) — none of the tracked knowledge/reasoning keys were re-reported, consistent with Z.ai's stated "same base model, post-training only" framing; not on arena.ai or Artificial Analysis (too new, no public API pricing or weights yet) |
| glm-5-3 | knowledgeCutoff | 2026-08-16 | not disclosed for the 5.3 post-training run specifically; GLM-5.2's cutoff (2026-03) is not confirmed to carry over |
| glm-5-3 | pricing (input/output) | 2026-08-16 | Z.ai's official pricing table still ends at GLM-5.2 with no GLM-5.3 row; only the GLM Coding Plan's flat monthly subscription tiers ($18/$80/$168) are public, not a per-token rate |

New-model-release research on 2026-08-18 (daily sweep), scoped to `deepseek-v4-pro-0813` (released 2026-08-13; missed by the 08-14 and 08-17 scans). WebFetch was not permitted at all this session — findings rest on WebSearch-synthesized excerpts, cross-checked across at least two independent outlets each. Sources checked: DeepSeek's Hugging Face model card (huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813, via mirrored README text on Fireworks/DeepInfra), DeepSeek's API-pricing post on X (x.com/deepseek_ai/status/2087864589895798968), Artificial Analysis model/providers pages and X post, Vals AI model page, arena.ai, ARC Prize, SCMP, TechTimes, Yahoo/Quartz, Engadget, InfoWorld, Fortune, MindStudio, codersera, dsv4pro.novcog.us.com, gHacks, OfficeChai, aihubmix.

| model-id | field | checked | reason |
|---|---|---|---|
| deepseek-v4-pro-0813 | mmluPro | 2026-08-18 | not in DeepSeek's 0813 card table as reported by any outlet; the 87.5 aggregators carry is April's preview (V4-Pro-Max) figure, not re-run for 0813 |
| deepseek-v4-pro-0813 | aime | 2026-08-18 | not reported by DeepSeek, Artificial Analysis or Vals AI for this build |
| deepseek-v4-pro-0813 | lmarenaElo | 2026-08-18 | no 0813-specific text-arena listing found; only an approximate "~1450" for the un-dated "DeepSeek V4 Pro" and a Code Arena WebDev score (1607, a different arena) |
| deepseek-v4-pro-0813 | arcAgi2 | 2026-08-18 | ARC Prize has verified V4-Flash-0731 (61.4%) but published no V4-Pro-0813 result as of this check |
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

| glm-5-3 | mmluPro / gpqaDiamond / sweBench / aime / hle / lmarenaElo / arcAgi2 | 2026-08-16 | Z.ai's launch benchmark table is entirely agentic/coding/cyber (Terminal-Bench 2.1/3.0, DeepSWE v1.1, SWE-Marathon v1.1, AutomationBench, Agents' Last Exam, CyberGym) — none of the tracked knowledge/reasoning keys were re-reported, consistent with Z.ai's stated "same base model, post-training only" framing; not on arena.ai; Artificial Analysis now lists it (Intelligence Index 60 at max effort) but AA per-benchmark cells were not readable via search snippets on 2026-09-02 |
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

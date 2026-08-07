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
| kimi-k3 | arcAgi2 | 2026-07-21 | not on ARC-AGI-2 leaderboards as of July 2026; one blog cites "ARC-AGI: 8%" with version unclear — rejected |
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
| gemini-3-6-flash | arcAgi2 | 2026-07-29 | not on ARC Prize, BenchLM or llm-stats ARC-AGI-2 leaderboards |
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
| deepseek-v4-flash-0731 | arcAgi2 | 2026-08-02 | not on ARC-AGI-2 leaderboards as of 2026-08-02 |
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

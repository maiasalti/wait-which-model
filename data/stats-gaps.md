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
| llama-5 | mmluPro | 2026-07-04 | Meta published no benchmark table; trackers had not evaluated it (July 2026) |
| llama-5 | gpqaDiamond | 2026-07-04 | same — no public figure |
| llama-5 | sweBench | 2026-07-04 | same — no public figure |
| llama-5 | aime | 2026-07-04 | same — no public figure |
| llama-5 | hle | 2026-07-04 | same — no public figure |
| llama-5 | lmarenaElo | 2026-07-04 | not listed on LMArena as of July 2026 |
| llama-5 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| llama-5 | maxOutput | 2026-07-04 | open weights; no canonical max-output figure published |
| llama-5 | inputPrice | 2026-07-04 | open weights; no first-party API pricing |
| llama-5 | outputPrice | 2026-07-04 | open weights; no first-party API pricing |
| llama-5 | knowledgeCutoff | 2026-07-04 | not disclosed by Meta |
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
| qwen3-8-max | mmluPro | 2026-07-27 | preview announcement with no technical report, model card or AA entry; every number circulating "for" Qwen3.8 traces back to Qwen3.7-Max |
| qwen3-8-max | gpqaDiamond | 2026-07-27 | same — no published benchmark of any kind |
| qwen3-8-max | sweBench | 2026-07-27 | same — no published benchmark of any kind |
| qwen3-8-max | aime | 2026-07-27 | same — no published benchmark of any kind |
| qwen3-8-max | hle | 2026-07-27 | same — no published benchmark of any kind |
| qwen3-8-max | arcAgi2 | 2026-07-27 | not on ARC-AGI-2 leaderboards |
| qwen3-8-max | lmarenaElo | 2026-07-27 | not present on arena.ai's text leaderboard (only qwen3.7-max-preview and older Qwen entries) |
| qwen3-8-max | inputPrice | 2026-07-27 | no standard per-token price — preview is credit/subscription access only (Token Plan, Qoder). Reseller AIHubMix lists a $0.17/1M "launch offer" at 10% of an undisclosed standard rate, so no stable list price exists |
| qwen3-8-max | outputPrice | 2026-07-27 | same — AIHubMix's $0.51/1M is the same promotional 10%-of-standard launch offer |
| qwen3-8-max | knowledgeCutoff | 2026-07-27 | not disclosed by Alibaba |
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

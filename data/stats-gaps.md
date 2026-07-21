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
| claude-opus-4-8 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards (4.6/4.7 tested, 4.8 not) |
| claude-fable-5 | mmluPro | 2026-07-04 | Anthropic retired saturated benchmarks; BenchLM hides non-public rows |
| claude-fable-5 | aime | 2026-07-04 | not reported; no verifiable third-party figure |
| claude-fable-5 | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards as of July 2026 |
| gemini-1-5-pro | sweBench | 2026-07-04 | Google never reported SWE-bench for 1.5 Pro; no comparable figure |
| gemini-1-5-pro | aime | 2026-07-04 | never publicly evaluated on AIME |
| gemini-1-5-pro | arcAgi2 | 2026-07-04 | predates benchmark; never evaluated |
| gemini-2-0-flash | aime | 2026-07-04 | Google reported MATH, not AIME; no public AIME figure |
| gemini-2-0-flash | arcAgi2 | 2026-07-04 | not on ARC-AGI-2 leaderboards |
| gemini-3-1-pro | mmluPro | 2026-07-04 | not reported by Google; not on MMLU-Pro trackers |
| gemini-3-5-flash | mmluPro | 2026-07-04 | not reported; benchlm shows category composites only |
| gemini-3-5-flash | gpqaDiamond | 2026-07-04 | only approximate "~92.2%" third-party claim; no exact verifiable figure |
| gemini-3-5-flash | aime | 2026-07-04 | not reported at I/O 2026; no public figure |
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

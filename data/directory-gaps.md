---
type: Data Gap Report
title: Directory gaps
description: Cells in the non-model directories researched under protocols/DIRECTORY_RELEASE_PROTOCOL.md and found unverifiable
  from primary sources. Re-runs skip everything listed here.
tags:
- data
generated:
  by: human:maia
  at: '2026-10-14T00:00:00Z'
---

# Directory gaps

Cells researched under `protocols/DIRECTORY_RELEASE_PROTOCOL.md` and found unverifiable from
primary sources. Re-runs skip everything listed here.

Format: `entry-id · field · YYYY-MM-DD · what was searched`

## image-models

minimax-h3-image · scores.lmarenaImageElo · 2026-11-12 · arena.ai text-to-image board (Nov 8 update): not listed
mai-image-2-7 · pricing.perImageUsd · 2026-11-19 · Azure Foundry Models pricing page (no 2.7 row), ai.azure.com catalog page (no figures), Learn how-to; microsoft.ai gives only "~$35 per 1,000 images" with no size
mai-image-2-7-flash · pricing.perImageUsd · 2026-11-19 · Azure Foundry Models pricing page (no 2.7 row), ai.azure.com catalog page (no figures), Learn how-to; microsoft.ai gives only "~$10 per 1,000 images" with no size
mai-image-2-7-flash · scores.lmarenaImageElo · 2026-11-19 · arena.ai text-to-image board (Nov 16 update): not listed
sensenova-u1-6 · pricing.perImageUsd · 2026-11-26 · sensetime.com U1.6 post (Token Plan "free for a limited time", no price), sensenova.cn/u1-6-lite page (no price), web search for Token Plan image pricing: nothing published
sensenova-u1-6 · maxResolution · 2026-11-26 · Hugging Face model card (no stated maximum), GitHub examples README (1m–16m pixel budgets, but the size table names the U1.5 checkpoint), sensetime.com post: none stated for U1.6
sensenova-u1-6 · apiIds · 2026-11-26 · sensenova.cn/u1-6-lite page, sensetime.com post, web search for "sensenova-u1.6-lite": no API model id published
sensenova-u1-6 · scores.aaImageArenaElo · 2026-11-26 · artificialanalysis.ai text-to-image page: not listed (arena table did not render)
sensenova-u1-6 · scores.lmarenaImageElo · 2026-11-26 · arena.ai text-to-image board (Nov 21 update, 87 models): not listed

## video-models

utopai-x · pricing.perSecondUsd · 2026-10-27 · utopaistudios.com PAI pricing page: credit-priced (93 credits/s at 1080p), credit packs vary $15–$150, no USD per-second rate
utopai-x · maxDurationSec · 2026-10-27 · utopaistudios.com Utopai X page, FAQ, PAI pages: only PAI-level 1-3 min / 4K figures, none for Utopai X itself
utopai-x · maxResolution · 2026-10-27 · utopaistudios.com pricing/Utopai X pages: a 1080p rate is listed, no stated maximum for the model
utopai-x · scores.lmarenaVideoElo · 2026-10-27 · LMArena text-to-video board (Sep 21) and changelog: not listed
minimax-h3-max · scores.lmarenaVideoElo · 2026-10-27 · LMArena text-to-video board (Sep 21) and changelog: not listed
agnes-video-2-5 · releaseDate · 2026-10-27 · agnes-ai.com / wiki.agnes-ai.com docs for 2.5, 2.5 Flash, v2.0 (retired): no date; AA lists 'Aug 2026' only
agnes-video-2-5 · nativeAudio · 2026-10-27 · agnes-ai.com 2.5 docs and prompting guide: audio documented only as a reference input; generated audio stated only for deprecated V1.2
agnes-video-2-5 · scores.lmarenaVideoElo · 2026-10-27 · LMArena text-to-video board (Sep 21) and changelog: not listed
seedance-2-5 · pricing.perSecondUsd · 2026-10-27 · BytePlus ModelArk pricing is per million tokens; no per-second price published (not converted by design)
seedance-2-0 · pricing.perSecondUsd · 2026-10-27 · BytePlus ModelArk pricing is per million tokens; no per-second price published (not converted by design)
muse-video · pricing.perSecondUsd · 2026-10-27 · ai.meta.com launch post, dev.meta.ai models/overview: still 'early preview', not on the Meta Model API, no price
muse-video · maxDurationSec · 2026-10-27 · ai.meta.com, dev.meta.ai, research.meta.ai: not stated
muse-video · maxResolution · 2026-10-27 · ai.meta.com, dev.meta.ai, research.meta.ai: not stated (Muse Realtime Avatar's 448x768 is a different system)
muse-video · scores.aaVideoArenaElo · 2026-10-27 · AA-Video-T2V v2.1 board: not listed
gemini-omni-flash · scores.aaVideoArenaElo · 2026-10-27 · AA-Video-T2V v2.1 board: only Gemini Omni Flash 1.1 listed; the Gemini API preview id is shut down
skyreels-v4 · scores.lmarenaVideoElo · 2026-10-27 · LMArena text-to-video board (Sep 21) and changelog: not listed
heygen-video-1 · pricing.perSecondUsd · 2026-10-27 · heygen.com model page, blog/cheapest-video-models, help.heygen.com API pricing: three conflicting launch/list rates
heygen-video-1 · scores.lmarenaVideoElo · 2026-10-27 · LMArena text-to-video board (Sep 21) and changelog: not listed
flux-3-max · releaseDate · 2026-10-27 · fal.ai/flux-3-max, fal model pages, bfl.ai/models/flux-3-video, docs.bfl.ai release notes: no day given; AA lists 'Oct 2026'
flux-3-max · scores.lmarenaVideoElo · 2026-10-27 · LMArena text-to-video board (Sep 21) and changelog: not listed
gemini-omni-flash-1-2 · scores.aaVideoArenaElo · 2026-11-09 · AA text-to-video and image-to-video boards: not listed yet (newest Omni entry is 1.1 Flash)
gemini-omni-flash-1-2 · scores.lmarenaVideoElo · 2026-11-09 · LMArena video board: not listed yet

## world-models

genie-4 · maxSessionSec · 2026-10-28 · deepmind.google model page + Genie 4 blog + blog.google post (search excerpts): only "a few minutes of continuous interaction"; TechCrunch's "two minutes" not on Google pages
genie-4 · maxResolution · 2026-10-28 · deepmind.google + blog.google Genie 4 pages: no resolution stated (720p in results is Genie 3)
genie-4 · fps · 2026-10-28 · deepmind.google + blog.google Genie 4 pages: no frame rate stated (24 fps in results is Genie 3)
genie-4 · maxSessionSec · 2026-11-19 · resolved: deepmind.google/models/genie now says "around a minute of continuous interaction" → 60
genie-4 · maxResolution, fps · 2026-11-19 · re-checked deepmind.google/models/genie, 2026-11-18 "Genie 4 is now available" post, labs.google/projectgenie: still not stated
genie-4 · apiIds · 2026-11-19 · Oct 27 DeepMind blog promises Gemini API/AI Studio early-access partners; Nov 18 post + model page silent; no model id found
genie-4 · pricing (USD) · 2026-11-19 · one.google.com/about/google-ai-plans showed no US figure ("From /mo"), gemini.google/subscriptions showed SGD only; footnote ties Project Genie to an Ultra ("20x") plan
genie-4 · maxResolution, fps, apiIds, maxSessionSec, pricing · 2026-11-24 · resolved: aistudio.google.com/docs/models/genie-4 (Stable: genie-4) gives 1280x720 at 24 fps, up to 120 s per session, paid-tier token prices (~$0.10/s) → filled; consumer Project Genie price still unpublished
hy-nomas · interactive · 2026-10-28 · GitHub README + HF card: multi-turn steering during generation, no real-time claim; speed "depends on hardware…"; only community port reports (slower than real time)
hy-nomas · maxSessionSec · 2026-10-28 · GitHub README + HF card: segment-chained generation with history, no maximum length stated
pixverse-r2 · maxSessionSec · 2026-10-28 · pixverse.ai launch post, model page, technical post: "far longer sessions", no figure
pixverse-r2 · maxResolution · 2026-10-28 · pixverse.ai launch post, model page, technical post: "high-resolution final stage", no figure
pixverse-r2 · fps · 2026-10-28 · pixverse.ai launch post, model page, technical post: "real time", no figure
pixverse-r2 · apiIds · 2026-10-28 · pixverse.ai pages + docs.platform.pixverse.ai model-pricing: no R2 model id (docs cover V6 etc.)
odyssey-3 · fps · 2026-10-28 · odyssey.systems meet-odyssey-3 + introducing-odyssey-3: "real-time interaction" for distilled variant, no fps (Agora-2's 30 fps is a different model)
odyssey-3 · maxSessionSec · 2026-10-28 · odyssey.systems Odyssey-3 pages: "extended gameplay sessions" with no duration
odyssey-3 · apiIds · 2026-10-28 · odyssey.systems: "Get API Access" link exists; no Odyssey-3 model id or price in search excerpts
happy-oyster · fps · 2026-10-28 · fal.ai/happy-oyster, fal learn page, happyoyster.cn docs/gallery: "real-time", no fps
world-labs-atlas · interactive · 2026-10-28 · worldlabs.ai/blog/atlas: camera-controlled generation/reconstruction, no real-time interaction claim (World Labs' real-time model is RTFM)
world-labs-atlas · fps · 2026-10-28 · worldlabs.ai/blog/atlas: no frame rate stated
spaitial-echo-2 · maxResolution · 2026-10-28 · spaitial.ai Echo-2 blog + docs.spaitial.ai (models, llm-skills): Standard vs HQ "higher-resolution worlds", no resolution or splat count

## harnesses

## agents

gemini-agent-work · pricing.plan · 2026-10-28 · cloud.google.com blogs (Gemini at Work, startups), blog.google, Gemini Enterprise pricing/release notes: no price published
gemini-agent-work · links.docs · 2026-10-28 · cloud.google.com, docs.cloud.google.com, workspace.google.com: no docs page for the Gemini agent found
gemini-agent-work · underlyingModels · 2026-10-28 · Google posts say "Gemini family of models and Claude models" with no versions
devin-oncall · pricing.plan · 2026-10-28 · devin.ai blog/oncall page, docs.devin.ai billing/usage: no Oncall-specific price
devin-oncall · underlyingModels · 2026-10-28 · devin.ai launch post, docs.devin.ai product guide: no model named
microsoft-copilot-autopilot · links.docs · 2026-10-28 · support.microsoft.com, learn.microsoft.com (only Windows Autopilot device docs), microsoft.com/copilot
minimax-mavis · links.docs · 2026-10-28 · agent.minimax.io, minimax.io, platform.minimax.io: only API docs and subscription terms, no agent docs
minimax-mavis · pricing.plan · 2026-10-28 · agent.minimax.io/pricing, platform.minimax.io Token Plan: $22/$55/$132 vs $20/$50/$120 conflict persists; older terms page lists Basic/Pro/Ultra
qwen-task-assistant · links.docs · 2026-10-28 · qwen.ai, alibabagroup.com, alibabacloud.com: press release only, no help page
lovable · pricing.plan · 2026-10-28 · lovable.dev FAQ/billing: credits (Pro 100/mo) but no dollar price in excerpts; $25 only on third-party guides

## features

muse-for-small-business · links.docs · 2026-10-30 · search for Meta help-center setup/connector pages: only third-party guides (eesel, smartscope, parix); no Meta help article surfaced; WebFetch unavailable
claude-sheets · modelIds · 2026-11-12 · claude.com sheets-whiteboards-data article, support.claude.com Sheets guide: no model named (same for claude-whiteboards)
claude-install-as-app · modelIds · 2026-11-25 · claude.com install-as-app article, support.claude.com 18516354, release notes 2026-11-24: no model named
claude-meetings · modelIds · 2026-11-19 · claude.com claude-meetings article, support.claude.com 18325154, release notes 2026-11-12: no model named
claude-personal-finance · modelIds · 2026-11-19 · claude.com launch article, support.claude.com 18185620: no model named
claude-interactive-connectors · modelIds · 2026-11-19 · claude.com interactive-tools-in-claude and interactive-connectors-full-tool posts: no model named
chatgpt-wallet · modelIds · 2026-11-19 · openai.com introducing-chatgpt-wallet (reader proxy), help article 20001654, release notes: no model named
chatgpt-business-hub · modelIds, plans · 2026-11-19 · openai.com introducing-businesses-chatgpt (reader proxy), help article 20001635: no model named, not tied to a ChatGPT plan
muse-voice-and-avatars · plans, modelIds · 2026-11-19 · about.fb.com launch and Loblaw posts, Muse getting-started help page: no plans; models are Muse Realtime Voice/Avatar (no models.json ids)
muse-spaces · links.docs, plans, modelIds · 2026-11-19 · about.fb.com Spaces post, Meta Muse help-centre search: no Spaces help page, plans or named model
meta-muse · plans · 2026-11-19 · meta.com Muse subscriptions help page (reader proxy): no plan names or prices, 'may vary by region and account'
claude-ship · modelIds · 2026-11-24 · claude.com introducing-claude-ship article, claude.com product page, code.claude.com claude-ship, approvals and ship-command docs: no model named
gemini-computer-use-mac · modelIds · 2026-11-24 · blog.google computer-use-mac post, gemini.google release notes (newest entry 2026-11-17): no model named
gemini-computer-use-mac · links.docs · 2026-11-24 · support.google.com/gemini 17011627 (Mac app, no computer-use section) and search for a help article: none found

## voice-models

gpt-live-1 · languages · 2026-11-06 · platform.openai.com model page, Live guides, community launch post: no total (voice table covers 7)
gpt-live-1-1 · voices, languages, toolCalling, apiIds · 2026-11-06 · OpenAI community staff post (13 new voices, API "coming soon"); help.openai.com release notes 403
gpt-realtime-2-1 · languages · 2026-11-06 · model page + Realtime guides: no count (same for -2-1-mini, -2, -1-5)
gemini-3-8-live · languages · 2026-11-06 · conflicting: 97 (launch blog), 99 (Live API guide), 70 (Live overview); 97 used (same for -extended-thinking)
gemini-3-8-live · voices · 2026-11-06 · 30 is Google Cloud's Live API voice page, not model-specific (same for -extended-thinking)
gemini-3-1-flash-live · languages · 2026-11-06 · no per-model figure
grok-voice-3-0 · voices · 2026-11-06 · S2S guide points to TTS list: TTS docs 5 voices vs cookbook 28
nova-2-sonic · voices · 2026-11-06 · conflicting: 16 IDs (language table) vs 18 / 22 (service card versions)
nova-2-sonic · pricing.perMinuteUsd · 2026-11-06 · aws.amazon.com/bedrock/pricing and /nova/pricing speech rows did not render (same for nova-2-5-sonic)
phonic-1 · apiIds, voices · 2026-11-06 · phonic.ai blog, homepage, pricing page: no model id or voice count
eleven-realtime-v1-max · voices · 2026-11-06 · blog gives "17,000+" library voices, no built-in count (same for -mini)
stepaudio-3-realtime · releaseDate · 2026-11-06 · StepFun docs: no date; arXiv v1 2026-09-12, 2026-09-15 secondary only
stepaudio-3-realtime · voices · 2026-11-06 · model page: not stated
qwen-audio-3-0-realtime · releaseDate · 2026-11-06 · Alibaba Cloud docs: none; 2026-07-15 from Chinese media only
qwen-audio-3-1-realtime · voices · 2026-11-06 · docs: "union of TTS lists", no count
qwen3-5-omni-realtime · releaseDate · 2026-11-06 · snapshot id 2026-03-15, secondary 2026-03-30; qwen.ai JS-rendered, did not load
qwen3-8-omni-flash-realtime · languages · 2026-11-06 · conflicting: 74 (blog) vs 113 (docs)
deepslate-opal · releaseDate · 2026-11-06 · deepslate.eu + docs: not stated
higgs-realtime · voices · 2026-11-06 · docs: presets plus cloning, no count
raon-speechchat-9b · releaseDate · 2026-11-06 · conflicting: April 2026 (HF citation) vs arXiv 2605.x
nemotronlabs-voicechat-11b · releaseDate · 2026-11-06 · conflicting: 2026-08-03 (HF, used) vs 2026-07-21 (NGC)
nemotronlabs-voicechat-11b · license · 2026-11-06 · conflicting: HF OpenMDW 1.1 (used) vs NGC NIM NVIDIA evaluation licence
lfm3-audio-2b · pricing.perMinuteUsd · 2026-11-06 · API console linked, no price published
mai-realtime-1 · languages, voices · 2026-11-19 · microsoft.ai blog, model page, MAI Labs: not stated; 17 languages / 2 voices only in TestingCatalog leak
mai-realtime-1 · apiIds, links.docs · 2026-11-19 · blog + model page give no model id or docs; no learn.microsoft.com page found
mai-realtime-1 · scores.aaBigBenchAudio · 2026-11-19 · not on AA speech-to-speech; model page tile shows 0% placeholder

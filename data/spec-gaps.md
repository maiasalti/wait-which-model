# Model spec gaps

Cells researched under `protocols/MODEL_SPECS_PROTOCOL.md` and found unverifiable
from primary sources. Re-runs skip everything listed here.

Format: `model-id · field · YYYY-MM-DD · what was searched`

<!-- entries appended by the spec-filler protocol -->

claude-fable-5 · predecessorId · 2026-08-05 · Anthropic's own announcement (anthropic.com/news/claude-fable-5-mythos-5) and models overview page position Fable 5 as a new capability tier ("Mythos-class model we've made safe for general use"), not a stated replacement of a specific earlier model. No lineage claim found.
gpt-5-6-sol · predecessorId · 2026-08-05 · OpenAI's own model docs page (developers.openai.com/api/docs/models/gpt-5.6-sol) states no specific predecessor is identified. The primary announcement (openai.com/index/gpt-5-6/) returned HTTP 403 and could not be fetched directly; secondary sources describe Sol as the flagship successor to GPT-5.5 but no primary-source sentence was verified.
gemini-3-6-flash · predecessorId · 2026-08-05 · Google's own launch post (blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-6-flash-3-5-flash-lite-3-5-flash-cyber/) says 3.6 Flash is "building on Gemini 3.5 Flash" but explicitly frames the models as complementary, not one replacing the other. No supersession claim.
claude-sonnet-5 · predecessorId · 2026-08-05 · Anthropic's own "What's new in Claude Sonnet 5" page (platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5) explicitly states "Claude Sonnet 5 is a drop-in replacement for Claude Sonnet 4.6" — but `claude-sonnet-4-6` is not a tracked id in data/models.json (only claude-sonnet-4-5 is tracked), so predecessorId cannot resolve to a valid id per the integrity check. Left null. Worth flagging to Maia: if claude-sonnet-4-6 is ever added to models.json, this lineage is already sourced and ready to set.
deepseek-v4-flash-0731 · predecessorId · 2026-08-05 · DeepSeek's own HF model card (huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731) states "superseding the preview version" of DeepSeek-V4-Flash, but doesn't name a specific dated preview model id. The closest tracked candidate, `deepseek-v4` (2026-04-24), bundles both V4-Pro and V4-Flash-preview pricing/notes together and doesn't unambiguously correspond to "the preview version" of V4-Flash specifically — left null rather than guess which variant it refers to.

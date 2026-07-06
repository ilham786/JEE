---
name: token-optimization
description: "Optimizes instructions and environment variables to reduce context usage."
risk: safe
source: local
date_added: "2026-06-11"
---

# Token Optimization

Guidelines for minimizing context consumption and maximizing agent execution efficiency.

## Optimization Core Rules
- **Progressive Disclosure**: Load large documentation from reference files via `view_file` rather than stuffing them into main prompts.
- **Slim Scripts**: Write compact scripts and use minimal comments.
- **Reference Folders**: Place auxiliary information in `references/` directory.

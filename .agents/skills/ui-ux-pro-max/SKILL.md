---
name: ui-ux-pro-max
description: Optional searchable UI/UX reference for external visual research or gaps not covered by the current project's rules, including accessibility, responsive layout, charts, color, typography, and interaction. Use only when the user explicitly requests outside UI/UX references or project guidance is insufficient. Do not use for routine article writing, publishing, small edits, or tasks with an established visual direction.
---

# UI/UX Reference Search

Treat this skill as an optional reference tool. Project `AGENTS.md`, routed project docs, the existing stack, components, and visual language always take precedence.

## Boundaries

1. Do not create or replace a project's default design system.
2. Do not run this skill for routine content edits, publishing, small visual fixes, or an already approved design.
3. Detect the actual project stack. For this repository, prefer the bundled `astro` stack reference; never default to HTML/Tailwind.
4. Check for Python only when a search is needed. If Python is unavailable, skip the skill and continue without installing it.
5. Do not persist `design-system/MASTER.md` or page overrides unless the user explicitly asks for persistent design-system files.
6. Use the smallest relevant search. Do not run every domain or generate a comprehensive design system by default.

## Search

Run a focused domain search:

```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> [-n <count>]
```

Useful domains:

| Need | Domain |
| --- | --- |
| Accessibility, focus, semantics, motion | `ux` or `web` |
| Chart choice | `chart` |
| Color direction | `color` |
| Typography options | `typography` |
| External style references | `style` |
| Page structure | `landing` |

For stack-specific guidance:

```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack astro
```

Use `--design-system` only for explicit open-ended design exploration:

```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> <keywords>" --design-system
```

Treat all results as suggestions. Reconcile them with project rules and keep only recommendations that directly help the current task.

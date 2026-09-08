---
name: ui-ux-pro-max
description: Optional searchable UI/UX reference for focused accessibility, responsive layout, chart, color, typography, interaction, or external-reference questions. It may be used directly when the task is clearly one of those specialties. Do not use for routine visual design, article writing, publishing, small edits, or questions already covered by project rules or Taste skills.
---

# UI/UX Reference Search

Treat this skill as an optional specialist reference tool. Project `AGENTS.md`, routed project docs, the existing stack, components, and visual language always take precedence. When the task is explicitly about accessibility, responsive behavior, charts, color, typography, interaction, or external UI/UX references, this skill may be used directly. Routine visual design and redesign should use the project's Taste skills instead.

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

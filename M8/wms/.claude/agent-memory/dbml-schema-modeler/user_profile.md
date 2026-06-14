---
name: user-profile
description: Michał Cesarczyk — frontend/GIS engineer learning TMS/WMS DB modelling; strict YAGNI, int PKs, Polish-spec projects
metadata:
  type: user
---

Michał is a frontend/GIS engineer at TerraEye (React, Deck.gl, geo stack) taking a DJ course on full-stack/backend topics including database modelling.

**Preferences observed:**
- Strict YAGNI: no speculative columns, no audit timestamps unless asked
- Surrogate int PKs (`int [pk, increment]`) for all tables, natural keys as `unique` columns
- snake_case English names even when specs are in Polish
- Enum blocks for all closed value sets
- Explicit `Ref:` lines (not inline refs) for all relationships
- `Note:` on every table
- Cross-module references handled with placeholder stub tables + comment, not by redesigning existing modules
- Mermaid ER compatibility is a stated requirement — avoid DBML-only features that break Mermaid

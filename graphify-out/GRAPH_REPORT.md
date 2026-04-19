# Graph Report - E:\\ClaudeCode\\develop\\Tarobot  (2026-04-19)

## Corpus Check
- Corpus is ~6,611 words - fits in a single context window. You may not need a graph.

## Summary
- 153 nodes · 128 edges · 100 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Structure Signals
- Entity graph basis: 62 non-file, non-concept node(s)
- Weakly connected components: 20
- Singleton components: 13
- Isolated nodes: 13
- Largest component: 25 node(s) (40% of the entity graph basis)
- Low-cohesion communities: 0
- Largest low-cohesion community: none on the entity graph basis

## Workspace Bridges
1. `배포` - connects `Community 96`, `Community 97`, `Db`, `Workers App`; home: `Community 95`; degree 4; score 386
  source files: `E:/ClaudeCode/develop/Tarobot/README.md`
2. `Tarobot — AI 타로 마스터` - connects `Community 93`, `Community 95`, `Worker`; home: `Workers App`; degree 6; score 762.01
  source files: `E:/ClaudeCode/develop/Tarobot/README.md`
3. `자동 배포 — 이원화` - connects `1 Cloudflare Workers Builds 1`, `2 Supabase Edge Functions Git Hub Actions`, `Community 95`; home: `Community 96`; degree 3; score 174
  source files: `E:/ClaudeCode/develop/Tarobot/README.md`
4. `API 키 등록 안내 \(실제 값은 커밋 금지\)` - connects `1 Groq Ai`, `2 Supabase`; home: `Workers App`; degree 2; score 172.33
  source files: `E:/ClaudeCode/develop/Tarobot/API's.example.md`

## God Nodes
1. `apiCall\(\)` - 12 edges
2. `handleStart\(\)` - 7 edges
3. `initiateReadingProcess\(\)` - 7 edges
4. `Tarobot — AI 타로 마스터` - 7 edges
5. `아키텍처` - 6 edges
6. `closeModal\(\)` - 5 edges
7. `레이어별 책임 \(경계를 흐리지 말 것\)` - 4 edges
8. `배포` - 4 edges
9. `API 키 등록 안내 \(실제 값은 커밋 금지\)` - 4 edges
10. `handleLogin\(\)` - 4 edges

## Surprising Connections
- `initiateReadingProcess\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/app.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_
- `saveReadingToSupabase\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/app.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_
- `handleSignup\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/auth.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_
- `handleLogin\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/auth.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_
- `handleResetPassword\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/auth.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_

## Semantic Anomalies
- **[HIGH] Bridge node** - Tarobot — AI 타로 마스터 bridges Workers App and Readme Markdown, Community 95, Worker, Community 93.
  _High betweenness centrality \(726.006\) across 5 communities makes this node a likely dependency chokepoint._
- **[HIGH] Bridge node** - 배포 bridges Community 95 and Workers App, Community 96, Community 97, Db.
  _High betweenness centrality \(342.000\) across 5 communities makes this node a likely dependency chokepoint._
- **[HIGH] Bridge node** - 자동 배포 — 이원화 bridges Community 96 and Community 95, 1 Cloudflare Workers Builds 1, 2 Supabase Edge Functions Git Hub Actions.
  _High betweenness centrality \(141.000\) across 4 communities makes this node a likely dependency chokepoint._
- **[MEDIUM] Cross-boundary edge** - checkAdminStatus\(\) → apiCall\(\) crosses graph boundaries in an unexpected way.
  _cross-file semantic connection_
- **[MEDIUM] Cross-boundary edge** - handleLogin\(\) → apiCall\(\) crosses graph boundaries in an unexpected way.
  _cross-file semantic connection_

## Communities

### Community 0 - "Workers App"
Cohesion (entity basis within full-graph community): 0.04
Nodes (45): apiCall\(\), API 키 등록 안내 \(실제 값은 커밋 금지\), animateCardSelection\(\), appendInterpretation\(\), displayFinalCards\(\), getElements\(\), handleEnterKey\(\), handleSelectCard\(\) (+37 more)

### Community 1 - "1 Groq Ai"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 1. Groq \(AI\)

### Community 2 - "2 Supabase"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 2. Supabase

### Community 3 - "Handle Logout"
Cohesion (entity basis within full-graph community): 1
Nodes (1): handleLogout\(\)

### Community 4 - "Open Modal"
Cohesion (entity basis within full-graph community): 1
Nodes (1): openModal\(\)

### Community 5 - "Bgimg Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 6 - "B Gmobile Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 7 - "Claude Markdown"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 8 - "Community 8"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 자동 배포 경로

### Community 9 - "Community 9"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 개발/배포 커맨드

### Community 10 - "Community 10"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 아키텍처 한눈에

### Community 11 - "Graphify TypeScript"
Cohesion (entity basis within full-graph community): 1
Nodes (1): graphify-ts

### Community 12 - "Is Admin"
Cohesion (entity basis within full-graph community): 1
Nodes (1): isAdmin\(\)

### Community 13 - "Major Arcana Chariot Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 14 - "Major Arcana Death Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 15 - "Major Arcana Devil Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 16 - "Major Arcana Emperor Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 17 - "Major Arcana Empress Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 18 - "Major Arcana Fool Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 19 - "Major Arcana Fortune Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 20 - "Major Arcana Hanged Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 21 - "Major Arcana Hermit Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 22 - "Major Arcana Hierophant Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 23 - "Major Arcana Judgement Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 24 - "Major Arcana Justice Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 25 - "Major Arcana Lovers Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 26 - "Major Arcana Magician Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 27 - "Major Arcana Moon Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 28 - "Major Arcana Priestess Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 29 - "Major Arcana Star Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 30 - "Major Arcana Strength Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 31 - "Major Arcana Sun Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 32 - "Major Arcana Temperance Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 33 - "Major Arcana Tower Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 34 - "Major Arcana World Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 35 - "Minor Arcana Cups 10 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 36 - "Minor Arcana Cups 2 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 37 - "Minor Arcana Cups 3 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 38 - "Minor Arcana Cups 4 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 39 - "Minor Arcana Cups 5 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 40 - "Minor Arcana Cups 6 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 41 - "Minor Arcana Cups 7 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 42 - "Minor Arcana Cups 8 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 43 - "Minor Arcana Cups 9 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 44 - "Minor Arcana Cups Ace Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 45 - "Minor Arcana Cups King Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 46 - "Minor Arcana Cups Knight Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 47 - "Minor Arcana Cups Page Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 48 - "Minor Arcana Cups Queen Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 49 - "Minor Arcana Pentacles 10 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 50 - "Minor Arcana Pentacles 2 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 51 - "Minor Arcana Pentacles 3 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 52 - "Minor Arcana Pentacles 4 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 53 - "Minor Arcana Pentacles 5 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 54 - "Minor Arcana Pentacles 6 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 55 - "Minor Arcana Pentacles 7 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 56 - "Minor Arcana Pentacles 8 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 57 - "Minor Arcana Pentacles 9 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 58 - "Minor Arcana Pentacles Ace Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 59 - "Minor Arcana Pentacles King Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 60 - "Minor Arcana Pentacles Knight Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 61 - "Minor Arcana Pentacles Page Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 62 - "Minor Arcana Pentacles Queen Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 63 - "Minor Arcana Swords 10 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 64 - "Minor Arcana Swords 2 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 65 - "Minor Arcana Swords 3 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 66 - "Minor Arcana Swords 4 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 67 - "Minor Arcana Swords 5 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 68 - "Minor Arcana Swords 6 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 69 - "Minor Arcana Swords 7 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 70 - "Minor Arcana Swords 8 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 71 - "Minor Arcana Swords 9 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 72 - "Minor Arcana Swords Ace Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 73 - "Minor Arcana Swords King Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 74 - "Minor Arcana Swords Knight Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 75 - "Minor Arcana Swords Page Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 76 - "Minor Arcana Swords Queen Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 77 - "Minor Arcana Wands 10 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 78 - "Minor Arcana Wands 2 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 79 - "Minor Arcana Wands 3 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 80 - "Minor Arcana Wands 4 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 81 - "Minor Arcana Wands 5 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 82 - "Minor Arcana Wands 6 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 83 - "Minor Arcana Wands 7 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 84 - "Minor Arcana Wands 8 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 85 - "Minor Arcana Wands 9 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 86 - "Minor Arcana Wands Ace Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 87 - "Minor Arcana Wands King Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 88 - "Minor Arcana Wands Knight Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 89 - "Minor Arcana Wands Page Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 90 - "Minor Arcana Wands Queen Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 91 - "Readme Markdown"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 92 - "1 Cloudflare Workers Builds 1"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 1\) Cloudflare Workers Builds 설정 \(최초 1회\)

### Community 93 - "Community 93"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 보안 메모

### Community 94 - "2 Supabase Edge Functions Git Hub Actions"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 2\) Supabase Edge Functions — GitHub Actions

### Community 95 - "Community 95"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 배포

### Community 96 - "Community 96"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 자동 배포 — 이원화

### Community 97 - "Community 97"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 수동 배포 \(로컬\)

### Community 98 - "Db"
Cohesion (entity basis within full-graph community): 1
Nodes (1): DB 스키마 & 관리자

### Community 99 - "Worker"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 주요 엔드포인트 \(Worker\)

## Knowledge Gaps
- **39 weakly connected node(s):** `getElements\(\)`, `handleSelectCard\(\)`, `morphCardsToGrid\(\)`, `renderWheel\(\)`, `initSelectionArea\(\)` (+34 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `1 Groq Ai`** (1 nodes): `1. Groq \(AI\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `2 Supabase`** (1 nodes): `2. Supabase`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Handle Logout`** (1 nodes): `handleLogout\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Open Modal`** (1 nodes): `openModal\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bgimg Png`** (1 nodes): `BGIMG.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `B Gmobile Png`** (1 nodes): `BGmobile.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Claude Markdown`** (1 nodes): `CLAUDE.md`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (1 nodes): `자동 배포 경로`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (1 nodes): `개발/배포 커맨드`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `아키텍처 한눈에`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Graphify TypeScript`** (1 nodes): `graphify-ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Is Admin`** (1 nodes): `isAdmin\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Chariot Jpg`** (1 nodes): `major\_arcana\_chariot.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Death Jpg`** (1 nodes): `major\_arcana\_death.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Devil Jpg`** (1 nodes): `major\_arcana\_devil.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Emperor Jpg`** (1 nodes): `major\_arcana\_emperor.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Empress Jpg`** (1 nodes): `major\_arcana\_empress.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Fool Jpg`** (1 nodes): `major\_arcana\_fool.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Fortune Jpg`** (1 nodes): `major\_arcana\_fortune.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Hanged Jpg`** (1 nodes): `major\_arcana\_hanged.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Hermit Jpg`** (1 nodes): `major\_arcana\_hermit.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Hierophant Jpg`** (1 nodes): `major\_arcana\_hierophant.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Judgement Jpg`** (1 nodes): `major\_arcana\_judgement.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Justice Jpg`** (1 nodes): `major\_arcana\_justice.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Lovers Jpg`** (1 nodes): `major\_arcana\_lovers.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Magician Jpg`** (1 nodes): `major\_arcana\_magician.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Moon Jpg`** (1 nodes): `major\_arcana\_moon.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Priestess Jpg`** (1 nodes): `major\_arcana\_priestess.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Star Jpg`** (1 nodes): `major\_arcana\_star.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Strength Jpg`** (1 nodes): `major\_arcana\_strength.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Sun Jpg`** (1 nodes): `major\_arcana\_sun.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Temperance Jpg`** (1 nodes): `major\_arcana\_temperance.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana Tower Jpg`** (1 nodes): `major\_arcana\_tower.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Major Arcana World Jpg`** (1 nodes): `major\_arcana\_world.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups 10 Jpg`** (1 nodes): `minor\_arcana\_cups\_10.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups 2 Jpg`** (1 nodes): `minor\_arcana\_cups\_2.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups 3 Jpg`** (1 nodes): `minor\_arcana\_cups\_3.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups 4 Jpg`** (1 nodes): `minor\_arcana\_cups\_4.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups 5 Jpg`** (1 nodes): `minor\_arcana\_cups\_5.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups 6 Jpg`** (1 nodes): `minor\_arcana\_cups\_6.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups 7 Jpg`** (1 nodes): `minor\_arcana\_cups\_7.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups 8 Jpg`** (1 nodes): `minor\_arcana\_cups\_8.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups 9 Jpg`** (1 nodes): `minor\_arcana\_cups\_9.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups Ace Jpg`** (1 nodes): `minor\_arcana\_cups\_ace.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups King Jpg`** (1 nodes): `minor\_arcana\_cups\_king.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups Knight Jpg`** (1 nodes): `minor\_arcana\_cups\_knight.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups Page Jpg`** (1 nodes): `minor\_arcana\_cups\_page.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Cups Queen Jpg`** (1 nodes): `minor\_arcana\_cups\_queen.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles 10 Jpg`** (1 nodes): `minor\_arcana\_pentacles\_10.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles 2 Jpg`** (1 nodes): `minor\_arcana\_pentacles\_2.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles 3 Jpg`** (1 nodes): `minor\_arcana\_pentacles\_3.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles 4 Jpg`** (1 nodes): `minor\_arcana\_pentacles\_4.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles 5 Jpg`** (1 nodes): `minor\_arcana\_pentacles\_5.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles 6 Jpg`** (1 nodes): `minor\_arcana\_pentacles\_6.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles 7 Jpg`** (1 nodes): `minor\_arcana\_pentacles\_7.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles 8 Jpg`** (1 nodes): `minor\_arcana\_pentacles\_8.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles 9 Jpg`** (1 nodes): `minor\_arcana\_pentacles\_9.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles Ace Jpg`** (1 nodes): `minor\_arcana\_pentacles\_ace.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles King Jpg`** (1 nodes): `minor\_arcana\_pentacles\_king.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles Knight Jpg`** (1 nodes): `minor\_arcana\_pentacles\_knight.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles Page Jpg`** (1 nodes): `minor\_arcana\_pentacles\_page.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Pentacles Queen Jpg`** (1 nodes): `minor\_arcana\_pentacles\_queen.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords 10 Jpg`** (1 nodes): `minor\_arcana\_swords\_10.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords 2 Jpg`** (1 nodes): `minor\_arcana\_swords\_2.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords 3 Jpg`** (1 nodes): `minor\_arcana\_swords\_3.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords 4 Jpg`** (1 nodes): `minor\_arcana\_swords\_4.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords 5 Jpg`** (1 nodes): `minor\_arcana\_swords\_5.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords 6 Jpg`** (1 nodes): `minor\_arcana\_swords\_6.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords 7 Jpg`** (1 nodes): `minor\_arcana\_swords\_7.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords 8 Jpg`** (1 nodes): `minor\_arcana\_swords\_8.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords 9 Jpg`** (1 nodes): `minor\_arcana\_swords\_9.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords Ace Jpg`** (1 nodes): `minor\_arcana\_swords\_ace.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords King Jpg`** (1 nodes): `minor\_arcana\_swords\_king.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords Knight Jpg`** (1 nodes): `minor\_arcana\_swords\_knight.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords Page Jpg`** (1 nodes): `minor\_arcana\_swords\_page.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Swords Queen Jpg`** (1 nodes): `minor\_arcana\_swords\_queen.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands 10 Jpg`** (1 nodes): `minor\_arcana\_wands\_10.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands 2 Jpg`** (1 nodes): `minor\_arcana\_wands\_2.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands 3 Jpg`** (1 nodes): `minor\_arcana\_wands\_3.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands 4 Jpg`** (1 nodes): `minor\_arcana\_wands\_4.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands 5 Jpg`** (1 nodes): `minor\_arcana\_wands\_5.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands 6 Jpg`** (1 nodes): `minor\_arcana\_wands\_6.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands 7 Jpg`** (1 nodes): `minor\_arcana\_wands\_7.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands 8 Jpg`** (1 nodes): `minor\_arcana\_wands\_8.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands 9 Jpg`** (1 nodes): `minor\_arcana\_wands\_9.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands Ace Jpg`** (1 nodes): `minor\_arcana\_wands\_ace.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands King Jpg`** (1 nodes): `minor\_arcana\_wands\_king.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands Knight Jpg`** (1 nodes): `minor\_arcana\_wands\_knight.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands Page Jpg`** (1 nodes): `minor\_arcana\_wands\_page.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Minor Arcana Wands Queen Jpg`** (1 nodes): `minor\_arcana\_wands\_queen.jpg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Readme Markdown`** (1 nodes): `README.md`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1 Cloudflare Workers Builds 1`** (1 nodes): `1\) Cloudflare Workers Builds 설정 \(최초 1회\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (1 nodes): `보안 메모`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `2 Supabase Edge Functions Git Hub Actions`** (1 nodes): `2\) Supabase Edge Functions — GitHub Actions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (1 nodes): `배포`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `자동 배포 — 이원화`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (1 nodes): `수동 배포 \(로컬\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Db`** (1 nodes): `DB 스키마 & 관리자`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Worker`** (1 nodes): `주요 엔드포인트 \(Worker\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does \`Tarobot — AI 타로 마스터\` connect \`Workers App\` to \`Readme Markdown\`, \`Community 95\`, \`Worker\`, \`Community 93\`?**
  _High betweenness centrality \(726.006\) - this node is a cross-community bridge._
- **What connects \`getElements\(\)\`, \`handleSelectCard\(\)\`, \`morphCardsToGrid\(\)\` to the rest of the system?**
  _39 weakly-connected nodes found - possible documentation gaps or missing edges._

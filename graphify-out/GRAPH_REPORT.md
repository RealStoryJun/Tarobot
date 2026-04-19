# Graph Report - E:\\ClaudeCode\\develop\\Tarobot  (2026-04-19)

## Corpus Check
- Corpus is ~8,973 words - fits in a single context window. You may not need a graph.

## Summary
- 188 nodes · 164 edges · 129 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Structure Signals
- Entity graph basis: 96 non-file, non-concept node(s)
- Weakly connected components: 21
- Singleton components: 13
- Isolated nodes: 13
- Largest component: 34 node(s) (35% of the entity graph basis)
- Low-cohesion communities: 0
- Largest low-cohesion community: none on the entity graph basis

## Workspace Bridges
1. `Tarobot 디자인 리파인 플랜` - connects `0`, `2`, `4`, `5`, `7`, `8`; home: `Workers App`; degree 9; score 2339.5
  source files: `E:/ClaudeCode/develop/Tarobot/DESIGN\_PLAN.md`
2. `3. 페이즈별 작업 단위` - connects `Phase 1 1`, `Phase 2 1`, `Phase 4 1`, `Phase 5 1`, `Phase 6 0 5`; home: `Workers App`; degree 7; score 1440.5
  source files: `E:/ClaudeCode/develop/Tarobot/DESIGN\_PLAN.md`
3. `✧ Phase 5 — 디테일 폴리싱 \(1일, 위험도 낮음\)` - connects `5 1`, `5 2`, `5 3`, `5 4`, `Workers App`; home: `Phase 5 1`; degree 5; score 481
  source files: `E:/ClaudeCode/develop/Tarobot/DESIGN\_PLAN.md`
4. `🌕 Phase 4 — 컴포넌트 톤앤매너 정렬 \(1일, 위험도 낮음\)` - connects `4 1 3 Variant`, `4 2 Glassmorphism`, `4 3`, `4 4`, `Workers App`; home: `Phase 4 1`; degree 5; score 481
  source files: `E:/ClaudeCode/develop/Tarobot/DESIGN\_PLAN.md`
5. `배포` - connects `Community 125`, `Community 126`, `Db`, `Workers App`; home: `Community 124`; degree 4; score 571
  source files: `E:/ClaudeCode/develop/Tarobot/README.md`
6. `🌓 Phase 3 — 애니메이션 연속성 \(2-3일, 위험도 중간\)` - connects `3 1`, `3 3 Handle Start`, `3 4 Reveal Cards`, `3 5 View Transitions API`; home: `Workers App`; degree 6; score 486
  source files: `E:/ClaudeCode/develop/Tarobot/DESIGN\_PLAN.md`

## God Nodes
1. `apiCall\(\)` - 12 edges
2. `Tarobot 디자인 리파인 플랜` - 11 edges
3. `3. 페이즈별 작업 단위` - 7 edges
4. `handleStart\(\)` - 7 edges
5. `initiateReadingProcess\(\)` - 7 edges
6. `Tarobot — AI 타로 마스터` - 7 edges
7. `🌓 Phase 3 — 애니메이션 연속성 \(2-3일, 위험도 중간\)` - 6 edges
8. `1. 현재 진단 \(증거 기반\)` - 6 edges
9. `✧ Phase 5 — 디테일 폴리싱 \(1일, 위험도 낮음\)` - 5 edges
10. `🌕 Phase 4 — 컴포넌트 톤앤매너 정렬 \(1일, 위험도 낮음\)` - 5 edges

## Surprising Connections
- `handleSignup\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/auth.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_
- `handleLogin\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/auth.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_
- `handleResetPassword\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/auth.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_
- `handlePasswordChange\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/auth.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_
- `checkAdminStatus\(\)` --calls--> `apiCall\(\)`  [EXTRACTED]
  E:/ClaudeCode/develop/Tarobot/auth.js → E:/ClaudeCode/develop/Tarobot/api.js  _cross-file semantic connection_

## Semantic Anomalies
- **[HIGH] Bridge node** - Tarobot 디자인 리파인 플랜 bridges Workers App and Design Plan Markdown, 0, 2, 4, 5, 7, 8.
  _High betweenness centrality \(2270.500\) across 8 communities makes this node a likely dependency chokepoint._
- **[HIGH] Bridge node** - 3. 페이즈별 작업 단위 bridges Workers App and Phase 1 1, Phase 2 1, Phase 4 1, Phase 5 1, Phase 6 0 5.
  _High betweenness centrality \(1383.500\) across 6 communities makes this node a likely dependency chokepoint._
- **[HIGH] Bridge node** - Tarobot — AI 타로 마스터 bridges Workers App and Readme Markdown, Community 124, Worker, Community 122.
  _High betweenness centrality \(1295.090\) across 5 communities makes this node a likely dependency chokepoint._
- **[MEDIUM] Cross-boundary edge** - checkAdminStatus\(\) → apiCall\(\) crosses graph boundaries in an unexpected way.
  _cross-file semantic connection_
- **[MEDIUM] Cross-boundary edge** - handleLogin\(\) → apiCall\(\) crosses graph boundaries in an unexpected way.
  _cross-file semantic connection_

## Communities

### Community 0 - "Workers App"
Cohesion (entity basis within full-graph community): 0.04
Nodes (51): apiCall\(\), API 키 등록 안내 \(실제 값은 커밋 금지\), animateCardSelection\(\), appendInterpretation\(\), displayFinalCards\(\), getElements\(\), handleEnterKey\(\), handleSelectCard\(\) (+43 more)

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

### Community 11 - "App Js"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 프론트 상태머신 \(app.js\)

### Community 12 - "Graphify TypeScript"
Cohesion (entity basis within full-graph community): 1
Nodes (1): graphify-ts

### Community 13 - "Design Plan Markdown"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 14 - "0"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 0. 목표

### Community 15 - "1 1 10"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 1.1 타이포 스케일 — 10+ 개 사이즈가 서로 무관하게 존재

### Community 16 - "1 2 6"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 1.2 색상 — 톤 이탈 6곳 확인

### Community 17 - "1 3 5"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 1.3 애니메이션 이징·듀레이션 — 5종 이상 혼용

### Community 18 - "1 5"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 1.5 컴포넌트 스타일 믹스

### Community 19 - "2"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 2. 원칙 \(결정 기준\)

### Community 20 - "3 1"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 3.1 공통 모티프 도입

### Community 21 - "3 3 Handle Start"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 3.3 핵심 시퀀스 리디자인 — handleStart

### Community 22 - "3 4 Reveal Cards"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 3.4 카드 공개\(revealCards\) 개선

### Community 23 - "3 5 View Transitions API"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 3.5 \(선택\) View Transitions API 점진 도입

### Community 24 - "4 1 3 Variant"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 4.1 버튼 통일 \(3 variant 만 존재\)

### Community 25 - "4 2 Glassmorphism"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 4.2 모달 Glassmorphism 통일

### Community 26 - "4 3"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 4.3 해석 카드 & 상태 배지 통일

### Community 27 - "4"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 4. 우선순위 & 일정 제안

### Community 28 - "4 4"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 4.4 로그아웃 버튼 톤 조정

### Community 29 - "5 1"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 5.1 앰비언트 모션

### Community 30 - "5 2"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 5.2 마이크로 인터랙션

### Community 31 - "5 3"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 5.3 로더 교체

### Community 32 - "5"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 5. 성공 지표 \(주관·객관 병행\)

### Community 33 - "5 4"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 5.4 에러/로딩 상태 언어 통일

### Community 34 - "7"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 7. 참고 자료 \(조사에서 차용한 개념\)

### Community 35 - "8"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 8. 다음 액션

### Community 36 - "Phase 1 1"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 🌑 Phase 1 — 디자인 토큰 정리 \(1일, 위험도 낮음\)

### Community 37 - "Phase 2 1"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 🌒 Phase 2 — 타이포그래피 재구성 \(1일, 위험도 낮음\)

### Community 38 - "Phase 4 1"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 🌕 Phase 4 — 컴포넌트 톤앤매너 정렬 \(1일, 위험도 낮음\)

### Community 39 - "Phase 5 1"
Cohesion (entity basis within full-graph community): 1
Nodes (1): ✧ Phase 5 — 디테일 폴리싱 \(1일, 위험도 낮음\)

### Community 40 - "Phase 6 0 5"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 🔭 Phase 6 — 접근성·성능 하드닝 \(0.5일, 위험도 낮음\)

### Community 41 - "Is Admin"
Cohesion (entity basis within full-graph community): 1
Nodes (1): isAdmin\(\)

### Community 42 - "Major Arcana Chariot Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 43 - "Major Arcana Death Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 44 - "Major Arcana Devil Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 45 - "Major Arcana Emperor Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 46 - "Major Arcana Empress Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 47 - "Major Arcana Fool Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 48 - "Major Arcana Fortune Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 49 - "Major Arcana Hanged Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 50 - "Major Arcana Hermit Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 51 - "Major Arcana Hierophant Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 52 - "Major Arcana Judgement Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 53 - "Major Arcana Justice Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 54 - "Major Arcana Lovers Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 55 - "Major Arcana Magician Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 56 - "Major Arcana Moon Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 57 - "Major Arcana Priestess Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 58 - "Major Arcana Star Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 59 - "Major Arcana Strength Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 60 - "Major Arcana Sun Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 61 - "Major Arcana Temperance Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 62 - "Major Arcana Tower Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 63 - "Major Arcana World Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 64 - "Minor Arcana Cups 10 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 65 - "Minor Arcana Cups 2 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 66 - "Minor Arcana Cups 3 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 67 - "Minor Arcana Cups 4 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 68 - "Minor Arcana Cups 5 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 69 - "Minor Arcana Cups 6 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 70 - "Minor Arcana Cups 7 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 71 - "Minor Arcana Cups 8 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 72 - "Minor Arcana Cups 9 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 73 - "Minor Arcana Cups Ace Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 74 - "Minor Arcana Cups King Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 75 - "Minor Arcana Cups Knight Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 76 - "Minor Arcana Cups Page Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 77 - "Minor Arcana Cups Queen Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 78 - "Minor Arcana Pentacles 10 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 79 - "Minor Arcana Pentacles 2 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 80 - "Minor Arcana Pentacles 3 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 81 - "Minor Arcana Pentacles 4 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 82 - "Minor Arcana Pentacles 5 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 83 - "Minor Arcana Pentacles 6 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 84 - "Minor Arcana Pentacles 7 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 85 - "Minor Arcana Pentacles 8 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 86 - "Minor Arcana Pentacles 9 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 87 - "Minor Arcana Pentacles Ace Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 88 - "Minor Arcana Pentacles King Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 89 - "Minor Arcana Pentacles Knight Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 90 - "Minor Arcana Pentacles Page Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 91 - "Minor Arcana Pentacles Queen Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 92 - "Minor Arcana Swords 10 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 93 - "Minor Arcana Swords 2 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 94 - "Minor Arcana Swords 3 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 95 - "Minor Arcana Swords 4 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 96 - "Minor Arcana Swords 5 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 97 - "Minor Arcana Swords 6 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 98 - "Minor Arcana Swords 7 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 99 - "Minor Arcana Swords 8 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 100 - "Minor Arcana Swords 9 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 101 - "Minor Arcana Swords Ace Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 102 - "Minor Arcana Swords King Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 103 - "Minor Arcana Swords Knight Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 104 - "Minor Arcana Swords Page Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 105 - "Minor Arcana Swords Queen Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 106 - "Minor Arcana Wands 10 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 107 - "Minor Arcana Wands 2 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 108 - "Minor Arcana Wands 3 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 109 - "Minor Arcana Wands 4 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 110 - "Minor Arcana Wands 5 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 111 - "Minor Arcana Wands 6 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 112 - "Minor Arcana Wands 7 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 113 - "Minor Arcana Wands 8 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 114 - "Minor Arcana Wands 9 Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 115 - "Minor Arcana Wands Ace Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 116 - "Minor Arcana Wands King Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 117 - "Minor Arcana Wands Knight Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 118 - "Minor Arcana Wands Page Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 119 - "Minor Arcana Wands Queen Jpg"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 120 - "Readme Markdown"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 121 - "1 Cloudflare Workers Builds 1"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 1\) Cloudflare Workers Builds 설정 \(최초 1회\)

### Community 122 - "Community 122"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 보안 메모

### Community 123 - "2 Supabase Edge Functions Git Hub Actions"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 2\) Supabase Edge Functions — GitHub Actions

### Community 124 - "Community 124"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 배포

### Community 125 - "Community 125"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 자동 배포 — 이원화

### Community 126 - "Community 126"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 수동 배포 \(로컬\)

### Community 127 - "Db"
Cohesion (entity basis within full-graph community): 1
Nodes (1): DB 스키마 & 관리자

### Community 128 - "Worker"
Cohesion (entity basis within full-graph community): 1
Nodes (1): 주요 엔드포인트 \(Worker\)

## Knowledge Gaps
- **67 weakly connected node(s):** `openModal\(\)`, `handleLogout\(\)`, `escapeHtml\(\)`, `isOriginAllowed\(\)`, `buildCors\(\)` (+62 more)
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
- **Thin community `App Js`** (1 nodes): `프론트 상태머신 \(app.js\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Graphify TypeScript`** (1 nodes): `graphify-ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Design Plan Markdown`** (1 nodes): `DESIGN\_PLAN.md`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `0`** (1 nodes): `0. 목표`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1 1 10`** (1 nodes): `1.1 타이포 스케일 — 10+ 개 사이즈가 서로 무관하게 존재`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1 2 6`** (1 nodes): `1.2 색상 — 톤 이탈 6곳 확인`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1 3 5`** (1 nodes): `1.3 애니메이션 이징·듀레이션 — 5종 이상 혼용`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1 5`** (1 nodes): `1.5 컴포넌트 스타일 믹스`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `2`** (1 nodes): `2. 원칙 \(결정 기준\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `3 1`** (1 nodes): `3.1 공통 모티프 도입`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `3 3 Handle Start`** (1 nodes): `3.3 핵심 시퀀스 리디자인 — handleStart`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `3 4 Reveal Cards`** (1 nodes): `3.4 카드 공개\(revealCards\) 개선`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `3 5 View Transitions API`** (1 nodes): `3.5 \(선택\) View Transitions API 점진 도입`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `4 1 3 Variant`** (1 nodes): `4.1 버튼 통일 \(3 variant 만 존재\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `4 2 Glassmorphism`** (1 nodes): `4.2 모달 Glassmorphism 통일`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `4 3`** (1 nodes): `4.3 해석 카드 & 상태 배지 통일`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `4`** (1 nodes): `4. 우선순위 & 일정 제안`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `4 4`** (1 nodes): `4.4 로그아웃 버튼 톤 조정`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `5 1`** (1 nodes): `5.1 앰비언트 모션`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `5 2`** (1 nodes): `5.2 마이크로 인터랙션`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `5 3`** (1 nodes): `5.3 로더 교체`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `5`** (1 nodes): `5. 성공 지표 \(주관·객관 병행\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `5 4`** (1 nodes): `5.4 에러/로딩 상태 언어 통일`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `7`** (1 nodes): `7. 참고 자료 \(조사에서 차용한 개념\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `8`** (1 nodes): `8. 다음 액션`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Phase 1 1`** (1 nodes): `🌑 Phase 1 — 디자인 토큰 정리 \(1일, 위험도 낮음\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Phase 2 1`** (1 nodes): `🌒 Phase 2 — 타이포그래피 재구성 \(1일, 위험도 낮음\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Phase 4 1`** (1 nodes): `🌕 Phase 4 — 컴포넌트 톤앤매너 정렬 \(1일, 위험도 낮음\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Phase 5 1`** (1 nodes): `✧ Phase 5 — 디테일 폴리싱 \(1일, 위험도 낮음\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Phase 6 0 5`** (1 nodes): `🔭 Phase 6 — 접근성·성능 하드닝 \(0.5일, 위험도 낮음\)`
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
- **Thin community `Community 122`** (1 nodes): `보안 메모`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `2 Supabase Edge Functions Git Hub Actions`** (1 nodes): `2\) Supabase Edge Functions — GitHub Actions`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 124`** (1 nodes): `배포`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (1 nodes): `자동 배포 — 이원화`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 126`** (1 nodes): `수동 배포 \(로컬\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Db`** (1 nodes): `DB 스키마 & 관리자`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Worker`** (1 nodes): `주요 엔드포인트 \(Worker\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does \`Tarobot 디자인 리파인 플랜\` connect \`Workers App\` to \`Design Plan Markdown\`, \`0\`, \`2\`, \`4\`, \`5\`, \`7\`, \`8\`?**
  _High betweenness centrality \(2270.500\) - this node is a cross-community bridge._
- **Why does \`3. 페이즈별 작업 단위\` connect \`Workers App\` to \`Phase 1 1\`, \`Phase 2 1\`, \`Phase 4 1\`, \`Phase 5 1\`, \`Phase 6 0 5\`?**
  _High betweenness centrality \(1383.500\) - this node is a cross-community bridge._
- **Why does \`Tarobot — AI 타로 마스터\` connect \`Workers App\` to \`Readme Markdown\`, \`Community 124\`, \`Worker\`, \`Community 122\`?**
  _High betweenness centrality \(1295.090\) - this node is a cross-community bridge._
- **What connects \`openModal\(\)\`, \`handleLogout\(\)\`, \`escapeHtml\(\)\` to the rest of the system?**
  _67 weakly-connected nodes found - possible documentation gaps or missing edges._

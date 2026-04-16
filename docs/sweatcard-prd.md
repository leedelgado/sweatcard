# SweatCard — Product Requirements Document

**Version:** 2.0  
**Author:** Lee (product), Claude (documentation)  
**Date:** April 2026  
**Status:** MVP — ready to build

---

## 1. The problem

People who work out with an Apple Watch take screenshots of their workout summary and post them on social media. The problem is there is no way to be in the photo AND show your workout data at the same time. The current workaround — screenshot the watch, open Instagram, take a selfie, manually layer the screenshot on top — is too many steps and looks clunky.

There is no app that solves this in one flow.

---

## 2. The solution

SweatCard is a mobile web app (React PWA) that:

1. Pulls the user's latest workout data (mock HealthKit data for MVP, real HealthKit in v2)
2. Generates a styled workout summary card — the "SweatCard" — using HTML Canvas
3. Exports the card as a PNG saved directly to the user's camera roll
4. The user opens Instagram (or TikTok, Twitter, etc.), takes their selfie, and places the SweatCard PNG on top like a sticker

One flow. No awkward steps. You're in the photo AND your achievement is too.

---

## 3. Who the user is

**Primary user:** Gym-goers aged 22–40 who train 3–5x per week, use an Apple Watch or fitness tracker, and regularly post workout content to Instagram, TikTok, or Twitter/X.

**They are not:** Beginners. Elite athletes. People who don't care about social sharing.

**What they want:** To show off their workout in a way that looks good on their grid — not like a raw screenshot pasted on top of a photo.

---

## 4. MVP scope (5-day build)

### What the MVP does

- Displays a pre-loaded mock workout object (mirrors real HealthKit schema exactly)
- Renders the workout data into the SweatCard sticker template (Smoke colorway — see Section 7)
- Lets the user pick from 2–3 sticker style variations
- Exports the sticker as a PNG to the device camera roll
- Stores basic user profile and workout history in localStorage
- Works on iPhone Safari (primary target) and desktop Chrome

### What the MVP does NOT do

- No real Apple Watch / HealthKit integration (Phase 2)
- No camera / selfie capture inside the app
- No social sharing API integration
- No backend / database (localStorage only)
- No user authentication

---

## 5. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React (Vite) | Fast setup, component-based, PWA-ready |
| Styling | CSS Modules | Scoped styles, no external UI library |
| Sticker rendering | HTML Canvas API | Generates real PNG output |
| PNG export | canvas.toBlob() + Web Share API | Saves to camera roll on iOS Safari |
| Data storage | localStorage | No backend needed for MVP |
| Mock data | Static JSON file | Mirrors HealthKit schema exactly |
| Hosting | Vercel | Free, instant deploy, HTTPS for PWA |

---

## 6. Data schema

### Workout object (mirrors Apple HealthKit)

```json
{
  "id": "workout_001",
  "userId": "user_abc123",
  "workoutType": "Open lifting",
  "startDate": "2026-04-12T10:15:00Z",
  "endDate": "2026-04-12T11:02:00Z",
  "durationMinutes": 47,
  "activeCalories": 382,
  "totalCalories": 410,
  "avgHeartRate": 141,
  "maxHeartRate": 168,
  "totalDistanceMiles": 0,
  "totalVolumeLbs": 8700,
  "streakDays": 12,
  "isPersonalRecord": true,
  "source": "Apple Watch Series 9"
}
```

### User profile object

```json
{
  "userId": "user_abc123",
  "displayName": "Lee",
  "instagramHandle": "@leenyc",
  "tiktokHandle": "@leenyc",
  "joinedDate": "2026-04-12T00:00:00Z",
  "totalWorkouts": 47,
  "workoutHistory": []
}
```

### Stat display rules

- Show only stats with non-zero values
- If `totalDistanceMiles > 0`: show distance instead of `totalVolumeLbs`
- `totalVolumeLbs` formatted as `8.7k` when >= 1000
- Duration always shown
- Calories always shown
- Heart rate shown when available
- PR badge only shows when `isPersonalRecord: true`

### Schema note

When real HealthKit is integrated in Phase 2, only the data source changes. The schema stays identical — the upgrade is one swap, not a rebuild.

---

## 7. Design spec — Smoke colorway

### Sticker card dimensions

- Width: 390px (renders at 2x for retina: 780px canvas)
- Height: ~480px
- Border radius: 18px
- Export format: PNG

### Color tokens

| Token | Hex | Usage |
|---|---|---|
| Background | `#181818` | Card background |
| Border | `#282828` | Card border 1px |
| Grid divider | `#242424` | Between stat cells |
| Accent | `#1D9E75` | Rule line + PR badge + dot |
| PR badge text | `#ffffff` | Badge label |
| Primary text | `#f0f0f0` | Workout title, stat values |
| Stat labels | `#7a7a7a` | Accessible — 4.6:1 contrast |
| App name | `#6b6b6b` | Accessible — 4.1:1 contrast |
| Streak text | `#6b6b6b` | Accessible — 4.1:1 contrast |
| Streak value | `#c8c8c8` | Bold number in streak |
| Accent dot | `#1D9E75` | Bottom right decoration |

### Typography

| Element | Size | Weight | Color |
|---|---|---|---|
| App name | 9px | 400 | `#6b6b6b` |
| Workout type | 16px | 500 | `#f0f0f0` |
| Stat value | 22px | 500 | `#f0f0f0` |
| Stat label | 9px | 400 | `#7a7a7a` |
| Streak text | 11px | 400 | `#6b6b6b` |
| Streak number | 11px | 500 | `#c8c8c8` |

### Layout structure

```
┌─────────────────────────────┐
│ SweatCard           New PR  │  ← app name + PR badge (teal)
│ Open lifting                │  ← workout type
│ ────────────────────────── │  ← teal accent line (1.5px)
│ 47          │  382          │  ← stat grid (2 x 2)
│ Minutes     │  Calories     │
│─────────────────────────────│
│ 141         │  8.7k         │
│ Avg BPM     │  Lbs moved    │
│─────────────────────────────│
│ 12 day streak           •   │  ← footer + teal dot
└─────────────────────────────┘
```

---

## 8. App screens

### Screen 1 — Home / workout summary
- Shows latest workout from mock JSON
- Live preview of the SweatCard sticker
- "Change style" cycles colorways (Smoke is default)
- "Save sticker" is the primary CTA

### Screen 2 — Export
- Canvas renders and exports PNG on tap
- Web Share API on iOS Safari saves to camera roll
- Success state + "Open Instagram" deep link

### Screen 3 — History
- List of past workouts from localStorage
- Tap any session to regenerate its sticker

### Screen 4 — Profile
- Display name, social handles
- Total workouts, streak display

---

## 9. File structure

```
sweatcard/
├── CLAUDE.md                  ← Claude Code reads this automatically
├── docs/
│   └── sweatcard-prd.md       ← this file
├── public/
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── StickerCard.jsx    ← the sticker card UI component
│   │   ├── StickerCanvas.jsx  ← canvas renderer + PNG export
│   │   ├── WorkoutSummary.jsx ← workout data display
│   │   └── StylePicker.jsx    ← colorway selector
│   ├── data/
│   │   ├── mockWorkout.json   ← mock HealthKit workout object
│   │   └── mockUser.json      ← mock user profile
│   ├── hooks/
│   │   ├── useWorkout.js      ← workout data hook
│   │   └── useExport.js       ← PNG export hook
│   ├── utils/
│   │   ├── formatStats.js     ← format values (8700 → 8.7k)
│   │   └── canvasRenderer.js  ← canvas drawing logic
│   ├── styles/
│   │   └── tokens.js          ← design tokens (colors, fonts)
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 10. Day-by-day build plan

### Day 1 — Foundation
**Goal:** Working React app with mock data loading and sticker card visible on screen.

Tasks:
- `npm create vite@latest sweatcard -- --template react`
- Create `mockWorkout.json` and `mockUser.json` from Section 6 schemas
- Build `StickerCard.jsx` as a styled HTML/CSS component (visual only, no canvas yet)
- Verify it renders on mobile Safari

Prompt to use:
```
Read CLAUDE.md and /docs/sweatcard-prd.md.
Day 1: Set up the Vite React project and create the mock data files
from the schemas in Section 6. Then build StickerCard.jsx
as a CSS-styled component matching the Smoke colorway in Section 7.
```

---

### Day 2 — Canvas rendering
**Goal:** Sticker card generated as real canvas output, exportable as PNG.

Tasks:
- Build `canvasRenderer.js` — draws the sticker onto HTML Canvas
- Match the CSS design pixel-for-pixel in canvas
- Test PNG output at 2x resolution

Prompt to use:
```
Read CLAUDE.md. Day 2: Build canvasRenderer.js.
It should draw the Smoke sticker card onto an HTML Canvas,
matching the design spec in Section 7 of the PRD exactly.
Render at 2x (780px wide) for retina quality.
```

---

### Day 3 — Export + style picker
**Goal:** User can tap Save and the PNG lands in their camera roll.

Tasks:
- Build `useExport.js` — canvas.toBlob() → Web Share API
- Test on real iPhone in Safari
- Build `StylePicker.jsx` — at least 2 colorway options
- Verify PNG saves cleanly to Photos

Prompt to use:
```
Read CLAUDE.md. Day 3: Build useExport.js.
It should use canvas.toBlob() and the Web Share API to save
the sticker PNG to the iOS camera roll. Then build StylePicker.jsx
with at least 2 colorway options (Smoke is default).
```

---

### Day 4 — Data layer + history
**Goal:** App remembers workouts and user profile across sessions.

Tasks:
- Set up localStorage schema
- Build workout history list (Screen 3)
- Build profile screen (Screen 4)
- Connect mock data through `useWorkout.js`

Prompt to use:
```
Read CLAUDE.md. Day 4: Set up localStorage to store workout history
and the user profile object from Section 6. Build the history screen
(list of past workouts, tap to regenerate sticker) and the profile
screen (display name, handles, streak).
```

---

### Day 5 — Polish + deploy
**Goal:** Live URL that works on iPhone. Ready to demo.

Tasks:
- Responsive polish for 375px, 390px, 430px screen widths
- PWA manifest + icons
- Deploy to Vercel (`npx vercel`)
- Full end-to-end test on real iPhone
- Write pitch script

Prompt to use:
```
Read CLAUDE.md. Day 5: Polish the app for iPhone screen sizes
(375px, 390px, 430px). Add the PWA manifest. Then help me deploy
to Vercel and confirm the full flow works — load app, view sticker,
save PNG, open Instagram.
```

---

## 11. Prompt cheat sheet

**Start of any session:**
```
Read CLAUDE.md and /docs/sweatcard-prd.md first.
Today is Day [X]. Task: [describe the one thing].
Start with [filename].
```

**When something is broken:**
```
[filename] throws this error: [paste exact error message].
The issue is in [describe the section].
```

**When a design detail is wrong:**
```
In [filename], the [element] color is [wrong value].
Change it to [correct value]. Only change that line.
```

**When a day is done:**
```
/compact
```

**Starting fresh next day:**
```
New session. Read CLAUDE.md. Summarize what was built so far
based on the files in the project, then move to Day [X].
```

---

## 12. Pitch script outline (2–3 minutes)

**Hook (15 sec)**
"You just finished a workout. You're proud of what you did. You want to post. But there's no clean way to show your stats and be in the photo at the same time."

**The problem (30 sec)**
Walk through the current workaround — screenshot the watch, open Instagram, manually layer it on a selfie. Too many steps, looks amateurish, kills the moment.

**The demo (45 sec)**
Pull out your iPhone. Open SweatCard. Show the sticker generating from the workout data. Hit Save. Open Instagram. Show the PNG sitting in the camera roll, ready to use as a sticker.

**The data angle (30 sec)**
"Every time someone uses SweatCard, we collect their workout data — type, intensity, frequency, streaks. We also know their Instagram and TikTok handles. That combination of fitness data plus social identity doesn't exist anywhere else. That's a data business inside a consumer app."

**The close (20 sec)**
State what you built, what Phase 2 looks like (real HealthKit, App Store), and what traction looks like in 90 days.

---

## 13. Phase 2 — real HealthKit integration

When ready to go native iOS:

1. Build Swift/SwiftUI wrapper app
2. Request HealthKit permission: `HKObjectType.workoutType()`
3. Query latest workout: `HKSampleQuery` with `HKWorkout`
4. Map HealthKit fields to the same JSON schema in Section 6
5. Same rendering logic — nothing changes
6. Use `UIImageWriteToSavedPhotosAlbum()` instead of Web Share API
7. Submit to App Store ($99/yr Apple Developer account required)

The schema was designed for this. The upgrade is a data source swap, not a rebuild.

---

## 14. Business and data angle

### What you collect at signup

- Workout type, frequency, intensity, streaks
- Instagram and TikTok handles
- City and timezone
- Device type and workout source

### Why it's valuable

No other fitness app also holds the social handle. You know what someone trains AND where they post. That cross-reference is rare and sellable.

### Monetization paths

| Path | How |
|---|---|
| Sponsored sticker packs | Gymshark, Nike, Lululemon pay for branded colorways |
| Influencer identification | Brands pay for high-output trainers with large followings |
| Anonymized trend data | Sell aggregate training patterns to supplement and equipment brands |
| Freemium | Free = 1 colorway. Paid ($2.99/mo) = all colorways, no watermark |

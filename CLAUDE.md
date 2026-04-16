# SweatCard — project context

## What this is
A React PWA that generates a styled workout sticker card
from mock HealthKit data and exports it as a PNG to the camera roll.
Full spec in /docs/sweatcard-prd.md.

## Stack
- React + Vite
- CSS Modules (no external UI libraries)
- HTML Canvas API for sticker rendering
- Web Share API for PNG export to camera roll
- localStorage for user data and workout history
- Target: iPhone Safari (375px, 390px, 430px widths)
- Deploy: Vercel

## Design system — Smoke colorway
- Background:    #181818
- Border:        #282828
- Grid divider:  #242424
- Accent:        #1D9E75  (line, PR badge, dot)
- Primary text:  #f0f0f0  (titles, stat values)
- Stat labels:   #7a7a7a  (accessible — 4.6:1)
- App name:      #6b6b6b  (accessible — 4.1:1)
- Streak text:   #6b6b6b
- Streak value:  #c8c8c8

## Coding rules
- One component per file
- Mobile-first — base width 375px
- No external UI libraries
- Canvas renders at 2x (780px) for retina
- PNG export uses canvas.toBlob() + Web Share API

## File structure
src/components/  — UI components
src/data/        — mock JSON files
src/hooks/       — useWorkout.js, useExport.js
src/utils/       — formatStats.js, canvasRenderer.js
src/styles/      — tokens.js (design tokens)
docs/            — sweatcard-prd.md (full PRD)

## Token-saving rules
- Ask for one file at a time
- Paste exact error messages when something breaks
- Type /compact after each day's work is done
- If something is 90% right, describe only what's wrong

## How to start each session
Read this file and /docs/sweatcard-prd.md first.
Then wait for the day's task prompt.

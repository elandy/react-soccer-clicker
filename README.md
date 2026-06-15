# React Soccer Clicker

A physics-based soccer clicker game built with React and HTML Canvas.  
You take penalty shots, earn money, upgrade your player, and optimize for scoring efficiency.

The game combines real-time animation, collision detection, and an incremental upgrade system with a lightweight simulation loop.

---

## Features

### Gameplay
- Animated penalty shots using `requestAnimationFrame`
- Goalkeeper that moves dynamically within the goal area
- Collision-based outcomes:
  - Goal
  - Saved
  - Post
  - Missed (outside goal)

### Upgrade System
- 💪 Strength (faster shots)
- ⚽ Ball size (smaller ball improves precision)
- 🧤 Goalkeeper difficulty scaling
- 🎯 Aim control (reduces shot spread)
- 💰 Reward multiplier (increases earnings per goal)

All upgrades scale in cost over time.

### Economy
- Earn money from scoring goals
- Reinvest into upgrades to improve efficiency
- Increasing optimization loop (clicker progression system)

### Stats System
- Total kicks
- Goals scored
- Accuracy
- Rolling accuracy (last 20 shots)
- Money earned

### Audio Feedback
- Kick sound
- Goal cheer
- Post hit
- Miss/boo feedback

---

## Tech Stack

- React (hooks-based architecture)
- HTML Canvas API
- requestAnimationFrame animation loop
- Modular game logic (collision, animations, constants, sound system)

---

## Architecture Overview

The project separates concerns into:

- `game/` → physics, collision detection, constants, animations, sound
- `components/` → UI + canvas rendering + Upgrades
- `assets/` → game assets (images, sounds)
- `App.jsx` → game state orchestration

The rendering loop is decoupled from React state updates where possible, using Canvas for drawing.

---

## Why this project exists

This project explores how far React can be pushed toward real-time interactive simulation without a dedicated game engine, combining declarative UI with imperative canvas rendering.

---

## Possible future improvements

- Difficulty scaling / levels
- Combo system for consecutive goals
- Particle effects on impact
- Save/load progression
- Mobile touch controls
- Refactor into full game engine architecture

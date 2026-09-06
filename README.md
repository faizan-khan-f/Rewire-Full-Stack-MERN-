Neuro-Rewiring Application
A full-stack MERN (MongoDB, Express, React/Vite, Node.js) application designed to help users break loop habits, reset dopamine baselines, and execute structured neuroplasticity growth challenges through sensory feedback and personalized target tracking.

Key Features
Structured Challenge Tiers: Choose from three progressive habit transformation protocols:

1-Week Reset: Mindfulness, data fasting, cortisol boundary optimization, and dopamine baseline recovery.

21-Day Reset & Rewire: Habit loop identification, substitution of doomscrolling with creation, and breathing drills.

90-Day Reset, Rewire & Rebounce: Long-term goal setting, uninterrupted 90-minute deep work sessions, and strict digital boundaries.

Personalized Custom Target Containers: Add up to 10 tasks per tracking list across daily, weekly, 21-day, monthly, and 90-day milestones with persistent state handling.

Gemini-Style Strategy Notes: Integrated popover note editors attached to personal target sections for tracking mindset strategies, rules, and personal reflections.

Sensory Dopamine Rewards:

Mathematically synthesized Web Audio API sound engines generating clicking UI feedback, dynamic task pops, and triumphant multi-note A-Major celebration arpeggios.

Particle celebration animations using canvas-confetti for task completions, weekly milestones, Day 1 conquests, and final victories.

Secure Authentication: Robust session management featuring user registration, login, and verified forgot/reset password flows with explicit password hashing.

Tech Stack
Frontend: React, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti

Backend: Node.js, Express.js, JSON Web Tokens (JWT), BcryptJS

Database: MongoDB Atlas / Mongoose ODM

Project Directory Structure
Plaintext
rewire/
├── frontend-rewire/ # React + Vite client application
│ ├── src/
│ │ ├── context/ # AuthContext state management
│ │ ├── pages/ # Dashboard, AuthPage, Settings views
│ │ └── ...
│ └── package.json
└── backend-rewire/ # Node.js + Express API server
├── controllers/ # Auth and Plan business logic
├── models/ # Mongoose schemas (User, Plan)
├── routes/ # API routing endpoints
├── middlewares/ # JWT protection middleware
└── package.json

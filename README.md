# PragyaPath — Pure MERN Stack
# https://pragyapath-pure-mern.vercel.app/

PragyaPath is a full-stack career and competitive-exam navigator built with:

- **MongoDB + Mongoose** — database
- **Express.js** — REST API
- **React.js + JSX + Vite** — frontend
- **Node.js** — backend runtime
- **JavaScript only** — no TypeScript / `.ts` / `.tsx`

Tailwind CSS is used only for UI styling; it is not a separate backend/service.

## Project structure

```text
pragyapath-mern/
├── server.js
├── package.json
├── vite.config.js
├── .env.example
├── models/
│   ├── User.js
│   ├── StudySession.js
│   ├── TestAttempt.js
│   ├── PersonalNote.js
│   └── Bookmark.js
├── routes/
│   ├── auth.js
│   ├── sessions.js
│   ├── practice.js
│   ├── notes.js
│   └── bookmarks.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── context/
    ├── components/
    ├── data/
    ├── services/
    └── utils/
```


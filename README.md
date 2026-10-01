# PragyaPath — Pure MERN Stack

PragyaPath is a full-stack career and competitive-exam navigator built with:

- **MongoDB + Mongoose** — database
- **Express.js** — REST API
- **React.js + JSX + Vite** — frontend
- **Node.js** — backend runtime
- **JavaScript only** — no TypeScript / `.ts` / `.tsx`

Tailwind CSS is used only for UI styling; it is not a separate backend/service.

## 1. Project structure

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

## 2. Requirements

Install these first:

1. **Node.js 18+** (Node 20+ recommended)
2. **MongoDB Community Server** running locally, OR a MongoDB Atlas database
3. **VS Code**

Check Node:

```bash
node -v
npm -v
```

Check MongoDB if using a local installation:

```bash
mongosh
```

## 3. Open in VS Code

Extract the ZIP, then open the extracted `pragyapath-mern` folder in VS Code.

Or from Terminal:

```bash
cd path/to/pragyapath-mern
code .
```

## 4. Install packages

In the VS Code terminal:

```bash
npm install
```

## 5. Create `.env`

Create a file named `.env` in the project root.

For local MongoDB:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pragyapath_mern
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

Do **not** commit `.env` to GitHub.

## 6. Start MongoDB

If MongoDB is installed locally, make sure the MongoDB service is running.

Then test:

```bash
mongosh
```

If `mongosh` connects successfully, exit with:

```text
exit
```

## 7. Run the backend

Open VS Code Terminal 1:

```bash
npm run server
```

You should see:

```text
[MongoDB] Connected successfully
[Express] MERN Server running on port 5000
```

Test the API in your browser:

```text
http://localhost:5000/api/health
```

Expected response includes:

```json
{
  "status": "healthy",
  "stack": "MERN (Pure JavaScript)",
  "database": "connected"
}
```

## 8. Run the React frontend

Open VS Code Terminal 2:

```bash
npm run client
```

Open:

```text
http://localhost:3000
```

Vite automatically proxies `/api/*` requests to Express on port `5000`.

## 9. Recommended VS Code workflow

Use two terminals:

### Terminal 1 — Express + MongoDB API

```bash
npm run server
```

### Terminal 2 — React + Vite

```bash
npm run client
```

Then visit:

```text
http://localhost:3000
```

## 10. Useful commands

Development server:

```bash
npm run server
```

Frontend:

```bash
npm run client
```

Production frontend build:

```bash
npm run build
```

Start Express:

```bash
npm start
```

## 11. MERN data flow

```text
React JSX
   ↓ fetch()
Vite /api proxy
   ↓
Express.js routes
   ↓
Mongoose models
   ↓
MongoDB
```

Implemented MongoDB-backed features:

- User profile
- Study planner sessions
- Personal notes
- Mock-test attempts
- Saved resource bookmarks

## 12. API endpoints

### Health

```text
GET /api/health
```

### Profile

```text
GET  /api/auth/profile?email=...
POST /api/auth/profile
```

### Study sessions

```text
GET    /api/sessions?userId=...
POST   /api/sessions
PUT    /api/sessions/:id
DELETE /api/sessions/:id
```

### Notes

```text
GET    /api/notes?userId=...
POST   /api/notes
DELETE /api/notes/:id
```

### Mock-test attempts

```text
GET  /api/practice/attempts?userId=...
POST /api/practice/attempts
```

### Bookmarks

```text
GET    /api/bookmarks?userId=...
POST   /api/bookmarks
DELETE /api/bookmarks/:resourceId?userId=...
```

## 13. If MongoDB is not connecting

Check `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/pragyapath_mern
```

Then make sure MongoDB is running and restart:

```bash
npm run server
```

For Atlas, make sure:

- The connection string is correct.
- Your IP is allowed in Atlas Network Access.
- The database user/password are correct.

## 14. Important

This project intentionally contains **no TypeScript**:

- `.js` for Node/Express/Mongoose
- `.jsx` for React components
- no `.ts`
- no `.tsx`

The frontend communicates with the Express backend through REST APIs, and persistent application data is stored in MongoDB.

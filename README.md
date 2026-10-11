# திருவள்ளுவர் தமிழ் பள்ளி - வினா விடை (Thiruvalluvar Tamil School Quiz)

Interactive Tamil Quiz application with authentic Tamil voice narration, 15-second countdown timer, sound effects synthesizer, and curriculum-aligned questions.

---

## 🚀 How to Deploy on Render (Exact Settings)

When creating a **Web Service** on [dashboard.render.com](https://dashboard.render.com/):

### 1. Web Service Configuration
- **Name**: `thiruvalluvar-tamil-quiz` (or any name)
- **Runtime**: `Node`
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 2. Environment Variables (Under "Advanced")
Add the following variables:
| Key | Value | Description |
|---|---|---|
| `NODE_VERSION` | `22` | **Crucial**: Tells Render to use Node 22 (required for Vite 6/8 & Tailwind v4) |
| `NODE_ENV` | `production` | Optimizes performance and serves static bundle |
| `GEMINI_API_KEY` | *(optional)* | Your API key if using Gemini features |

---

## 🛠️ Common Render Errors & Why They Were Fixed

1. **`vite: command not found` or `esbuild: not found`**:
   - *Cause*: Render defaults `NODE_ENV=production`, which causes `npm install` to ignore dev dependencies.
   - *Solution*: `esbuild` is moved to `dependencies` and the build command is `npm install --include=dev && npm run build`.

2. **Node Version / Syntax Error**:
   - *Cause*: Render's default image sometimes uses older Node 18, which cannot build modern Vite / Tailwind.
   - *Solution*: A `.node-version` file specifying `22` and `package.json` engines `>=20.0.0` are included in the repository.

3. **Port Binding / Health Check Timeout**:
   - *Cause*: Hardcoded port 3000.
   - *Solution*: `server.ts` binds dynamically to `process.env.PORT` assigned by Render on host `0.0.0.0`.

---

## 💻 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Development server:
   ```bash
   npm run dev
   ```

3. Production build test:
   ```bash
   npm run build
   npm start
   ```

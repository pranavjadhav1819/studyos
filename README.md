<div align="center">

# ⚡ StudyOS

### 🧠 Your syllabus learns with you.

**An intelligent student productivity platform for studying, planning, notes, subjects, and academic progress.**

<br>

<a href="https://studyos-nine-zeta.vercel.app/">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-StudyOS-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</a>
<a href="https://github.com/pranavjadhav1819/studyos">
  <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>

<br><br>

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Supabase-Auth-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" />

</div>

---

## 🌌 What is StudyOS?

StudyOS is a modern web application designed to bring a student's academic workflow into one place.

Instead of jumping between notes, planners, subjects, and different productivity tools, StudyOS aims to provide a unified study workspace.

```text
                    ┌─────────────────────┐
                    │       StudyOS       │
                    │  Student Workspace  │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
      📚 Subjects          📝 Notes            📅 Planner
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                               ▼
                       📊 Progress System
                               │
                               ▼
                         🤖 AI Future
✨ Features
<table> <tr> <td width="50%">
📊 Dashboard

A central place to view your academic activity and study progress.

</td> <td width="50%">
📚 Subjects

Organize your academic subjects in a structured workspace.

</td> </tr> <tr> <td width="50%">
📝 Notes

Keep study material organized and accessible.

</td> <td width="50%">
📅 Study Planner

Plan what you need to study and structure your preparation.

</td> </tr> <tr> <td width="50%">
🎯 Subject Details

View individual subject information in one place.

</td> <td width="50%">
🔐 Authentication

Secure authentication powered by Supabase.

</td> </tr> </table>
🧠 The Bigger Vision

StudyOS is being built toward a complete AI-powered study operating system.

StudyOS
│
├── 📚 Subjects
├── 📖 Syllabus
├── 📝 Notes
├── 📑 PYQs
├── 🤖 AI Doubt Solver
├── 📅 Study Planner
├── 🔄 Revision System
├── ⏳ Exam Countdown
├── 🎯 Weak Topic Detection
└── 📊 Progress Analytics
Imagine asking:

"My Operating Systems exam is in 6 days."

StudyOS could eventually analyze your syllabus, previous preparation, weak topics, and available time to build a personalized study plan.

🚀 Live Application
<div align="center">
🌐 StudyOS

https://studyos-nine-zeta.vercel.app/

<br>
🔐 Login

https://studyos-nine-zeta.vercel.app/login

<br> <a href="https://studyos-nine-zeta.vercel.app/"> <img src="https://img.shields.io/badge/OPEN_STUDYOS-00C853?style=for-the-badge&logo=rocket&logoColor=white" /> </a> </div>
🛠️ Tech Stack
<div align="center">
Technology	Role
⚛️ React	Frontend
⚡ Vite	Build Tool
🧭 React Router	Routing
🗄️ Supabase	Authentication & Backend
🎨 CSS	Interface Styling
▲ Vercel	Deployment
🐙 GitHub	Version Control
</div>
📁 Project Architecture
studyos-source/
│
├── 📂 src/
│   │
│   ├── 📂 components/
│   │   └── Layout.jsx
│   │
│   ├── 📂 lib/
│   │   ├── AuthContext.jsx
│   │   ├── priority.js
│   │   └── supabaseClient.js
│   │
│   ├── 📂 pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Notes.jsx
│   │   ├── Planner.jsx
│   │   ├── SubjectDetail.jsx
│   │   └── Subjects.jsx
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
└── vite.config.js
⚡ Getting Started
1️⃣ Clone
git clone https://github.com/pranavjadhav1819/studyos.git
2️⃣ Enter the project
cd studyos/studyos-source
3️⃣ Install dependencies
npm install
4️⃣ Start development server
npm run dev

Open:

http://localhost:5173
🔐 Environment Variables

Create a .env file inside studyos-source:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
⚠️ Never upload your .env file to GitHub.

Add this to .gitignore:

.env
.env.local
node_modules
dist
🔑 Authentication

StudyOS uses Supabase Authentication.

Current authentication architecture supports:

👤 Student
     │
     ▼
StudyOS Login
     │
     ├──── 📧 Email / Password
     │
     ├──── 🔵 Google
     │
     └──── ⚫ GitHub

OAuth providers need to be configured in the Supabase dashboard and their redirect URLs must match the production configuration.

📦 Production Build

Build the application:

npm run build

Preview the production build:

npm run preview

Vite generates the production files inside:

dist/
☁️ Deployment

StudyOS is deployed with Vercel.

The application is configured as a Vite/React single-page application.

Vercel configuration
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}

This allows React Router routes to be served through the SPA entry point.

🔭 Roadmap
✅ React-based study platform
✅ Authentication
✅ Dashboard
✅ Subjects
✅ Notes
✅ Planner
✅ Subject details

🔨 AI Doubt Solver
🔨 PYQ Intelligence
🔨 Smart Revision
🔨 Exam Countdown
🔨 Weak Topic Detection
🔨 Personalized Study Plans
🔨 Progress Analytics
🎨 Design Philosophy

StudyOS focuses on a modern student-first experience:

Minimal UI
    +
Useful Information
    +
Fast Navigation
    +
Clean Architecture
    +
Future AI Integration
        ↓
     StudyOS
👨‍💻 Developer
<div align="center">
Pranav Jadhav

Computer Engineering Student • Developer • Builder

<br> <a href="https://github.com/pranavjadhav1819"> <img src="https://img.shields.io/badge/GitHub-Pranav_Jadhav-181717?style=for-the-badge&logo=github" /> </a>

<br><br>

<a href="https://studyos-nine-zeta.vercel.app/"> <img src="https://img.shields.io/badge/🚀_Try_StudyOS-Live-black?style=for-the-badge" /> </a> </div>
⭐ Support the Project

If you like the idea behind StudyOS, consider giving the repository a ⭐.

<div align="center">
📚 Study smarter.
⚡ Plan better.
🧠 Build your future.

StudyOS

</div> ```
For an even more impressive GitHub page

The biggest visual improvement would be adding a real animated StudyOS demo GIF/banner at the top instead of only badges. GitHub README supports GIFs, so we could make a polished animated hero such as:

StudyOS → dashboard → subjects → notes → planner → login

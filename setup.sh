#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────
#  setup.sh – Create the complete file‑tree for the new‑project‑frontend repo
#
#  Run it from the root of the repo:
#      $ bash setup.sh
#
#  The script will:
#    • make all directories
#    • write every file with the exact contents that were outlined
#    • put placeholder values into .env.local (you’ll have to replace them)
#    • install the dependencies (you can skip if you prefer)
#    • (optionally) create a README and commit everything
#  ────────────────────────────────────────────────────────────────
set -e

echo "Creating directory structure…"
mkdir -p src/app/api/auth
mkdir -p src/app/confirm
mkdir -p src/app/home
mkdir -p src/app/project/create
mkdir -p src/app/chat/[projectId]
mkdir -p src/components
mkdir -p src/app/api
mkdir -p src/app/chat/[projectId]
mkdir -p src/app/chat/[projectId]

echo "Writing global files…"

cat <<'EOF' > package.json
{
  "name": "new-project-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.13.5",
    "@mui/material": "^5.13.5",
    "axios": "^1.6.0",
    "next": "13.5.4",
    "next-auth": "^4.24.1",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "socket.io-client": "^4.7.2",
    "react-dropzone": "^14.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.4.9",
    "@types/react": "^18.2.18",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.2",
    "typescript": "^5.2.2",
    "jest": "^29.6.1",
    "ts-jest": "^29.1.1",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.2",
    "@testing-library/user-event": "^14.4.3"
  }
}
EOF

cat <<'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF

cat <<'EOF' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
EOF

cat <<'EOF' > tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
EOF

cat <<'EOF' > postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
EOF

cat <<'EOF' > src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

cat <<'EOF' > .env.local
# ────────────────────────────────────────────────────────────────
#  .env.local – local environment file
#  --------------------------------------------------------------------
#  Keep this file out of source‑control (it is already in .gitignore)
#  --------------------------------------------------------------------
#  Replace the placeholder values with your real credentials
# --------------------------------------------------------------------
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
BACKEND_URL=http://localhost:4000   # <-- your Spring‑Boot server
EOF

cat <<'EOF' > README.md
# new‑project‑frontend

This repository contains the React / Next.js / Tailwind stack that talks to the
Spring‑Boot backend in *new‑project‑backend*.

## Local development

```bash
# 1.  Clone the repo (if you haven’t already)
#     git clone https://github.com/tonchovet/new-project-frontend
# 2.  Switch to the folder
#     cd new-project-frontend
# 3.  Run the script once to lay out the file tree
#     bash setup.sh
# 4.  Replace the placeholder values in `.env.local`
# 5.  Install the dependencies
#     npm install
# 6.  Start the dev server
#     npm run dev

EOF

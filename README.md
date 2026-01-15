# task-management-system
allows users to sign up, log in, and manage their personal tasks. 
Each user can create, view, update, and delete tasks securely.

Functions: 
-Frontend handles UI and authentication 
-Backend handles all database operations 
-Supabase Row Level Security (RLS) ensures data isolation between users

Features: 
-User Signup & Login using Supabase Authentication 
-Email verification for new users 
-Create, Read, Update, and Delete tasks 
-Task fields: Title, Description, Status (Pending / Completed) 
-Inline task editing 
-Secure backend APIs with validation 
-Row Level Security(RLS)

Tech Stack 
Frontend: 
-Next.js 
-TypeScript 
-Tailwind CSS 
-Supabase Auth
Backend: 
-Node.js 
-Express.js 
-TypeScript
Database & Authentication: 
-Supabase 
-Supabase Authentication 
-Supabase Row Level Security

Steps to Run Locally:

A)Clone the repository: 
  git clone <your-github-repo-url> 
  cd task-manager

B)Backend Setup: 
  cd backend 
  npm install 

Backend (`backend/.env`)
- Create a `.env` file using the example provided with the name '.env.example' :
- add these details
  SUPABASE_URL=your_supabase_project_url  
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  
  PORT=4000  

- Run the backend server:
  npm run dev

- Backend will run on:
  http://localhost:4000

C)Frontend Setup: 
  cd frontend
  npm install 

Frontend (`frontend/.env.local`)
- Create a `.env.local` file using the example provided with the name '.env.example' :
- add these details
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url  
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key  

- Run the Frontend server:
  npm run dev

- Frontend will run on:
  http://localhost:3000


How to Use:

1)Open http://localhost:3000/signup
2)Create a new account
3)Verify your email
4)Login at /login
5)Manage your tasks at /tasks



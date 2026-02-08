# CityPulse

CityPulse is a full-stack civic issue management platform built with **Next.js**.  
It enables citizens to report local issues, authorities to manage and assign complaints, and staff members to track and resolve tasks through role-based dashboards.

This project was developed as part of a hackathon and focuses on clear workflows, secure APIs, and practical real-world use cases.

---

## Tech Stack

**Frontend & Backend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend & Infrastructure**
- Node.js
- MongoDB (Mongoose)
- JWT-based authentication
- Google OAuth
- Email & OTP handling

**Deployment**
- Vercel

---

## Features

### Authentication
- Email and password login
- Google OAuth login
- OTP-based password reset
- Role-based authorization

### User Roles

**Citizen**
- Create complaints
- Track complaint status
- View complaint history

**Authority**
- View complaints by department
- Assign complaints to staff
- View reports and statistics

**Staff**
- View assigned tasks
- Update task status
- Upload proof of work

### General
- Secure API routes
- Department-level access control
- Dedicated dashboards for each role

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
2. Install dependencies
npm install
3. Run the development server
npm run dev
The application will be available at:

http://localhost:3000
Build for Production
npm run build
npm start
Deployment
The project is designed to be deployed on Vercel.

General steps:

Push the repository to GitHub

Import the project into Vercel

Configure project settings

Deploy

Notes
This project is built entirely with Next.js and Node.js

No Python dependencies are required

All dependencies are managed via package.json

API routes are implemented using the Next.js App Router

License
This project was created for a hackathon and is intended for educational and demonstration purposes.


# Admin Dashboard (MERN)

This folder contains the admin dashboard for the Balaji Physio appointment system.

## Features

- Admin login / signup
- Patient management CRUD with photo upload and prescription note
- Appointment management CRUD
- Clean UI built with Material UI (MUI)

## Setup

1. Install server dependencies:
   ```bash
   cd admin/server
   npm install
   ```
2. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```
3. Start the server:
   ```bash
   cd ../server
   npm run dev
   ```
4. Start the client:
   ```bash
   cd ../client
   npm run dev
   ```

## Environment

Create `.env` in `admin/server` with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/balaji-admin
JWT_SECRET=your_jwt_secret
UPLOAD_PATH=uploads
```

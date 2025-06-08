# Trello Lite - Task Management System

A simplified task management system (like Trello) with the following features:

- React Frontend
- Node.js + Express Backend
- MongoDB for data storage
- Role-based access control (Admin, User)
- Encrypted communication (using CryptoJS)
- JWT-based authentication
- Nodemailer for task update notifications
- Live one-to-one chat between User and Admin
- Task status tracking (To Do, In Progress, Completed)
- Optional: Drag-and-drop task status change

---

## 📦 Tech Stack

### Frontend
- React
- TailwindCSS / Bootstrap (minimal styling)
- Redux Toolkit or Context API
- CryptoJS for encryption/decryption
- Socket.IO for chat

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- CryptoJS for encryption/decryption
- Nodemailer for email
- Socket.IO for chat

---

## 🚀 Features

### Authentication
- Static Login using Email & Password
- Signup endpoint with email, password, and age
- JWT token returned on login

### Task Management
- **Admin** can create, view, update, delete tasks
- **User** can only update task status and description
- Tasks shown in 3 columns: To Do, In Progress, Completed
- Drag and Drop to update status (optional)

### Security
- All API requests/responses are encrypted with CryptoJS (AES encryption)
- JWT-based authentication and role middleware

### Notifications
- After a User updates a task, Admin receives an email via Nodemailer

### Chat
- One-to-one real-time chat (Admin <-> User) using Socket.IO
- Messages stored in MongoDB

---

## 🧩 API Endpoints

### Auth
- `POST /signup` – Register new user
- `POST /login` – Login and get JWT token

### Tasks
- `GET /tasks` – Get all tasks
- `POST /tasks` – Create a new task (Admin only)
- `PUT /tasks/:id` – Update a task (User/Admin)
- `DELETE /tasks/:id` – Delete a task (Admin only)

### Chat
- `GET /chat/:userId` – Get chat messages
- `POST /chat` – Send a chat message

---

## 🔐 Security: Encryption

- All request and response bodies must be encrypted and decrypted using **CryptoJS AES**.
- Each client encrypts requests before sending.
- Server decrypts them using a shared secret key.
- Responses are encrypted the same way before being sent back.

---

## 📧 Email Notifications

- Nodemailer configured using SMTP (e.g., Gmail or SendGrid)
- When User updates a task, Admin receives an email alert with task info.

---

## 🧪 Sample Environment Variables

Create a `.env` file in your backend root:


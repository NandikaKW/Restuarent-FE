## 🍽️ Restaurant Website – Full Stack Application

A **full stack restaurant web application** developed using **MERN stack technologies**.
The system provides a complete solution for **online food browsing, ordering, authentication, and administration**, following **Rapid Application Development (RAD)** principles.

---

## 📌 Project Overview

This project consists of **two main parts**:

* **Frontend** – User interface for customers and administrators
* **Backend** – RESTful API handling business logic, authentication, and data management

The application allows users to browse menu items, place orders, submit reviews, and securely authenticate, while administrators can manage menu items, orders, and users.

---

## ⚙️ Core Features

### 🔐 Authentication & Security

* User authentication using JWT
* Access Token & Refresh Token mechanism
* Secure login and logout
* Password hashing with bcrypt
* Role-based access control (Admin / User)

### 🍔 Restaurant Functionality

* Menu item management (CRUD)
* Food category management
* Image upload using Cloudinary
* Order placement and order management
* Customer reviews and ratings

### 🧱 System Architecture

* RESTful API design
* Clean layered architecture
* Secure environment variable handling
* Separation of frontend and backend

---

## 🛠️ Technologies Used

### 🔵 Frontend

* **React.js**
* **TypeScript**
* **CSS / Tailwind / Bootstrap**
* **Axios**
* **JWT handling**
* **React Router**

### 🟢 Backend

* **Node.js**
* **Express.js**
* **TypeScript**
* **MongoDB** with **Mongoose**
* **JWT (Access & Refresh Tokens)**
* **Cloudinary**
* **bcryptjs**
* **dotenv**
* **CORS**
* **multer**
* **express-validator**

---

## 🚀 Setup & Run Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/restaurant-project.git
cd restaurant-project
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend server:

```bash
npm run dev
```

Backend will run at:
**[http://localhost:5000](http://localhost:5000)**

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run at:
**[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
restaurant-project/
 ├── frontend/            # React frontend
 │   ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── services/
 │   └── App.tsx
 │
 ├── backend/             # Express backend
 │   ├── src/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── middleware/
 │   ├── services/
 │   ├── config/
 │   └── server.ts
```

---

## 🔐 Security Practices

* JWT-based authentication
* Access & Refresh token implementation
* Password encryption using bcrypt
* Protected routes with middleware
* Secure Cloudinary image handling
* Environment variables for sensitive data
* CORS protection

---

## 📌 Notes

* MongoDB must be running before starting the backend
* Valid Cloudinary credentials are required
* Frontend and backend run independently
* Designed and developed using **RAD methodology**

---

## 👨‍💻 Author

**Nandika Kaweesha**
Full Stack Developer
RAD Coursework Project

---

## 📄 License

This project is licensed under the **MIT License**



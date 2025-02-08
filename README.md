# Food Delivery System - Backend (Node.js & Express)

This is the **backend** for the Food Delivery System, built using **Node.js, Express.js, and MongoDB**.  
It includes **user authentication, menu management, order processing, and JWT-based security**.

## Features
✅ User Authentication (Register/Login with JWT)  
✅ Menu Management (Create, Read, Update, Delete menu items)  
✅ Order Management (Place, Fetch, Filter orders by status)  
✅ MongoDB with Mongoose ORM  
✅ Secure Password Hashing using bcrypt
✅ API Documentation with Swagger  


---

## Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (MongoDB Atlas)  
- **Authentication:** JWT, bcrypt  
- **API Testing:** Postman, Swagger  


---

## Folder Structure
├── 📂 backend 
  ├── 📂 models/              # MongoDB Mongoose schemas
  │   ├── User.js             # User model (username, password)
  │   ├── Menu.js             # Menu model (name, category, price, availability)
  │   ├── Order.js            # Order model (userId, items, totalAmount, status)
  ├── 📂 routes/              # Express API routes
  │   ├── auth.js             # Authentication routes (Register, Login)
  │   ├── menu.js             # Menu management routes (CRUD operations)
  │   ├── order.js            # Order management routes (Create, Get, Filter)
  ├── swaggerConfig.js        # Swagger API documentation
  ├── .env                    # Environment variables (MongoDB URI, JWT Secret)
  ├── .gitignore              # Ignore node_modules, .env, and logs
  ├── package.json            # Dependencies & scripts
  ├── server.js               # Main entry point - Express app setup
  ├── 📂 node modules         # Installed dependencies


  ---

  ## API Documentation link

  -http://localhost:5000/api-docs

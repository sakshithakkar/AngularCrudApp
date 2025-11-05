# 🛍️ Angular + Node.js Product Management System

A full-stack application to manage **products** and **categories** with advanced features like:
- CRUD operations
- Server-side pagination, sorting, and search
- Bulk product upload (CSV)
- Report generation (CSV/XLSX)
- Secure routes with JWT authentication
- Progress bar & feedback messages in the UI

---

## 🚀 Tech Stack

**Frontend:** Angular 17+  
**Backend:** Node.js (Express)  
**Database:** MySQL  
**File Uploads:** Multer  
**Report Generation:** json2csv, ExcelJS  
**Authentication:** JWT  

---

## 📂 Folder Structure

```
AngularCrudApp/
│
├── backend/
│   ├── controllers/
│   │   ├── productController.js
│   │   └── categoryController.js
|   |   |__ userController.js
|   |   |__ authController.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── categoryRoutes.js
│   ├── temp/                # Temporary folder for file uploads & reports
│   ├── db/
│   │   └── config.js
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── products/
│   │   │   ├── services/
│   │   │   └── app.module.ts
│   │   └── index.html
│   ├── angular.json
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🖥️ **Backend Setup**

1. Go to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=productdb
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the backend:
   ```bash
   npm start
   ```
   The backend runs on **http://localhost:5000**

---

### 💻 **Frontend Setup**

1. Go to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Angular app:
   ```bash
   ng serve
   ```
   The app runs on **http://localhost:4200**

---

## 📦 Features

### 🧩 Product Management
- Add, Edit, Delete, and View products
- Link products to categories
- Server-side pagination, sorting (price asc/desc), and search

### 📤 Bulk Upload
- Upload large CSV files without timeouts (stream-based processing)
- Real-time progress bar in UI

### 📊 Report Generation
- Download large datasets as **CSV** or **XLSX**
- Auto-cleans temporary report files
- Handles large exports efficiently (stream download)

### 🔒 Authentication
- JWT-based login for all protected routes

---

## 🧠 Example CSV for Bulk Upload

```csv
name,price,category_id
Book A,200,1
Book B,250,1
Pen Blue,30,2
Notebook,80,2
Marker,60,2
Book C,300,1
```

---

## 🗂️ API Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| GET | `/api/products` | Get all products (pagination, sort, search) |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| POST | `/api/products/bulk-upload` | Bulk upload via CSV |
| GET | `/api/products/export-csv` | Export product data as CSV |
| GET | `/api/products/export-xlsx` | Export product data as Excel |
| GET | `/api/categories` | Get all categories |


---

## 🧹 Notes

- Make sure to create a folder:  
  ```
  backend/temp/
  ```
  for temporary uploads and reports.

- Large file uploads & exports are handled asynchronously to avoid **504 Gateway Timeout**.

---

## 🧑‍💻 Author

**Sakshi Thakkar**  
Full Stack Developer | Angular | Node.js | MySQL

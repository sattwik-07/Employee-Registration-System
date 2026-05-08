# EmpTrack — Industrial Employee Registration System

A complete Employee Registration System with a full-featured website and Java backend.

---

## 📁 Project Structure

```
employee-site/
│
├── index.html                    ← Main website (open this in a browser)
├── css/
│   └── style.css                 ← All website styles
├── js/
│   ├── data.js                   ← Employee data store & operations
│   └── app.js                    ← Website logic & rendering
└── EmployeeRegistration.java     ← Java console application
```

---

## 🌐 Website (Frontend)

### How to open
Just double-click `index.html` — no server required!

### Pages & Features
| Page | Description |
|------|-------------|
| **Dashboard** | Stats cards, recent employees, department bar chart |
| **Register** | Form to add new employees with validation |
| **Employees** | Full table with department filter + name search |
| **Search** | Search by ID, department, or name |
| **Statistics** | Salary summary, headcount bars, avg salary by dept |

### Operations
- ✅ Register new employee (auto-generated ID)
- ✅ View all employees in a sortable table
- ✅ Filter by department
- ✅ Search by ID, name, or department
- ✅ Edit any employee field (modal dialog)
- ✅ Delete employee (with confirmation)
- ✅ Live statistics dashboard
- ✅ Toast notifications
- ✅ Mobile responsive design

---

## ☕ Java Console Application

### How to compile & run
```bash
javac EmployeeRegistration.java
java EmployeeRegistration
```

### Menu Options
```
1. Register Employee
2. View All Employees
3. Search by ID
4. Search by Department
5. Search by Name
6. Update Employee
7. Delete Employee
8. Company Statistics
9. Exit
```

### Classes
- **Employee** — data model with getters/setters
- **EmployeeRegistry** — manages all CRUD operations using `LinkedHashMap`
- **EmployeeRegistration** — main class with menu-driven console UI

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Fonts | Syne (display), DM Sans (body) |
| Backend | Java (JDK 8+) |
| Data | In-memory `LinkedHashMap` |

---

## 📌 Notes
- Website data is in-memory (resets on page refresh). For persistence, connect to a backend API or localStorage.
- Java app pre-loads 6 sample employees for demonstration.
- Requires an internet connection for Google Fonts (or remove the font import for offline use).

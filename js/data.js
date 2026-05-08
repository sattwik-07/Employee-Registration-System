// ===========================
// data.js — Employee Data Store
// EmpTrack Industrial Employee Registration System
// ===========================

const DB = {
  employees: [
    { id: 1001, name: "Arjun Sharma",   dept: "Engineering", desig: "Software Engineer",  salary: 75000, email: "arjun@company.com",   phone: "9876543210" },
    { id: 1002, name: "Priya Nayak",    dept: "HR",          desig: "HR Manager",          salary: 65000, email: "priya@company.com",   phone: "9876543211" },
    { id: 1003, name: "Ravi Kumar",     dept: "Finance",     desig: "Accountant",          salary: 60000, email: "ravi@company.com",    phone: "9876543212" },
    { id: 1004, name: "Sneha Mishra",   dept: "Engineering", desig: "QA Engineer",         salary: 70000, email: "sneha@company.com",   phone: "9876543213" },
    { id: 1005, name: "Amit Patel",     dept: "Marketing",   desig: "Marketing Lead",      salary: 68000, email: "amit@company.com",    phone: "9876543214" },
    { id: 1006, name: "Kavya Reddy",    dept: "Operations",  desig: "Operations Manager",  salary: 72000, email: "kavya@company.com",   phone: "9876543215" },
    { id: 1007, name: "Rahul Singh",    dept: "Sales",       desig: "Sales Executive",     salary: 55000, email: "rahul@company.com",   phone: "9876543216" },
    { id: 1008, name: "Divya Iyer",     dept: "Engineering", desig: "DevOps Engineer",     salary: 78000, email: "divya@company.com",   phone: "9876543217" },
  ],
  nextId: 1009,

  getAll()      { return [...this.employees]; },
  getById(id)   { return this.employees.find(e => e.id === id); },
  getByDept(d)  { return this.employees.filter(e => e.dept.toLowerCase() === d.toLowerCase()); },
  getByName(n)  { return this.employees.filter(e => e.name.toLowerCase().includes(n.toLowerCase())); },

  add(emp) {
    const id = this.nextId++;
    const record = { id, ...emp };
    this.employees.push(record);
    return record;
  },

  update(id, data) {
    const i = this.employees.findIndex(e => e.id === id);
    if (i === -1) return false;
    this.employees[i] = { ...this.employees[i], ...data };
    return true;
  },

  delete(id) {
    const i = this.employees.findIndex(e => e.id === id);
    if (i === -1) return false;
    this.employees.splice(i, 1);
    return true;
  },

  getDepts() {
    const map = {};
    this.employees.forEach(e => { map[e.dept] = (map[e.dept] || 0) + 1; });
    return map;
  },

  getStats() {
    const s = this.employees.map(e => e.salary);
    if (!s.length) return { total: 0, avg: 0, max: 0, min: 0, sum: 0 };
    return {
      total: this.employees.length,
      sum:   s.reduce((a, b) => a + b, 0),
      avg:   Math.round(s.reduce((a, b) => a + b, 0) / s.length),
      max:   Math.max(...s),
      min:   Math.min(...s),
    };
  }
};

import java.util.*;

// ===========================
// EmployeeRegistration.java
// Industrial Employee Registration System — Java Backend
// ===========================

class Employee {
    private int id;
    private String name;
    private String department;
    private String designation;
    private double salary;
    private String email;
    private String phone;

    public Employee(int id, String name, String department, String designation,
                    double salary, String email, String phone) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.designation = designation;
        this.salary = salary;
        this.email = email;
        this.phone = phone;
    }

    public int getId()            { return id; }
    public String getName()       { return name; }
    public String getDepartment() { return department; }
    public String getDesignation(){ return designation; }
    public double getSalary()     { return salary; }
    public String getEmail()      { return email; }
    public String getPhone()      { return phone; }

    public void setName(String name)              { this.name = name; }
    public void setDepartment(String department)  { this.department = department; }
    public void setDesignation(String designation){ this.designation = designation; }
    public void setSalary(double salary)          { this.salary = salary; }
    public void setEmail(String email)            { this.email = email; }
    public void setPhone(String phone)            { this.phone = phone; }

    @Override
    public String toString() {
        return String.format(
            "| %-5d | %-20s | %-15s | %-20s | %10.2f | %-25s | %-12s |",
            id, name, department, designation, salary, email, phone
        );
    }
}

class EmployeeRegistry {
    private Map<Integer, Employee> employees = new LinkedHashMap<>();
    private int nextId = 1001;

    /** Register a new employee and return their auto-generated ID */
    public int register(String name, String dept, String desig, double salary,
                        String email, String phone) {
        int id = nextId++;
        employees.put(id, new Employee(id, name, dept, desig, salary, email, phone));
        System.out.printf("%n✔ Registered: %s  |  ID: %d%n", name, id);
        return id;
    }

    public Employee findById(int id) {
        return employees.get(id);
    }

    public List<Employee> findByDepartment(String dept) {
        List<Employee> result = new ArrayList<>();
        for (Employee e : employees.values())
            if (e.getDepartment().equalsIgnoreCase(dept)) result.add(e);
        return result;
    }

    public List<Employee> findByName(String keyword) {
        List<Employee> result = new ArrayList<>();
        for (Employee e : employees.values())
            if (e.getName().toLowerCase().contains(keyword.toLowerCase())) result.add(e);
        return result;
    }

    public boolean update(int id, Scanner sc) {
        Employee e = employees.get(id);
        if (e == null) { System.out.println("✕ Employee not found."); return false; }
        System.out.println("\nWhat to update?");
        System.out.println("  1. Name   2. Department   3. Designation");
        System.out.println("  4. Salary 5. Email        6. Phone");
        System.out.print("Choice: ");
        int choice = Integer.parseInt(sc.nextLine().trim());
        System.out.print("New value: ");
        String val = sc.nextLine().trim();
        switch (choice) {
            case 1: e.setName(val); break;
            case 2: e.setDepartment(val); break;
            case 3: e.setDesignation(val); break;
            case 4: e.setSalary(Double.parseDouble(val)); break;
            case 5: e.setEmail(val); break;
            case 6: e.setPhone(val); break;
            default: System.out.println("Invalid choice."); return false;
        }
        System.out.println("✔ Updated successfully.");
        return true;
    }

    public boolean delete(int id) {
        if (employees.remove(id) != null) {
            System.out.println("✔ Employee #" + id + " removed.");
            return true;
        }
        System.out.println("✕ Employee not found.");
        return false;
    }

    public void displayAll() {
        if (employees.isEmpty()) { System.out.println("No employees registered."); return; }
        printHeader();
        employees.values().forEach(System.out::println);
        printDivider();
        System.out.println("  Total: " + employees.size() + " employee(s)");
    }

    public void displayStats() {
        if (employees.isEmpty()) { System.out.println("No data."); return; }
        double total = 0, max = Double.MIN_VALUE, min = Double.MAX_VALUE;
        Map<String, Integer> deptCount = new LinkedHashMap<>();
        for (Employee e : employees.values()) {
            total += e.getSalary();
            if (e.getSalary() > max) max = e.getSalary();
            if (e.getSalary() < min) min = e.getSalary();
            deptCount.merge(e.getDepartment(), 1, Integer::sum);
        }
        System.out.println("\n╔══════════════════════════════╗");
        System.out.println("║       Company Statistics      ║");
        System.out.println("╚══════════════════════════════╝");
        System.out.printf("  Total Employees : %d%n",  employees.size());
        System.out.printf("  Total Salary    : ₹%.2f%n", total);
        System.out.printf("  Average Salary  : ₹%.2f%n", total / employees.size());
        System.out.printf("  Highest Salary  : ₹%.2f%n", max);
        System.out.printf("  Lowest Salary   : ₹%.2f%n", min);
        System.out.println("\n  Department Breakdown:");
        deptCount.forEach((d, c) ->
            System.out.printf("    %-20s → %d employee(s)%n", d, c));
    }

    private void printHeader() {
        printDivider();
        System.out.printf("| %-5s | %-20s | %-15s | %-20s | %10s | %-25s | %-12s |%n",
            "ID", "Name", "Department", "Designation", "Salary(₹)", "Email", "Phone");
        printDivider();
    }

    private void printDivider() {
        System.out.println("─".repeat(125));
    }
}

public class EmployeeRegistration {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        EmployeeRegistry reg = new EmployeeRegistry();

        // Pre-load sample data
        reg.register("Arjun Sharma",  "Engineering", "Software Engineer",  75000, "arjun@company.com",  "9876543210");
        reg.register("Priya Nayak",   "HR",          "HR Manager",         65000, "priya@company.com",  "9876543211");
        reg.register("Ravi Kumar",    "Finance",     "Accountant",         60000, "ravi@company.com",   "9876543212");
        reg.register("Sneha Mishra",  "Engineering", "QA Engineer",        70000, "sneha@company.com",  "9876543213");
        reg.register("Amit Patel",    "Marketing",   "Marketing Lead",     68000, "amit@company.com",   "9876543214");
        reg.register("Divya Iyer",    "Engineering", "DevOps Engineer",    78000, "divya@company.com",  "9876543217");

        System.out.println("\n╔══════════════════════════════════════════╗");
        System.out.println("║  INDUSTRIAL EMPLOYEE REGISTRATION SYSTEM  ║");
        System.out.println("╚══════════════════════════════════════════╝");

        boolean running = true;
        while (running) {
            System.out.println("\n┌─────────────────────────┐");
            System.out.println("│       MAIN MENU          │");
            System.out.println("├─────────────────────────┤");
            System.out.println("│ 1. Register Employee     │");
            System.out.println("│ 2. View All Employees    │");
            System.out.println("│ 3. Search by ID          │");
            System.out.println("│ 4. Search by Department  │");
            System.out.println("│ 5. Search by Name        │");
            System.out.println("│ 6. Update Employee       │");
            System.out.println("│ 7. Delete Employee       │");
            System.out.println("│ 8. Company Statistics    │");
            System.out.println("│ 9. Exit                  │");
            System.out.println("└─────────────────────────┘");
            System.out.print("Choice: ");

            try {
                int choice = Integer.parseInt(sc.nextLine().trim());
                switch (choice) {
                    case 1:
                        System.out.println("\n── New Employee Registration ──");
                        System.out.print("Full Name     : "); String name  = sc.nextLine();
                        System.out.print("Department    : "); String dept  = sc.nextLine();
                        System.out.print("Designation   : "); String desig = sc.nextLine();
                        System.out.print("Salary (₹/mo) : "); double sal   = Double.parseDouble(sc.nextLine());
                        System.out.print("Email         : "); String email = sc.nextLine();
                        System.out.print("Phone         : "); String phone = sc.nextLine();
                        reg.register(name, dept, desig, sal, email, phone);
                        break;

                    case 2:
                        System.out.println("\n── All Employees ──");
                        reg.displayAll();
                        break;

                    case 3:
                        System.out.print("Employee ID: ");
                        int sid = Integer.parseInt(sc.nextLine());
                        Employee found = reg.findById(sid);
                        if (found != null) System.out.println("\n" + found);
                        else System.out.println("✕ No employee with ID " + sid);
                        break;

                    case 4:
                        System.out.print("Department name: ");
                        String deptQ = sc.nextLine();
                        List<Employee> dList = reg.findByDepartment(deptQ);
                        if (dList.isEmpty()) System.out.println("✕ No employees in \"" + deptQ + "\"");
                        else dList.forEach(System.out::println);
                        break;

                    case 5:
                        System.out.print("Name keyword: ");
                        String nQ = sc.nextLine();
                        List<Employee> nList = reg.findByName(nQ);
                        if (nList.isEmpty()) System.out.println("✕ No match for \"" + nQ + "\"");
                        else nList.forEach(System.out::println);
                        break;

                    case 6:
                        System.out.print("Employee ID to update: ");
                        reg.update(Integer.parseInt(sc.nextLine()), sc);
                        break;

                    case 7:
                        System.out.print("Employee ID to delete: ");
                        reg.delete(Integer.parseInt(sc.nextLine()));
                        break;

                    case 8:
                        reg.displayStats();
                        break;

                    case 9:
                        System.out.println("\nGoodbye! 👋");
                        running = false;
                        break;

                    default:
                        System.out.println("Invalid option.");
                }
            } catch (NumberFormatException e) {
                System.out.println("✕ Please enter a valid number.");
            }
        }
        sc.close();
    }
}

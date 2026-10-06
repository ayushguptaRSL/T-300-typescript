import { Employee, Designation } from "../models/Employee";
import { validateEmployeeInfo, validateReportTo, validateReportees } from "../validation/Validator";

export const employeesDB = new Map<string, Employee>();

// Create
export function createEmployee(
    id: string, 
    name: string, 
    dateOfBirth: string, 
    designation: Designation,
    reportsTo: string | null,
    reportees: string[] | null): Employee {
    if (employeesDB.has(id)) {
        throw new Error(`An employee with id "${id}" already exists`);
    }

    if (designation === "CEO" && [...employeesDB.values()].some((existing) => existing.designation === "CEO")) {
        throw new Error("Only one CEO can exist in the organization");
    }

    validateEmployeeInfo(name, dateOfBirth);
    validateReportTo(designation, reportsTo);
    validateReportees(designation, reportees);

    let employee = new Employee(name, id, dateOfBirth, designation, reportsTo, reportees);
    employeesDB.set(id, employee);

    return employee;
}

// Read
export function getEmployee(id: string): Employee {
    if (!employeesDB.has(id)) {
        throw new Error(`An employee with id "${id}" does not exists`);
    }

    let employee = employeesDB.get(id)

    if(employee === undefined) {
        throw new Error(`An employee with id "${id}" does not exists`);
    }

    return employee;
}

export function getAllEmployees(): Employee[] {
    return Array.from(employeesDB.values());
}

// Update
export function updateEmployee(
    id: string,
    changes: {
        name?: string;
        dateOfBirth?: string;
        reportees?: string[] | null;
        reportsTo?: string | null;
    }
): Employee {
    const employee = employeesDB.get(id);
    if (!employee) {
        throw new Error(`An employee with id "${id}" does not exist`);
    }

    const updated = new Employee(
        changes.name ?? employee.name,
        employee.id,
        changes.dateOfBirth ?? employee.dateOfBirth,
        employee.designation,
        changes.reportsTo ?? employee.reportsTo,
        changes.reportees ?? employee.reportees
    );

    validateEmployeeInfo(updated.name, updated.dateOfBirth);
    validateReportTo(updated.designation, updated.reportsTo);
    validateReportees(updated.designation, updated.reportees);

    employeesDB.set(id, updated);
    return updated;
}

// Delete
export function deleteEmployee(id: string): boolean {
    const employeeToDelete = employeesDB.get(id);

    if (employeeToDelete === undefined) {
        throw new Error(`An employee with id "${id}" does not exist`);
    }

    if (employeeToDelete.reportees !== null && employeeToDelete.reportees.length > 0) {
        throw new Error(`Cannot delete employee "${id}" because they have reportees`);
    }

    return employeesDB.delete(id);
}
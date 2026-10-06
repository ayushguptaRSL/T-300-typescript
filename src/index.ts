import {
    createEmployee,
    getEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
} from "./controller/curdController";

// 1. Testing validation scenarios for employee info
console.log("--- Testing employee info validations ---");

// testing empty name
try {
    createEmployee("1", "", "05/12/1990", "CEO", null, null);
} catch (error: any) {
    console.log("Error when name is empty:", error.message);
}

// testing invalid date format
try {
    createEmployee("2", "John", "1990-05-12", "CEO", null, null);
} catch (error: any) {
    console.log("Error with invalid date format:", error.message);
}

// testing invalid month
try {
    createEmployee("3", "John", "15/05/1990", "CEO", null, null);
} catch (error: any) {
    console.log("Error with invalid month:", error.message);
}

// testing non leap year feb 29
try {
    createEmployee("4", "John", "02/29/2023", "CEO", null, null);
} catch (error: any) {
    console.log("Error with non leap year date:", error.message);
}

// 2. Testing hierarchy validations
console.log("\n--- Testing hierarchy validations ---");

// testing CEO reporting to someone
try {
    createEmployee("5", "John", "01/01/1990", "CEO", "10", null);
} catch (error: any) {
    console.log("Error when CEO reports to someone:", error.message);
}

// testing Director reporting to null
try {
    createEmployee("6", "Bob", "01/01/1990", "Director", null, null);
} catch (error: any) {
    console.log("Error when Director reports to null:", error.message);
}

// testing Lead reporting to non existing manager
try {
    createEmployee("7", "Alice", "01/01/1990", "Lead", "999", null);
} catch (error: any) {
    console.log("Error when Lead reports to non existing manager:", error.message);
}

// testing Engineer having reportees
try {
    createEmployee("8", "David", "01/01/1990", "Engineer", "1", ["2"]);
} catch (error: any) {
    console.log("Error when Engineer has reportees:", error.message);
}

// 3. Creating employees with proper hierarchy
console.log("\n--- Creating employees ---");

const ceo = createEmployee("e1", "Alice", "02/29/2000", "CEO", null, null);
console.log("Created CEO:", ceo);

const director = createEmployee("e2", "Bob", "03/15/1985", "Director", "e1", null);
console.log("Created Director:", director);

const manager = createEmployee("e3", "Charlie", "07/20/1990", "Manager", "e2", null);
console.log("Created Manager:", manager);

const lead = createEmployee("e4", "Diana", "11/05/1992", "Lead", "e3", null);
console.log("Created Lead:", lead);

const engineer = createEmployee("e5", "Evan", "09/30/1995", "Engineer", "e4", null);
console.log("Created Engineer:", engineer);

// 4. Testing duplicate id and second CEO
console.log("\n--- Testing duplicate id and second CEO ---");

try {
    createEmployee("e1", "Duplicate Alice", "01/01/1990", "CEO", null, null);
} catch (error: any) {
    console.log("Error duplicate id:", error.message);
}

try {
    createEmployee("e6", "Second CEO", "01/01/1980", "CEO", null, null);
} catch (error: any) {
    console.log("Error second CEO:", error.message);
}

// 5. Testing get and getAll
console.log("\n--- Testing getEmployee and getAllEmployees ---");

try {
    const emp = getEmployee("e1");
    console.log("Found employee e1:", emp);
} catch (error: any) {
    console.log("Error getting employee:", error.message);
}

try {
    getEmployee("e99");
} catch (error: any) {
    console.log("Error getting non-existing employee:", error.message);
}

const allEmployees = getAllEmployees();
console.log("All employees count:", allEmployees.length);
console.log("All employees list:", allEmployees);

// 6. Testing updateEmployee
console.log("\n--- Testing updateEmployee ---");

const updatedEmp = updateEmployee("e5", {
    name: "Evan Smith",
    dateOfBirth: "12/25/1995",
});
console.log("Updated employee e5:", updatedEmp);

// add reportee to lead
const updatedLead = updateEmployee("e4", {
    reportees: ["e5"],
});
console.log("Updated Lead reportees:", updatedLead.reportees);

try {
    updateEmployee("e5", { dateOfBirth: "bad-date" });
} catch (error: any) {
    console.log("Error updating with bad date:", error.message);
}

try {
    updateEmployee("e99", { name: "Nobody" });
} catch (error: any) {
    console.log("Error updating non-existing employee:", error.message);
}

// 7. Testing deleteEmployee
console.log("\n--- Testing deleteEmployee ---");

// try to delete lead when they still have reportees
try {
    deleteEmployee("e4");
} catch (error: any) {
    console.log("Error deleting employee with reportees:", error.message);
}

try {
    deleteEmployee("e99");
} catch (error: any) {
    console.log("Error deleting non-existing employee:", error.message);
}

// remove reportee first then delete engineer
updateEmployee("e4", { reportees: [] });
const isDeleted = deleteEmployee("e5");
console.log("Deleted e5 successfully:", isDeleted);

// check remaining employees
const remainingEmployees = getAllEmployees();
console.log("Remaining employees count:", remainingEmployees.length);

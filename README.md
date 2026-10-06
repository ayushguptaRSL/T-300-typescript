# Employee Management System (TypeScript)

A TypeScript-based Employee Management System implementing an organizational hierarchy with comprehensive validation rules, in-memory CRUD operations, and strict referential integrity.

---

## Features

- **Strict Organizational Hierarchy**: Enforces a top-down corporate chain of command (`CEO` &rarr; `Director` &rarr; `Manager` &rarr; `Lead` &rarr; `Engineer`).
- **Comprehensive Validations**:
  - Validates full calendar dates in `mm/dd/yyyy` format, including leap-year calculation.
  - Ensures non-empty employee names.
  - Guarantees exactly one CEO in the organization.
  - Verifies supervisor and subordinate designations against existing employees.
- **In-Memory CRUD Operations**: High-performance $O(1)$ operations using JavaScript `Map`.
- **Referential Integrity**: Prevents deletion of managers who still have active reportees.

---

## Project Setup & Installation
### Run (via npx)

You can run the application directly using `npx tsx`:
```bash
npx tsx src/index.ts
```

## Project Structure

```
Typescript/
├── .gitignore               # Ignored files (node_modules, dist, logs)
├── package.json             # Project dependencies and script definitions
├── tsconfig.json            # TypeScript compiler configuration
├── README.md                # Project documentation
└── src/
    ├── index.ts             # Application entry point and demonstration test suite
    ├── models/
    │   └── Employee.ts      # Employee class definition and Designation type
    ├── controller/
    │   └── curdController.ts # In-memory CRUD operations and state store
    └── validation/
        └── Validator.ts     # Business validation logic (hierarchy, DOB, names)
```

### Detailed File Breakdown

- **[`src/models/Employee.ts`](src/models/Employee.ts)**:
  - Defines the union type `Designation` (`"Engineer" | "Lead" | "Manager" | "Director" | "CEO"`).
  - Defines the `Employee` model class with fields `id` (readonly), `name`, `dateOfBirth`, `designation`, `reportsTo`, and `reportees`.
- **[`src/validation/Validator.ts`](src/validation/Validator.ts)**:
  - `validateEmployeeInfo(name, dateOfBirth)`: Checks for non-empty names and validates DOB format.
  - `isValidDateOfBirth(value)`: Validates `mm/dd/yyyy` format, Gregorian calendar days per month, and leap-year rules.
  - `validateReportTo(designation, reportToId)`: Ensures employees report only to their exact immediate superior role in the hierarchy and verifies that the supervisor exists.
  - `validateReportees(designation, reporteesIds)`: Ensures employees only manage individuals of their immediate subordinate role and verifies each reportee exists.
- **[`src/controller/curdController.ts`](src/controller/curdController.ts)**:
  - Houses the in-memory store: `employeesDB = new Map<string, Employee>()`.
  - `createEmployee(...)`: Validates input, checks duplicate IDs and multiple CEOs, and persists the record.
  - `getEmployee(id)` & `getAllEmployees()`: Retrieves single or all employees.
  - `updateEmployee(id, changes)`: Applies partial updates while keeping `id` and `designation` consistent, re-validates updated values.
  - `deleteEmployee(id)`: Verifies that the employee has no active reportees before deletion.
- **[`src/index.ts`](src/index.ts)**:
  - End-to-end integration script demonstrating positive and negative test cases for validations and CRUD flows.

---

## Design Approach & Architecture

1. **Separation of Concerns (SoC)**:
   - **Models**: Defines data shapes and domain contracts without side effects.
   - **Validators**: Pure validation functions concentrating business rules in one place, reusable across creation and update flows.
   - **Controllers**: Orchestrates storage operations, business logic invocation, and error handling.
   - **Entry Point**: Exercises the system like an integration test suite.

2. **In-Memory Store with $O(1)$ Lookups**:
   - Uses JavaScript's built-in `Map<string, Employee>`.
   - Provides efficient lookups, updates, and deletions by employee ID without external database dependencies.

3. **Fail-Fast Validation**:
   - Requests are validated prior to mutating the store. If an error occurs (such as an invalid date or an improper reporting relationship), an `Error` is thrown immediately, leaving existing data untouched.

4. **Type Safety & Immutability**:
   - The `Designation` union type eliminates invalid roles at compile time.
   - The `id` attribute is marked `readonly` on the `Employee` class. Update operations preserve the original designation to maintain hierarchy stability.

---

## Key Assumptions & Business Rules

1. **Strict Single-Level Hierarchy**:
   The organizational chain of command is strictly linear and one-to-one in levels:
   $$\text{CEO} \leftarrow \text{Director} \leftarrow \text{Manager} \leftarrow \text{Lead} \leftarrow \text{Engineer}$$
   - **Reports To Rule**:
     - `CEO` cannot report to anyone (`reportsTo = null`).
     - `Director` must report to an existing `CEO`.
     - `Manager` must report to an existing `Director`.
     - `Lead` must report to an existing `Manager`.
     - `Engineer` must report to an existing `Lead`.
   - **Reportees Rule**:
     - `CEO` may only have `Director` reportees.
     - `Director` may only have `Manager` reportees.
     - `Manager` may only have `Lead` reportees.
     - `Lead` may only have `Engineer` reportees.
     - `Engineer` cannot have any reportees (`reportees` must be `null` or `[]`).

2. **Single CEO Constraint**:
   Only one employee with designation `"CEO"` can exist in the organization at any given time.

3. **Referential Integrity on Deletion**:
   An employee cannot be deleted if their `reportees` list is non-empty. To delete an employee who manages others, their reportees must first be cleared or reassigned to another manager.

4. **Date Format**:
   - Dates of birth must follow the standard `mm/dd/yyyy` format (e.g., `02/29/2000`).
   - Leap years are calculated according to the Gregorian calendar (divisible by 4, except century years unless divisible by 400).

5. **Entity Identifiers**:
   - Employee IDs are strings (e.g., `"e1"`, `"emp-101"`).
   - IDs must be unique; duplicate IDs throw an error upon creation.

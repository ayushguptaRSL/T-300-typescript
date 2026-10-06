export type Designation = "Engineer" | "Lead" | "Manager" | "Director" | "CEO";

export class Employee {
    readonly id: string;
    name: string;
    dateOfBirth: string;
    designation: Designation;
    reportsTo: string | null = null;
    reportees: string[] | null = null;

    constructor(
        name: string,
        id: string,
        dateOfBirth: string,
        designation: Designation,
        reportsTo: string | null,
        reportees: string[] | null
    ) {
        this.name = name;
        this.id = id;
        this.dateOfBirth = dateOfBirth;
        this.designation = designation;
        this.reportsTo = reportsTo;
        this.reportees = reportees;
    }
}
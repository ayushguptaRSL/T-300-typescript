import { Designation } from "../models/Employee";
import { employeesDB } from "../controller/curdController";

export function validateReportTo(designation: Designation, reportToId: string | null): void {
    const expectedReportToDesignation = new Map<Designation, Designation | null>([
        ["Engineer", "Lead"],
        ["Lead", "Manager"],
        ["Manager", "Director"],
        ["Director", "CEO"],
        ["CEO", null],
    ]);

    const expectedDesignation = expectedReportToDesignation.get(designation);
    if (expectedDesignation === null) {
        if (reportToId !== null) {
            throw new Error("CEO doesn't report to anyone");
        }
        return;
    }

    if (reportToId === null) {
        throw new Error(`${designation} must report to a ${expectedDesignation}`);
    }

    const reportToDesignation = employeesDB.get(reportToId)?.designation
    if (!reportToDesignation || reportToDesignation !== expectedDesignation) {
        throw new Error(`${expectedDesignation} must report to an existing ${reportToDesignation}`);
    }
}

export function validateReportees(designation: Designation, reporteesIds: string[] | null): void {
    const expectedReportee: Record<Designation, Designation | null> = {
        Engineer: null,
        Lead: "Engineer",
        Manager: "Lead",
        Director: "Manager",
        CEO: "Director",
    };

    if (reporteesIds === null || reporteesIds.length == 0) {
        return;
    }

    const reporteeExpectedDesignation = expectedReportee[designation];
    if (reporteeExpectedDesignation === null) {
        throw new Error("An Engineer cannot have reportees");
    }

    for (const reporteeId of reporteesIds) {
        const reporteeDesignation = employeesDB.get(reporteeId)?.designation;
        if ( !reporteeDesignation || reporteeDesignation !== reporteeExpectedDesignation) {
            throw new Error(`Each reportee of a ${designation} must be an existing ${reporteeDesignation} reporting to that employee`);
        }
    }
}

export function validateEmployeeInfo(name: string, dateOfBirth: string): void {
    if (!name.trim()) {
        throw new Error("Employee name is required");
    }
    if (!isValidDateOfBirth(dateOfBirth)) {
        throw new Error("dateOfBirth must be a valid date in mm/dd/yyyy format");
    }
}

export function isValidDateOfBirth(value: string): boolean {
    const match = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/.exec(value);
    if (!match) {
        return false;
    }

    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);
    if (year === 0) {
        return false;
    }

    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day <= daysInMonth[month - 1];
}
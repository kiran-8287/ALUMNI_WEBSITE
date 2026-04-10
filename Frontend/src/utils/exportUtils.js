// utils/exportUtils.js

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Get selected alumni data
 */
export const getSelectedAlumni = (alumniData, selectedRows) => {
    return alumniData.filter((a) => selectedRows.has(a.id));
};

/**
 * Export to CSV
 */
export const exportToCSV = (data) => {
    const headers = [
        "CampusID",
        "Name",
        "Email",
        "Gender",
        "DateOfBirth",
        "PermanentAddress",
        "EmployeeSector",
        "CurrentCTC",
        "Department",
        "Degree",
        "YearOfPassOut",
        "ContactNumber1",
        "ContactNumber2",
        "WhatsAppNumber",
        "CountryCode",
        "LinkedinProfile",
        "Hostel",
        "Current_Location",
        "Organisation",
        "Designation",
        "Awards",
        "testimonial",
        "Placed",
        "Company",
        "Role",
        "Package",
        "PlacementYear",
        "Verified",
    ];

    const rows = data.map((a) => [
        a.CampusID,
        a.Name,
        a.Email,
        a.Gender,
        a.DateOfBirth,
        a.PermanentAddress,
        a.EmployeeSector,
        a.CurrentCTC,
        a.Department,
        a.Degree,
        a.YearOfPassOut,
        a.ContactNumber1,
        a.ContactNumber2,
        a.WhatsAppNumber,
        a.CountryCode,
        a.LinkedinProfile,
        a.Hostel,
        a.Current_Location,
        a.Organisation,
        a.Designation,
        a.Awards,
        a.testimonial,
        a.CampusPlacement ?.Placed ? "Yes" : "No",
        a.CampusPlacement ?.Company,
        a.CampusPlacement ?.Role,
        a.CampusPlacement ?.Package,
        a.CampusPlacement ?.Year,
        a.verified ? "Yes" : "No",
    ]);

    const csvContent =
        "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "alumni_selected.csv";
    link.click();
};

/**
 * Export to Excel
 */
export const exportToExcel = (data) => {
    const formatted = data.map((a) => ({
        CampusID: a.CampusID,
        Name: a.Name,
        Email: a.Email,
        Gender: a.Gender,
        DOB: a.DateOfBirth,
        Sector: a.EmployeeSector,
        CTC: a.CurrentCTC,
        Department: a.Department,
        Degree: a.Degree,
        Year: a.YearOfPassOut,
        Contact1: a.ContactNumber1,
        Contact2: a.ContactNumber2,
        WhatsApp: a.WhatsAppNumber,
        CountryCode: a.CountryCode,
        LinkedIn: a.LinkedinProfile,
        Hostel: a.Hostel,
        Location: a.Current_Location,
        Organisation: a.Organisation,
        Designation: a.Designation,
        Awards: a.Awards,
        Testimonial: a.testimonial,
        Placed: a.CampusPlacement ?.Placed ? "Yes" : "No",
        Company: a.CampusPlacement ?.Company,
        Role: a.CampusPlacement ?.Role,
        Package: a.CampusPlacement ?.Package,
        PlacementYear: a.CampusPlacement ?.Year,
        Verified: a.verified ? "Yes" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alumni");

    XLSX.writeFile(workbook, "alumni_selected.xlsx");
};

/**
 * Export to PDF
 */
export const exportToPDF = (data) => {
    const doc = new jsPDF();

    const tableData = data.map((a) => [
        a.Name,
        a.Email,
        a.Department,
        a.YearOfPassOut,
        a.EmployeeSector,
        a.CurrentCTC,
        a.verified ? "Yes" : "No",
    ]);

    autoTable(doc, {
        head: [
            ["Name", "Email", "Dept", "Year", "Sector", "CTC", "Verified"]
        ],
        body: tableData,
    });

    doc.save("alumni_selected.pdf");
};

import { utils, write } from "xlsx";
import { ReadingRecord } from "../types";

export const exportToExcel = (records: ReadingRecord[]): void => {
  try {
    // Format the data for Excel
    const worksheet = utils.json_to_sheet(
      records.map(record => ({
        Date: record.date,
        Time: record.time,
        "Read Text": record.text,
        WPM: record.wpm,
        Grade: record.grade
      }))
    );

    // Set column widths
    const columnWidths = [
      { wch: 12 },  // Date
      { wch: 10 },  // Time
      { wch: 50 },  // Read Text
      { wch: 8 },   // WPM
      { wch: 15 }   // Grade
    ];
    worksheet["!cols"] = columnWidths;

    // Create a new workbook and append the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Reading Records");

    // Generate the Excel file
    const currentDate = new Date().toISOString().split("T")[0];
    write(workbook, { 
      bookType: "xlsx", 
      bookSST: false, 
      type: "array" 
    });

    // Convert to blob and download
    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Reading_Assessment_${currentDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("Error exporting to Excel. Please try again.");
  }
};

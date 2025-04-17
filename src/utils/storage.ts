
import { ReadingRecord } from "../types";

const STORAGE_KEY = "reading_records";

// Get all reading records from local storage
export const getReadingRecords = (): ReadingRecord[] => {
  try {
    const records = localStorage.getItem(STORAGE_KEY);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error("Error getting reading records:", error);
    return [];
  }
};

// Save a new reading record
export const saveReadingRecord = (record: ReadingRecord): void => {
  try {
    const records = getReadingRecords();
    
    // Limit to 40 records, remove oldest if needed
    if (records.length >= 40) {
      records.shift(); // Remove the oldest record
    }
    
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    console.log("Record saved successfully:", record);
  } catch (error) {
    console.error("Error saving reading record:", error);
  }
};

// Clear all reading records
export const clearReadingRecords = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing reading records:", error);
  }
};


export interface ReadingRecord {
  id: string;
  date: string;
  time: string;
  text: string;
  wpm: number;
  grade: string;
}

export const gradeRanges = [
  { grade: "First grade", min: 35, max: 59 },
  { grade: "Second grade", min: 60, max: 84 },
  { grade: "Third grade", min: 85, max: 99 },
  { grade: "Fourth grade", min: 100, max: 114 },
  { grade: "Fifth grade", min: 115, max: 124 },
  { grade: "Sixth grade", min: 125, max: 134 },
];

export function determineGrade(wpm: number): string {
  if (wpm < 35) return "Below First grade";
  
  for (const range of gradeRanges) {
    if (wpm >= range.min && wpm <= range.max) {
      return range.grade;
    }
  }
  
  return "Above Sixth grade";
}

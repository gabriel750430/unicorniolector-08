
export interface ReadingRecord {
  id: string;
  date: string;
  time: string;
  text: string;
  wpm: number;
  grade: string;
}

export const gradeRanges = [
  { grade: "Primer grado", min: 35, max: 59 },
  { grade: "Segundo grado", min: 60, max: 84 },
  { grade: "Tercer grado", min: 85, max: 99 },
  { grade: "Cuarto grado", min: 100, max: 114 },
  { grade: "Quinto grado", min: 115, max: 124 },
  { grade: "Sexto grado", min: 125, max: 134 },
];

export function determineGrade(wpm: number): string {
  if (wpm < 35) return "Por debajo de primer grado";
  
  for (const range of gradeRanges) {
    if (wpm >= range.min && wpm <= range.max) {
      return range.grade;
    }
  }
  
  return "Por encima de sexto grado";
}

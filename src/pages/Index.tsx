
import React, { useState, useEffect } from "react";
import ReadingAssessment from "@/components/ReadingAssessment";
import ReadingRecords from "@/components/ReadingRecords";
import GradeChart from "@/components/GradeChart";
import { getReadingRecords } from "@/utils/storage";
import { ReadingRecord } from "@/types";

const Index = () => {
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [currentWpm, setCurrentWpm] = useState<number | null>(null);

  // Load records on component mount
  useEffect(() => {
    const storedRecords = getReadingRecords();
    setRecords(storedRecords);
    
    // Set current WPM to the most recent record if it exists
    if (storedRecords.length > 0) {
      setCurrentWpm(storedRecords[storedRecords.length - 1].wpm);
    }
  }, []);

  return (
    <div className="container py-8 px-4 md:px-8 mx-auto">
      <ReadingAssessment />
      <GradeChart currentWpm={currentWpm} />
      <ReadingRecords records={records} />
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>© 2025 Lectura Rápida MX - Herramienta de evaluación de lectura para estudiantes de primaria</p>
      </footer>
    </div>
  );
};

export default Index;


import React, { useState, useEffect } from "react";
import ReadingAssessment from "@/components/ReadingAssessment";
import ReadingRecords from "@/components/ReadingRecords";
import GradeChart from "@/components/GradeChart";
import { getReadingRecords } from "@/utils/storage";
import { ReadingRecord } from "@/types";

const Index = () => {
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [currentWpm, setCurrentWpm] = useState<number | null>(null);
  const [showGradeChart, setShowGradeChart] = useState<boolean>(false);

  useEffect(() => {
    const storedRecords = getReadingRecords();
    setRecords(storedRecords);
    
    if (storedRecords.length > 0) {
      setCurrentWpm(storedRecords[storedRecords.length - 1].wpm);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-kid-blue/20 p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-kid-purple drop-shadow-lg">
            Lectorcitos 🚀
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Divertida herramienta de lectura para estudiantes de primaria
          </p>
        </div>

        <ReadingAssessment />
        <GradeChart currentWpm={currentWpm} visible={showGradeChart} />
        <ReadingRecords records={records} />
        
        <footer className="text-center text-sm text-gray-500 mt-8">
          © 2025 Lectorcitos
        </footer>
      </div>
    </div>
  );
};

export default Index;

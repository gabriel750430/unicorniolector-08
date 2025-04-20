
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReadingAssessment from "@/components/ReadingAssessment";
import GradeChart from "@/components/GradeChart";
import { getReadingRecords } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const Index = () => {
  const [currentWpm, setCurrentWpm] = useState<number | null>(null);
  const [showGradeChart, setShowGradeChart] = useState<boolean>(false);

  useEffect(() => {
    const storedRecords = getReadingRecords();
    if (storedRecords.length > 0) {
      setCurrentWpm(storedRecords[storedRecords.length - 1].wpm);
    }
  }, []);

  // Listen for storage changes to update current WPM when records change
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRecords = getReadingRecords();
      if (updatedRecords.length > 0) {
        setCurrentWpm(updatedRecords[updatedRecords.length - 1].wpm);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-kid-blue/20 p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <img 
              src="/lovable-uploads/86393407-127a-45dc-b56c-8e88e228f8bd.png" 
              alt="UnicornioLector Logo" 
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl font-bold text-kid-purple drop-shadow-lg">
              UnicornioLector 🦄
            </h1>
          </div>
          <p className="text-xl text-gray-600 mt-2">
            Divertida herramienta de lectura para estudiantes de primaria
          </p>
          <p className="text-lg text-gray-700 mt-2 font-semibold">
            ¡Pon a prueba tu habilidad para leer! ¡¡Es un Reto!!
          </p>
        </div>

        <ReadingAssessment />
        <GradeChart currentWpm={currentWpm} visible={showGradeChart} />
        
        <div className="flex justify-center mt-8">
          <Link to="/about">
            <Button variant="outline" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Acerca de UnicornioLector
            </Button>
          </Link>
        </div>
        
        <footer className="text-center text-sm text-gray-500 mt-8">
          © 2025 UnicornioLector
        </footer>
      </div>
    </div>
  );
};

export default Index;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Info } from 'lucide-react';
import ReadingAssessment from '@/components/ReadingAssessment';
import ReadingRecords from '@/components/ReadingRecords';
import GradeChart from '@/components/GradeChart';
import ShareApp from '@/components/ShareApp';
import { Button } from '@/components/ui/button';
import { getReadingRecords } from '@/utils/storage';
import { ReadingRecord } from '@/types';

const Index = () => {
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [currentWpm, setCurrentWpm] = useState<number | null>(null);

  // Load records from storage
  useEffect(() => {
    const storedRecords = getReadingRecords();
    setRecords(storedRecords);
  }, []);

  // Handle when new reading assessment is saved
  const handleAssessmentComplete = (wpm: number) => {
    setCurrentWpm(wpm);
    // Refresh records after a new assessment
    const updatedRecords = getReadingRecords();
    setRecords(updatedRecords);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white">
      <header className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-7 w-7" />
            <h1 className="text-2xl font-bold">Unicornio Lector</h1>
          </div>
          <div className="flex items-center gap-2">
            <ShareApp />
            <Link to="/about">
              <Button variant="ghost" size="icon" className="text-white">
                <Info className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <ReadingAssessment onSaveRecord={handleAssessmentComplete} />
          </div>
          <div className="space-y-8">
            <GradeChart currentWpm={currentWpm} visible={currentWpm !== null} />
            <ReadingRecords records={records} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

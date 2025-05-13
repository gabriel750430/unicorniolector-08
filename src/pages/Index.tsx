
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Info } from 'lucide-react';
import ReadingAssessment from '@/components/ReadingAssessment';
import ReadingRecords from '@/components/ReadingRecords';
import GradeChart from '@/components/GradeChart';
import ShareApp from '@/components/ShareApp';
import { Button } from '@/components/ui/button';

const Index = () => {
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
            <ReadingAssessment />
          </div>
          <div className="space-y-8">
            <GradeChart />
            <ReadingRecords />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

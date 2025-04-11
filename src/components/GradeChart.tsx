
import React from "react";
import { Card } from "@/components/ui/card";
import { gradeRanges } from "@/types";

interface GradeChartProps {
  currentWpm: number | null;
}

const GradeChart: React.FC<GradeChartProps> = ({ currentWpm }) => {
  return (
    <Card className="w-full max-w-3xl p-6 mt-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Niveles de Velocidad de Lectura</h2>
      <div className="space-y-3">
        {gradeRanges.map((range, index) => {
          const isCurrentGrade = currentWpm !== null && 
            currentWpm >= range.min && currentWpm <= range.max;
          
          return (
            <div key={index} className="flex items-center">
              <div className="w-1/3 text-sm font-medium">
                {range.grade}:
              </div>
              <div className="w-2/3 flex items-center">
                <div className="flex-1 bg-secondary h-8 rounded-md relative">
                  <div 
                    className={`absolute inset-0 rounded-md ${
                      isCurrentGrade ? "bg-primary opacity-25" : ""
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center justify-start px-2 text-xs">
                    {range.min} WPM
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center justify-end px-2 text-xs">
                    {range.max} WPM
                  </div>
                  {isCurrentGrade && (
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-primary"
                      style={{
                        left: `${((currentWpm - range.min) / (range.max - range.min)) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="absolute -top-6 -translate-x-1/2 bg-primary text-primary-foreground rounded px-1 py-0.5 text-xs">
                        {currentWpm}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default GradeChart;

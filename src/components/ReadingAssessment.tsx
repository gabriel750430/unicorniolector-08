
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mic, FileSpreadsheet, Database, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReadingRecord, determineGrade } from "@/types";
import { getReadingRecords, saveReadingRecord, clearReadingRecords } from "@/utils/storage";
import { exportToExcel } from "@/utils/excelExport";
import speechRecognition from "@/utils/speechRecognition";

const ReadingAssessment: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [result, setResult] = useState<{ wpm: number; grade: string } | null>(null);
  const { toast } = useToast();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Load records on component mount
  useEffect(() => {
    const storedRecords = getReadingRecords();
    setRecords(storedRecords);
  }, []);

  // Handle starting the recording
  const handleStartRecording = () => {
    // Clear previous results
    setResult(null);
    
    // Check if speech recognition is supported
    if (!speechRecognition.isSupported()) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    // Start recording
    const success = speechRecognition.start((text) => {
      setTranscription(text);
    });

    if (success) {
      setIsRecording(true);
      setTranscription("");
      toast({
        title: "Recording Started",
        description: "The microphone is now active. Start reading.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle stopping the recording
  const handleStopRecording = () => {
    if (!isRecording) return;

    const { text, elapsedTime } = speechRecognition.stop();
    setIsRecording(false);
    
    // Calculate words per minute
    const wpm = speechRecognition.calculateWPM(text, elapsedTime);
    const grade = determineGrade(wpm);
    
    // Set the result
    setResult({ wpm, grade });
    
    // Save the record
    const now = new Date();
    const record: ReadingRecord = {
      id: Date.now().toString(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      text,
      wpm,
      grade,
    };
    
    saveReadingRecord(record);
    setRecords([...records, record]);
    
    toast({
      title: "Reading Completed",
      description: `Reading speed: ${wpm} WPM (${grade})`,
    });
  };

  // Handle restarting the reading
  const handleRestartReading = () => {
    setTranscription("");
    setResult(null);
  };

  // Handle exporting to Excel
  const handleExportToExcel = () => {
    if (records.length === 0) {
      toast({
        title: "No Records",
        description: "There are no reading records to export.",
        variant: "destructive",
      });
      return;
    }
    
    exportToExcel(records);
    toast({
      title: "Export Successful",
      description: "Reading records exported to Excel file.",
    });
  };

  // Handle resetting the database
  const handleResetDatabase = () => {
    clearReadingRecords();
    setRecords([]);
    toast({
      title: "Database Reset",
      description: "All reading records have been deleted.",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-full max-w-3xl p-6 shadow-lg">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Lectura Rápida MX</h1>
          <p className="text-center text-muted-foreground">
            Herramienta de evaluación de lectura para estudiantes de primaria
          </p>
          
          {/* Recording Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            {!isRecording ? (
              <Button 
                size="lg" 
                className="w-full sm:w-auto gap-2" 
                onClick={handleStartRecording}
              >
                <Mic className="h-5 w-5" />
                Iniciar Lectura
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="destructive" 
                className="w-full sm:w-auto gap-2" 
                onClick={handleStopRecording}
              >
                <div className="recording-indicator mr-2" />
                Detener Lectura
              </Button>
            )}
            
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto gap-2" 
              onClick={handleRestartReading}
              disabled={isRecording}
            >
              <RefreshCw className="h-5 w-5" />
              Reiniciar Lectura
            </Button>
          </div>
          
          {/* Transcription Area */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">Texto Transcrito</h2>
              {isRecording && (
                <span className="flex items-center text-sm text-red-500">
                  <div className="recording-indicator mr-2" />
                  Grabando...
                </span>
              )}
            </div>
            <textarea
              ref={textAreaRef}
              className="w-full h-40 md:h-60 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={transcription}
              readOnly
              placeholder="La transcripción aparecerá aquí mientras el estudiante lee..."
            />
          </div>
          
          {/* Result Display */}
          {result && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="text-lg font-medium">Resultado</h3>
              <div className="flex flex-col sm:flex-row justify-between mt-2">
                <div>
                  <p className="text-sm font-medium">Velocidad de lectura:</p>
                  <p className="text-2xl font-bold">{result.wpm} WPM</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Nivel de grado:</p>
                  <p className="text-2xl font-bold">{result.grade}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Database Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto gap-2" 
              onClick={handleExportToExcel}
            >
              <FileSpreadsheet className="h-5 w-5" />
              Exportar a Excel
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto gap-2 text-destructive border-destructive hover:bg-destructive/10"
                >
                  <Database className="h-5 w-5" />
                  Resetear Base de Datos
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminarán todos los registros de lectura guardados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetDatabase}>
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          {/* Records Count */}
          <div className="text-center mt-4 text-sm text-muted-foreground">
            {records.length > 0 ? (
              <p>Registros guardados: {records.length} de 40</p>
            ) : (
              <p>No hay registros guardados</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReadingAssessment;


import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { Mic, FileSpreadsheet, Database, RefreshCw, Save } from "lucide-react";
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
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [timerActive, setTimerActive] = useState(false);
  const { toast } = useToast();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load records on component mount
  useEffect(() => {
    const storedRecords = getReadingRecords();
    setRecords(storedRecords);
  }, []);

  // Handle timer countdown
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      // Time's up, stop recording
      handleStopRecording();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerActive, timeLeft]);

  // Handle starting the recording
  const handleStartRecording = () => {
    // Clear previous results
    setResult(null);
    
    // Reset timer
    setTimeLeft(60);
    
    // Check if speech recognition is supported
    if (!speechRecognition.isSupported()) {
      toast({
        title: "No Compatible",
        description: "El reconocimiento de voz no es compatible con este navegador.",
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
      setTimerActive(true);
      setTranscription("");
      toast({
        title: "Grabación Iniciada",
        description: "El micrófono está activo. Comienza la lectura.",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo iniciar la grabación. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Handle stopping the recording
  const handleStopRecording = () => {
    if (!isRecording) return;

    // Stop the timer
    setTimerActive(false);
    
    const { text, elapsedTime } = speechRecognition.stop();
    setIsRecording(false);
    
    // Calculate words per minute
    const wpm = speechRecognition.calculateWPM(text, elapsedTime);
    const grade = determineGrade(wpm);
    
    // Set the result
    setResult({ wpm, grade });
  };

  // Handle saving the record
  const handleSaveRecord = () => {
    if (!result) {
      toast({
        title: "Error",
        description: "No hay resultados para guardar. Realiza una lectura primero.",
        variant: "destructive",
      });
      return;
    }

    // Create new record
    const now = new Date();
    const record: ReadingRecord = {
      id: Date.now().toString(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      text: transcription,
      wpm: result.wpm,
      grade: result.grade,
    };
    
    // Save the record
    saveReadingRecord(record);
    
    // Update local state
    const updatedRecords = getReadingRecords();
    setRecords(updatedRecords);
    
    toast({
      title: "Registro Guardado",
      description: `Se ha guardado el registro de lectura con ${result.wpm} PPM.`,
    });
  };

  // Handle restarting the reading
  const handleRestartReading = () => {
    setTranscription("");
    setResult(null);
    setTimeLeft(60);
    setTimerActive(false);
  };

  // Handle exporting to Excel
  const handleExportToExcel = () => {
    if (records.length === 0) {
      toast({
        title: "Sin Registros",
        description: "No hay registros de lectura para exportar.",
        variant: "destructive",
      });
      return;
    }
    
    exportToExcel(records);
    toast({
      title: "Exportación Exitosa",
      description: "Registros de lectura exportados a archivo Excel.",
    });
  };

  // Handle resetting the database
  const handleResetDatabase = () => {
    clearReadingRecords();
    setRecords([]);
    toast({
      title: "Base de Datos Reiniciada",
      description: "Todos los registros de lectura han sido eliminados.",
    });
  };

  // Calculate progress percentage for the timer
  const progressPercentage = (timeLeft / 60) * 100;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-full max-w-3xl p-6 shadow-lg">
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Lectura Rápida MX</h1>
          <p className="text-center text-muted-foreground">
            Herramienta de evaluación de lectura para estudiantes de primaria
          </p>
          
          {/* Timer Display */}
          {(isRecording || timeLeft < 60) && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Tiempo restante: {timeLeft} segundos</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
          
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
                  <p className="text-2xl font-bold">{result.wpm} PPM</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Save Button */}
          {result && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="default" 
                className="gap-2" 
                onClick={handleSaveRecord}
              >
                <Save className="h-5 w-5" />
                Guardar Registro
              </Button>
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

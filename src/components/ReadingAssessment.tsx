import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
import { Mic, FileSpreadsheet, Database, RefreshCw, Save, GraduationCap, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReadingRecord, determineGrade, schoolGrades, evaluatePerformance } from "@/types";
import { getReadingRecords, saveReadingRecord, clearReadingRecords } from "@/utils/storage";
import { exportToExcel } from "@/utils/excelExport";
import speechRecognition from "@/utils/speechRecognition";

const ReadingAssessment: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [result, setResult] = useState<{ wpm: number; grade: string; performance: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [timerActive, setTimerActive] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [schoolGrade, setSchoolGrade] = useState("");
  const { toast } = useToast();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedRecords = getReadingRecords();
    setRecords(storedRecords);
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      handleStopRecording();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerActive, timeLeft]);

  const handleStartRecording = () => {
    if (!studentName.trim()) {
      toast({
        title: "Nombre Requerido",
        description: "Por favor, ingresa el nombre del estudiante.",
        variant: "destructive",
      });
      return;
    }

    if (!schoolGrade) {
      toast({
        title: "Grado Escolar Requerido",
        description: "Por favor, selecciona el grado escolar del estudiante.",
        variant: "destructive",
      });
      return;
    }

    setResult(null);
    
    setTimeLeft(60);
    
    if (!speechRecognition.isSupported()) {
      toast({
        title: "No Compatible",
        description: "El reconocimiento de voz no es compatible con este navegador.",
        variant: "destructive",
      });
      return;
    }

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

  const handleStopRecording = () => {
    if (!isRecording) return;

    setTimerActive(false);
    
    const { text, elapsedTime } = speechRecognition.stop();
    setIsRecording(false);
    
    const wpm = speechRecognition.calculateWPM(text, elapsedTime);
    const grade = determineGrade(wpm);
    const performance = evaluatePerformance(wpm, schoolGrade);
    
    setResult({ wpm, grade, performance });
  };

  const handleSaveRecord = () => {
    if (!result) {
      toast({
        title: "Error",
        description: "No hay resultados para guardar. Realiza una lectura primero.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const record: ReadingRecord = {
      id: Date.now().toString(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      text: transcription,
      wpm: result.wpm,
      grade: result.grade,
      studentName: studentName,
      schoolGrade: schoolGrade,
      performance: result.performance
    };
    
    saveReadingRecord(record);
    
    const updatedRecords = getReadingRecords();
    setRecords(updatedRecords);
    
    toast({
      title: "Registro Guardado",
      description: `Se ha guardado el registro de lectura de ${studentName} con ${result.wpm} PPM.`,
    });
  };

  const handleRestartReading = () => {
    setTranscription("");
    setResult(null);
    setTimeLeft(60);
    setTimerActive(false);
    setStudentName("");
    setSchoolGrade("");
  };

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

  const handleResetDatabase = () => {
    clearReadingRecords();
    setRecords([]);
    toast({
      title: "Base de Datos Reiniciada",
      description: "Todos los registros de lectura han sido eliminados.",
    });
  };

  const progressPercentage = (timeLeft / 60) * 100;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card className="w-full max-w-3xl p-6 shadow-lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">Nombre del Alumno</Label>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <Input 
                  id="student-name" 
                  placeholder="Ingresa el nombre completo" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  disabled={isRecording}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="school-grade">Grado Escolar</Label>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <Select 
                  value={schoolGrade} 
                  onValueChange={setSchoolGrade}
                  disabled={isRecording}
                >
                  <SelectTrigger id="school-grade" className="w-full">
                    <SelectValue placeholder="Selecciona el grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolGrades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {(isRecording || timeLeft < 60) && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Tiempo restante: {timeLeft} segundos</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
          
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
          
          {result && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="text-lg font-medium">Resultado</h3>
              <div className="flex flex-col sm:flex-row justify-between mt-2">
                <div>
                  <p className="text-sm font-medium">Velocidad de lectura:</p>
                  <p className="text-2xl font-bold">{result.wpm} PPM</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p className="text-sm font-medium">Desempeño:</p>
                  <p className="text-md font-semibold">{result.performance}</p>
                </div>
              </div>
            </div>
          )}
          
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


import React, { useState } from 'react';
import { Share } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ShareApp = () => {
  const [open, setOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [copied, setCopied] = useState(false);

  const appUrl = window.location.href;
  const appPlayStoreUrl = "https://play.google.com/store/apps/details?id=com.unicorniolector.app";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace ha sido copiado al portapapeles",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Unicornio Lector",
        text: "Te comparto esta aplicación para evaluar la lectura de estudiantes de primaria",
        url: appUrl,
      })
      .then(() => {
        toast({
          title: "¡Compartido!",
          description: "La aplicación ha sido compartida exitosamente",
        });
      })
      .catch((error) => console.log("Error sharing:", error));
    } else {
      handleCopyLink();
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailInput || !emailInput.includes('@')) {
      toast({
        title: "Error",
        description: "Por favor, introduce un correo electrónico válido",
        variant: "destructive",
      });
      return;
    }

    // En un escenario real, aquí enviarías un correo electrónico con el enlace
    // Simulación de envío exitoso
    toast({
      title: "¡Invitación enviada!",
      description: `Se ha enviado una invitación a ${emailInput}`,
    });
    
    setEmailInput("");
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Share className="h-4 w-4 mr-2" /> Compartir
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartir Unicornio Lector</DialogTitle>
            <DialogDescription>
              Invita a otros docentes a utilizar esta aplicación para evaluación de lectura
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="link">Enlace</TabsTrigger>
              <TabsTrigger value="email">Correo</TabsTrigger>
              <TabsTrigger value="qr">QR</TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input 
                  value={appUrl} 
                  readOnly 
                  className="flex-1"
                />
                <Button variant="secondary" onClick={handleCopyLink}>
                  {copied ? "¡Copiado!" : "Copiar"}
                </Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">También puedes compartir directamente:</p>
                <Button onClick={handleShare} className="w-full">
                  <Share className="mr-2 h-4 w-4" /> Compartir ahora
                </Button>
              </div>
              
              <div className="flex flex-col gap-2 mt-4">
                <p className="text-sm text-muted-foreground">O descargar desde Google Play:</p>
                <Button variant="outline" onClick={() => window.open(appPlayStoreUrl, '_blank')}>
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/es_badge_web_generic.png" alt="Google Play" className="h-8" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-2">
              <form onSubmit={handleSendEmail}>
                <div className="flex flex-col gap-4">
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium">
                      Correo electrónico
                    </label>
                    <Input
                      id="email"
                      placeholder="correo@ejemplo.com"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Enviar invitación</Button>
                </div>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Se enviará un enlace para acceder a la aplicación
              </p>
            </TabsContent>
            
            <TabsContent value="qr" className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-md">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`} 
                  alt="QR Code" 
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-center mt-4 text-muted-foreground">
                Escanea este código QR con tu dispositivo móvil para acceder a la aplicación
              </p>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareApp;

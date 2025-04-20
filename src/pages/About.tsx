
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-kid-blue/20 p-4">
      <div className="w-full max-w-4xl space-y-6 bg-white rounded-lg shadow-md p-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <img 
              src="/lovable-uploads/86393407-127a-45dc-b56c-8e88e228f8bd.png" 
              alt="UnicornioLector Logo" 
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-3xl font-bold text-kid-purple">
              UnicornioLector 🦄
            </h1>
          </div>
          <p className="text-xl text-gray-600 mt-4">Versión 1.0.0</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-kid-purple">Acerca de la aplicación</h2>
          <p className="text-gray-700">
            UnicornioLector es una aplicación educativa diseñada para ayudar a estudiantes de primaria en México a mejorar sus habilidades de lectura.
          </p>
          
          <h2 className="text-2xl font-semibold text-kid-purple mt-6">Características</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Evaluación de velocidad de lectura en palabras por minuto</li>
            <li>Gráficos de progreso</li>
            <li>Interfaz amigable para niños</li>
            <li>Compatible con dispositivos móviles</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-kid-purple mt-6">Política de Privacidad</h2>
          <p className="text-gray-700">
            UnicornioLector no recopila ni almacena información personal de los usuarios. Todos los datos de lecturas se guardan localmente en el dispositivo del usuario.
          </p>
          
          <h2 className="text-2xl font-semibold text-kid-purple mt-6">Contacto</h2>
          <p className="text-gray-700">
            Para soporte o consultas, contacte a través de correo electrónico: 
            <a href="mailto:unicorniolector@example.com" className="text-blue-600 ml-1">
              unicorniolector@example.com
            </a>
          </p>
        </div>
        
        <footer className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
          © 2025 UnicornioLector - Todos los derechos reservados
        </footer>
      </div>
    </div>
  );
};

export default About;

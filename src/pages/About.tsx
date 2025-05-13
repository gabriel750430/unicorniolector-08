
import { ArrowLeft, Book, Share } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ShareApp from "@/components/ShareApp";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 to-white">
      <header className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-7 w-7" />
            <h1 className="text-2xl font-bold">Unicornio Lector</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Regresar
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-violet-700 mb-4">Acerca de Unicornio Lector</h2>
            <p className="text-gray-700 mb-4">
              Unicornio Lector es una aplicación diseñada para ayudar a los docentes de primaria en México
              a evaluar y registrar la velocidad de lectura de sus estudiantes, conforme a los estándares
              educativos mexicanos.
            </p>
            <p className="text-gray-700 mb-4">
              La aplicación permite medir las Palabras por Minuto (PPM) que un estudiante puede leer,
              y evalúa su desempeño de acuerdo a los rangos establecidos para cada grado escolar.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-violet-700 mb-4">Cómo compartir con otros docentes</h2>
            <p className="text-gray-700 mb-4">
              ¿Quieres que tus colegas también utilicen Unicornio Lector? Puedes compartir la aplicación
              de diferentes maneras:
            </p>
            
            <div className="flex justify-center my-6">
              <ShareApp />
            </div>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Comparte el enlace directo a través de WhatsApp o correo electrónico</li>
              <li>Envía una invitación por correo electrónico directamente desde la aplicación</li>
              <li>Muestra el código QR para que otros docentes puedan escanearlo</li>
              <li>Comparte el enlace a la versión de Google Play (próximamente)</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-violet-700 mb-4">Rangos de evaluación</h2>
            <p className="text-gray-700 mb-4">
              Los rangos estándar de Palabras por Minuto (PPM) para cada grado escolar son:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-violet-100">
                    <th className="py-2 px-4 border-b border-gray-200 text-left">Grado</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">Palabras por Minuto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">1er Grado</td>
                    <td className="py-2 px-4 border-b border-gray-200">35 - 59</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">2do Grado</td>
                    <td className="py-2 px-4 border-b border-gray-200">60 - 84</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">3er Grado</td>
                    <td className="py-2 px-4 border-b border-gray-200">85 - 99</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">4to Grado</td>
                    <td className="py-2 px-4 border-b border-gray-200">100 - 114</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">5to Grado</td>
                    <td className="py-2 px-4 border-b border-gray-200">115 - 124</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200">6to Grado</td>
                    <td className="py-2 px-4 border-b border-gray-200">125 - 134</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Versión 1.0 - Desarrollado por Unicornio Lector</p>
            <p>© 2025 Todos los derechos reservados</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;

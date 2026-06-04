import { createContext, useState } from 'react';

// 1. Creamos el "Contexto". Imagínalo como una caja vacía que existirá en toda la app.
export const AppContext = createContext<any>(null);

// 2. Creamos el "Proveedor". Es el componente que envuelve a toda la aplicación 
// para inyectar los datos de la caja (el historial) a cualquier pantalla que lo pida.
export const AppProvider = ({ children }: any) => {
  // Estado local del proveedor: aquí vive el arreglo de diagnósticos guardados.
  const [historial, setHistorial] = useState<any[]>([]);
  
  return (
    // Exponemos la variable 'historial' y la función 'setHistorial' al resto de la app
    <AppContext.Provider value={{ historial, setHistorial }}>
      {children} 
    </AppContext.Provider>
  );
};
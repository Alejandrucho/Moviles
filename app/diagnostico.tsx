import { useState, useContext } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, TextInput } from 'react-native';
// Importamos la "caja" de datos globales (El Contexto)
import { AppContext } from './context'; 
// Cargamos nuestra base de datos local (Persistencia JSON)
import data from '../assets/enfermedades.json'; 

export default function Diagnostico() {
  // --- ESTADOS LOCALES DE LA PANTALLA ---
  const [sintomasSeleccionados, setSintomasSeleccionados] = useState<string[]>([]); // Guarda lo que el usuario toca
  const [resultado, setResultado] = useState<any[] | null>(null); // Guarda el Top 3 calculado
  const [comentario, setComentario] = useState(''); // Guarda el texto escrito
  
  // Extraemos la función para modificar el historial global desde nuestro AppContext
  const { setHistorial } = useContext(AppContext);

  // --- LÓGICA DE DATOS ---
  // Extraemos todos los síntomas del JSON, los unimos (flatMap) y eliminamos duplicados (Set)
  const listaSintomas = Array.from(new Set(data.flatMap((e) => e.sintomas)));

  // Función que se ejecuta al tocar un síntoma
  const toggleSintoma = (sintoma: string) => {
    setSintomasSeleccionados(prev => 
      // Si ya estaba seleccionado, lo quitamos. Si no, lo agregamos.
      prev.includes(sintoma) ? prev.filter(s => s !== sintoma) : [...prev, sintoma]
    );
  };

  // Motor del diagnóstico: Compara los arrays
  const realizarDiagnostico = () => {
    const analizados = data.map(enfermedad => {
      // Intersección: ¿Qué síntomas de la enfermedad tiene el usuario?
      const coincidencias = enfermedad.sintomas.filter(s => sintomasSeleccionados.includes(s));
      // Regla de 3 para el porcentaje
      const porcentaje = (coincidencias.length / enfermedad.sintomas.length) * 100;
      return { ...enfermedad, porcentaje };
    });

    // Filtramos, ordenamos de mayor a menor probabilidad y tomamos los primeros 3
    const top3 = analizados
      .filter(e => e.porcentaje > 0)
      .sort((a, b) => b.porcentaje - a.porcentaje)
      .slice(0, 3);
      
    setResultado(top3); // Guardamos el top 3 para mostrarlo en pantalla
  };

  // Función para guardar en el estado global
  const guardarEnHistorial = () => {
    if (resultado && resultado.length > 0) {
      // Agregamos el nuevo registro sin borrar los anteriores (...prev)
      setHistorial((prev: any) => [
        ...prev, 
        { 
          enfermedades: resultado, 
          comentario, 
          fecha: new Date().toLocaleDateString() // Fecha automática
        }
      ]);
      alert("¡Diagnóstico y comentario guardados en el historial!");
      setComentario(''); // Limpiamos el input
    }
  };

  // --- INTERFAZ GRÁFICA (UI) ---
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.tituloHeader}>Análisis de Síntomas</Text>
      <Text style={styles.subtitulo}>Selecciona los signos visibles en la piel:</Text>
      
      {/* Mapeo de botones (Chips) de síntomas */}
      <View style={styles.chipsContainer}>
        {listaSintomas.map((s, i) => (
          <TouchableOpacity 
            key={i} 
            style={[styles.chip, sintomasSeleccionados.includes(s) && styles.chipActive]} 
            onPress={() => toggleSintoma(s)}
          >
            <Text style={[styles.chipText, sintomasSeleccionados.includes(s) && styles.chipTextActive]}>
              {s.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Button title="Analizar Piel" onPress={realizarDiagnostico} color="#3498db" />

      {/* Renderizado Condicional: Solo muestra los resultados si existen */}
      {resultado && resultado.length > 0 && (
        <Text style={styles.seccionTitulo}>Resultados más probables:</Text>
      )}

      {/* Recorremos el Top 3 y mostramos una tarjeta por cada enfermedad */}
      {resultado && resultado.map((item: any, index: number) => (
        <View key={index} style={styles.resultadoCard}>
          <Text style={styles.resNombre}>
            {index + 1}. {item.nombre} ({item.porcentaje.toFixed(0)}%)
          </Text>
          <Text style={styles.resDesc}>{item.descripcion}</Text>
          <Text style={styles.resConsejo}>Consejo: {item.consejo}</Text>
        </View>
      ))}

      {/* Mensaje de error si marca algo que no coincide con nada */}
      {resultado && resultado.length === 0 && (
        <Text style={styles.noResultado}>No se encontraron coincidencias. Intenta marcar otros síntomas.</Text>
      )}

      {/* Caja de texto para guardar en el historial */}
      {resultado && resultado.length > 0 && (
        <View style={styles.cajaGuardar}>
          <Text style={styles.labelInput}>Notas o evolución del caso:</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ej: La picazón aumentó por la tarde..." 
            value={comentario} 
            onChangeText={setComentario} 
            multiline
          />
          <Button title="Guardar en Historial" onPress={guardarEnHistorial} color="#27ae60" />
        </View>
      )}
    </ScrollView>
  );
}

// --- HOJA DE ESTILOS (El causante de tu error si falta) ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffffff' },
  tituloHeader: { fontSize: 24, fontWeight: 'bold', fontFamily: 'serif', color: '#2c3e50' },
  subtitulo: { fontSize: 14, color: '#7f8c8d', fontFamily: 'sans-serif', marginBottom: 15 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#f0f2f5', borderRadius: 20, margin: 5 },
  chipActive: { backgroundColor: '#3498db' },
  chipText: { textTransform: 'capitalize', color: '#555', fontFamily: 'sans-serif', fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  seccionTitulo: { fontSize: 18, fontWeight: 'bold', fontFamily: 'serif', marginTop: 25, marginBottom: 10, color: '#2c3e50' },
  resultadoCard: { marginTop: 12, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#e9ecef' },
  resNombre: { fontSize: 16, fontWeight: 'bold', color: '#2980b9', fontFamily: 'serif', marginBottom: 4 },
  resDesc: { color: '#666', fontFamily: 'sans-serif', fontSize: 14, lineHeight: 20 },
  resConsejo: { fontStyle: 'italic', color: '#2c3e50', fontFamily: 'sans-serif', fontSize: 13, marginTop: 6 },
  cajaGuardar: { marginTop: 25 },
  labelInput: { fontSize: 14, fontWeight: '600', fontFamily: 'sans-serif', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginTop: 6, marginBottom: 15, borderRadius: 8, backgroundColor: '#fff', fontFamily: 'sans-serif', textAlignVertical: 'top', minHeight: 60 },
  noResultado: { marginTop: 20, color: '#e74c3c', textAlign: 'center', fontFamily: 'sans-serif' }
});
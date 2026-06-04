import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useContext } from 'react';
// Importamos el contexto global para poder leer los datos almacenados
import { AppContext } from './context'; 

export default function Historial() {
  // Consumimos el estado global. Aquí solo necesitamos 'historial' (la variable de lectura)
  const { historial } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historial de Consultas</Text>
      
      {/* FlatList es el componente nativo más eficiente para renderizar listas.
        Solo dibuja en pantalla lo que el usuario está viendo, ahorrando memoria RAM.
      */}
      <FlatList 
        data={historial} // El arreglo de objetos que guardamos desde la pantalla de diagnóstico
        keyExtractor={(_, i) => i.toString()} // Genera un ID único para cada tarjeta usando el índice
        renderItem={({ item }) => ( // Esta función define cómo se verá cada fila/tarjeta
          <View style={styles.card}>
            {/* Cabecera de la tarjeta con la fecha */}
            <View style={styles.cardHeader}>
              <Text style={styles.fechaText}>Fecha de evaluación: {item.fecha}</Text>
            </View>
            
            <Text style={styles.subtext}>Diagnósticos sugeridos (Top 3):</Text>
            
            {/* Como cada 'item' del historial contiene un arreglo llamado 'enfermedades' (el Top 3),
              recorremos ese arreglo interno con un .map para mostrar cada una de las probabilidades.
            */}
            {item.enfermedades.map((e: any, idx: number) => (
              <Text key={idx} style={styles.enfermedadItem}>
                • {e.nombre} — Coincidencia: {e.porcentaje.toFixed(0)}%
              </Text>
            ))}
            
            {/* Bloque dedicado para mostrar la nota o comentario que dejó el usuario */}
            <View style={styles.comentarioBox}>
              <Text style={styles.comentarioTitulo}>Notas del caso clínico:</Text>
              <Text style={styles.comentarioTexto}>
                "{item.comentario || 'Sin observaciones guardadas.'}"
              </Text>
            </View>
          </View>
        )}
        /* Propiedad genial de FlatList: Si el arreglo 'historial' está vacío (0 elementos), 
          renderiza automáticamente este componente en lugar de dejar la pantalla en blanco.
        */
        ListEmptyComponent={
          <Text style={styles.emptyText}>No has realizado ni guardado diagnósticos aún.</Text>
        }
      />
    </View>
  );
}

// --- HOJA DE ESTILOS DEFINITIVA ---
// Aquí aplicamos la distribución de objetos en pantalla y el uso de las 2 familias de fuentes (serif y sans-serif)
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#ffffff' 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    fontFamily: 'serif', // Primera familia de fuentes (estilo formal/médico)
    color: '#2c3e50', 
    marginBottom: 20 
  },
  card: { 
    backgroundColor: '#fdfefe', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    elevation: 2, // Sombra ligera en Android
    shadowColor: '#000', // Sombra ligera en iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#edf2f7', 
    paddingBottom: 6, 
    marginBottom: 8 
  },
  fechaText: { 
    fontSize: 12, 
    color: '#718096', 
    fontWeight: '600', 
    fontFamily: 'sans-serif' // Segunda familia de fuentes (limpia para lectura de datos)
  },
  subtext: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#4a5568', 
    fontFamily: 'sans-serif', 
    marginBottom: 4 
  },
  enfermedadItem: { 
    fontSize: 14, 
    color: '#2d3748', 
    fontFamily: 'sans-serif', 
    marginLeft: 5, 
    marginVertical: 2 
  },
  comentarioBox: { 
    marginTop: 12, 
    padding: 10, 
    backgroundColor: '#f7fafc', 
    borderRadius: 8 
  },
  comentarioTitulo: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#4a5568', 
    fontFamily: 'sans-serif' 
  },
  comentarioTexto: { 
    fontSize: 13, 
    color: '#1a202c', 
    fontFamily: 'sans-serif', 
    fontStyle: 'italic', 
    marginTop: 2 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#a0aec0', 
    marginTop: 40, 
    fontFamily: 'sans-serif', 
    fontSize: 15 
  }
});
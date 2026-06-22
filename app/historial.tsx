import * as Print from 'expo-print'; // Librería para generar el PDF desde HTML
import * as Sharing from 'expo-sharing'; // Librería para compartir/guardar el archivo generado
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from "../firebaseConfig";

export default function Historial() {
  // Estado para almacenar los diagnósticos traídos desde Firebase
  const [historial, setHistorial] = useState<any[]>([]);

  // useEffect se ejecuta al montar el componente; escucha cambios en tiempo real en la colección
  useEffect(() => {
    // Ordenamos por fecha descendente (lo más nuevo arriba)
    const q = query(collection(db, "historial_diagnosticos"), orderBy("fecha", "desc"));
    
    // onSnapshot mantiene la app sincronizada con la base de datos en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistorial(lista);
    });
    return () => unsubscribe(); // Limpiamos la suscripción al desmontar
  }, []);

  // Función que convierte los datos del diagnóstico en un archivo PDF
  const generarPDF = async (item: any) => {
    try {
      // Definimos el diseño visual del reporte en formato HTML
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #2c3e50;">Reporte de Diagnóstico - DermaWiki</h1>
            <p><strong>Fecha:</strong> ${item.fecha ? new Date(item.fecha).toLocaleString() : 'N/A'}</p>
            <h2 style="color: #e67e22;">Enfermedades detectadas:</h2>
            <ul>
              ${item.enfermedades?.map((e: any) => `<li>${e.nombre}: ${typeof e.porcentaje === 'number' ? e.porcentaje.toFixed(0) : 0}%</li>`).join('')}
            </ul>
            <p><strong>Notas:</strong> ${item.comentario || 'Sin notas'}</p>
          </body>
        </html>
      `;

      // Print.printToFileAsync genera el PDF en el sistema de archivos temporal
      const result = await Print.printToFileAsync({ html });

      if (result && result.uri) {
        // En web usamos impresión nativa; en móvil compartimos el archivo
        if (Platform.OS === 'web') {
          window.print();
        } else {
          await Sharing.shareAsync(result.uri);
        }
      }
    } catch (error) {
      console.error("Error al generar PDF:", error);
      Alert.alert("Error", "No se pudo generar el documento.");
    }
  };

  // Función para eliminar un documento de Firestore usando su ID único
  const eliminarDiagnostico = async (id: string) => {
    await deleteDoc(doc(db, "historial_diagnosticos", id));
  };

  // Función para actualizar el comentario de un diagnóstico existente
  const editarComentario = async (id: string, comentarioActual: string) => {
    const nuevo = prompt("Editar nota:", comentarioActual); // Pedimos el nuevo texto al usuario
    if (nuevo !== null) {
      await updateDoc(doc(db, "historial_diagnosticos", id), { comentario: nuevo });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historial de Consultas</Text>
      
      {/* FlatList renderiza la lista de diagnósticos de forma eficiente */}
      <FlatList 
        data={historial}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => ( 
          <View style={styles.card}>
            <Text style={styles.fechaText}>Fecha: {item.fecha ? new Date(item.fecha).toLocaleString() : 'N/A'}</Text>
            
            <View style={styles.listContainer}>
              {/* Mapeamos las enfermedades detectadas en este diagnóstico */}
              {item.enfermedades?.map((e: any, idx: number) => (
                <Text key={idx} style={styles.enfermedadItem}>
                  • {e.nombre}: {typeof e.porcentaje === 'number' ? e.porcentaje.toFixed(0) : 0}%
                </Text>
              ))}
            </View>

            <View style={styles.comentarioBox}>
              <Text style={styles.comentarioTitulo}>Notas:</Text>
              <Text style={styles.comentarioTexto}>"{item.comentario || 'Sin notas'}"</Text>
            </View>

            {/* Fila de botones de acción */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.btn, styles.pdfBtn]} onPress={() => generarPDF(item)}>
                <Text style={styles.btnText}>PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, styles.editBtn]} onPress={() => editarComentario(item.id, item.comentario)}>
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={() => eliminarDiagnostico(item.id)}>
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50' },
  card: { backgroundColor: '#fdfefe', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  fechaText: { fontSize: 11, color: '#999', marginBottom: 8 },
  listContainer: { marginVertical: 5 },
  enfermedadItem: { fontSize: 14, color: '#333', marginBottom: 2 },
  comentarioBox: { marginTop: 10, backgroundColor: '#f0f4f8', padding: 8, borderRadius: 6 },
  comentarioTitulo: { fontSize: 11, fontWeight: 'bold', color: '#555' },
  comentarioTexto: { fontSize: 13, fontStyle: 'italic', color: '#222' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  btn: { paddingVertical: 8, borderRadius: 6, width: '30%', alignItems: 'center' },
  pdfBtn: { backgroundColor: '#27ae60' },
  editBtn: { backgroundColor: '#3498db' },
  deleteBtn: { backgroundColor: '#e74c3c' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});
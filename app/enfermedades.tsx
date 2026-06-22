import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import data from '../assets/enfermedades.json';

export default function Enfermedades() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Diccionario Dermatológico</Text>
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.enfermedadNombre}>{item.nombre}</Text>
            <Text style={styles.enfermedadDesc}>{item.descripcion}</Text>
            
            <Text style={styles.sintomasTitulo}>Síntomas asociados:</Text>
            <View style={styles.sintomasContainer}>
              {item.sintomas.map((sintoma, idx) => (
                <Text key={idx} style={styles.sintomaTag}>
                  • {sintoma.replace('_', ' ')}
                </Text>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#2c3e50', textAlign: 'center' },
  card: { 
    backgroundColor: '#f8f9fa', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#e9ecef' 
  },
  enfermedadNombre: { fontSize: 18, fontWeight: 'bold', color: '#e67e22', marginBottom: 5 },
  enfermedadDesc: { fontSize: 14, color: '#666', marginBottom: 10, lineHeight: 20 },
  sintomasTitulo: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
  sintomasContainer: { marginLeft: 5 },
  sintomaTag: { fontSize: 14, color: '#2980b9', textTransform: 'capitalize', marginVertical: 2 }
});
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';

export default function Home() {
  const [fontsLoaded, fontError] = useFonts({
    'TituloDermaWiki': require('../assets/fonts/Phenomena-Black.ttf'), 
    // Carga la fuente desde assets/fonts/
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  } //Placeholder mientras se cargan las fuentes

  return (
    <View style={styles.container}>
      {/* Descomenta este bloque cuando tengas tu imagen lista en la carpeta assets.
        Asegúrate de que la ruta y el nombre del archivo sean exactos.
        
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        /> 
      */}
      
      <Text style={styles.title}>DermaWiki</Text>
      
      {/* Botones de Navegación */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/diagnostico')}>
        <Text style={styles.buttonText}>Iniciar Diagnóstico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/historial')}>
        <Text style={styles.buttonText}>Ver Historial</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#27ae60' }]} onPress={() => router.push('/enfermedades')}>
        <Text style={styles.buttonText}>Wiki de Enfermedades</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#fff'
  },
  logo: { 
    width: 150, 
    height: 150, 
    marginBottom: 10 
  },
  title: { 
    fontFamily: 'TituloDermaWiki',
    fontSize: 36, 
    fontWeight: 'normal',
    marginBottom: 40,
    color: '#333'
  },
  button: { 
    backgroundColor: '#3498db', 
    padding: 15, 
    borderRadius: 10, 
    width: '80%', 
    marginVertical: 10 
  },
  buttonText: { 
    color: 'white', 
    textAlign: 'center', 
    fontSize: 18, 
    fontWeight: '600' 
  }
});

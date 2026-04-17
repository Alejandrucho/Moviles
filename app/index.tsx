import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

// Importación de componentes personalizados
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import EmojiList from '../components/EmojiList';
import EmojiPicker from '../components/EmojiPicker';
import EmojiSticker from '../components/EmojiSticker';
import IconButton from '../components/IconButton';
import ImageViewer from '../components/ImageViewer';

const PlaceholderImage = require('../assets/images/background-image.png');

export default function HomeScreen() {
  // --- ESTADOS DE LA APLICACIÓN ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Almacena la URI de la foto elegida
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);   // Controla si mostramos el menú de edición o el principal
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);   // Controla la visibilidad del selector de emojis
  const [pickedEmoji, setPickedEmoji] = useState<any>(null);              // Guarda el sticker que el usuario selecciona

  // --- REFERENCIAS Y PERMISOS ---
  // imageRef se usa para identificar el área exacta que queremos capturar (imagen + sticker)
  const imageRef = useRef<View>(null); 
  
  // Solicitamos permisos para escribir en la galería del dispositivo
  const [status, requestPermission] = MediaLibrary.usePermissions({ writeOnly: true });

  // Si es la primera vez que se abre la app, pedimos los permisos inmediatamente
  if (status === null) {
    requestPermission();
  }

  // Función para abrir la galería y seleccionar una imagen
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Permite recortar la imagen antes de cargarla
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true); // Una vez elegida la foto, saltamos al menú de edición
    } else {
      alert('No seleccionaste ninguna imagen.');
    }
  };

  // Limpia el estado para volver a la pantalla de inicio
  const onReset = () => {
    setShowAppOptions(false);
    setPickedEmoji(null);
  };

  // Abre el modal para elegir un sticker
  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  // Cierra el modal de stickers
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  // --- FUNCIÓN DE GUARDADO ---
  const onSaveImageAsync = async () => {
    try {
      // captureRef toma una "foto" del componente que tenga la referencia imageRef
      const localUri = await captureRef(imageRef, {
        height: 440, // Altura de la captura
        quality: 1,  // Máxima calidad
      });

      // Guardamos la captura resultante en la biblioteca multimedia del teléfono
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('¡Imagen guardada en la galería!');
      }
    } catch (e) {
      console.log(e);
      alert('Hubo un error al guardar la imagen.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Asignamos la referencia imageRef a este View. 
          'collapsable={false}' es necesario en Android para que captureRef no falle al buscar la vista.
        */}
        <View ref={imageRef} collapsable={false}>
          <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
          
          {/* Si el usuario eligió un emoji, lo mostramos encima de la imagen */}
          {pickedEmoji !== null ? (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>

      {/* RENDERIZADO CONDICIONAL: Dependiendo de showAppOptions mostramos un menú u otro */}
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Elegir una foto" onPress={pickImageAsync} />
          <Button label="Usar esta foto" onPress={() => setShowAppOptions(true)} />
        </View>
      )}

      {/* Modal flotante que contiene la lista de stickers */}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </View>
  );
}

// Estilos básicos de la aplicación
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
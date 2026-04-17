import { Image, type ImageSource } from 'expo-image';
import { StyleSheet } from 'react-native';

interface Props {
  placeholderImageSource: ImageSource;
  selectedImage?: string | null;
}

export default function ImageViewer({ placeholderImageSource, selectedImage }: Props) {
  // Lógica de decisión: ¿Hay foto nueva? Úsala. ¿No? Usa el placeholder.
  const imageSource = selectedImage ? { uri: selectedImage } : placeholderImageSource;

  return <Image source={imageSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
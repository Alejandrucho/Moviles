import { Pressable, View } from 'react-native';

export default function CircleButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={{ width: 80, height: 80, backgroundColor: 'white', borderRadius: 40 }}>
      <Pressable onPress={onPress} style={{ flex: 1 }} />
    </View>
  );
}
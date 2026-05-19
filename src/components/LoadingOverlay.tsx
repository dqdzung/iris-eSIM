import { ActivityIndicator, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

type Props = {
  isVisible: boolean;
};

const MIN_VISIBLE_MS = 500;

const LoadingOverlay = ({ isVisible }: Props) => {
  const [shown, setShown] = useState(false);
  const shownAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (isVisible) {
      if (!shown) shownAtRef.current = Date.now();
      setShown(true);
      return;
    }
    if (!shown) return;
    const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : MIN_VISIBLE_MS;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const timer = setTimeout(() => {
      setShown(false);
      shownAtRef.current = null;
    }, remaining);
    return () => clearTimeout(timer);
  }, [isVisible, shown]);

  if (!shown) return null;
  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/40">
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default LoadingOverlay;

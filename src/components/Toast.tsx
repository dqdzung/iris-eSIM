import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Animated, Pressable, Text, View } from 'react-native';

type ToastVariant = 'success' | 'error' | 'info';

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  show: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { bg: string; Icon: typeof CheckCircleIcon }> = {
  success: { bg: 'bg-emerald-600', Icon: CheckCircleIcon },
  error: { bg: 'bg-red-600', Icon: ExclamationTriangleIcon },
  info: { bg: 'bg-slate-700', Icon: InformationCircleIcon },
};

const AUTO_DISMISS_MS = 3500;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss]
  );

  const value: ToastContextValue = {
    show,
    success: (m) => show(m, 'success'),
    error: (m) => show(m, 'error'),
    info: (m) => show(m, 'info'),
  };

  const toastContainer = (
    <View
      pointerEvents="box-none"
      className="absolute top-0 w-full items-center"
      style={{ zIndex: 10000 }}>
      {toasts.map((t) => (
        <ToastRow key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </View>
  );

  return (
    <ToastContext value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(toastContainer, document.body)
        : toastContainer}
    </ToastContext>
  );
};

const ToastRow = ({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const { bg, Icon } = VARIANT_STYLES[item.variant];

  return (
    <Animated.View
      className="w-full"
      style={{ width: '100%', opacity, transform: [{ translateY }] }}>
      <View className={`flex-row items-center gap-2 ${bg} px-4 py-3 shadow-lg`}>
        <Icon className="h-5 w-5 text-white" />
        <Text className="flex-1 text-sm font-medium text-white">{item.message}</Text>
        <Pressable onPress={onDismiss} hitSlop={8}>
          <XMarkIcon className="h-4 w-4 stroke-2 text-white" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

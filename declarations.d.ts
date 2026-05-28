declare module '*.png' {
  const value: import('expo-image').ImageSource;
  export default value;
}

declare module '*.jpg' {
  const value: import('expo-image').ImageSource;
  export default value;
}

declare module '*.jpeg' {
  const value: import('expo-image').ImageSource;
  export default value;
}

declare module '*.gif' {
  const value: import('expo-image').ImageSource;
  export default value;
}

declare module '*.svg' {
  const value: { uri: string; width: number; height: number; scale: number };
  export default value;
}

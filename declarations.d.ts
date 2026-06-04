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

// Set by /apiEndpoint.js (copied from static/ at deploy time, injected as
// <script> in dist/index.html). Lets a single production build target
// different backends without rebuilding. See src/api/apiService.ts.
interface Window {
  apiEndpoint?: string;
}

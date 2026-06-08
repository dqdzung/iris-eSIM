// Declares `createPortal` on the `react-dom` module. This is a React Native
// project, so the full `react-dom` types aren't wired up — without this,
// `import { createPortal } from 'react-dom'` wouldn't type-check.
// Used by src/components/Toast.tsx to mount the toast container on
// `document.body` (web only) so toasts render above everything, escaping any
// parent overflow/stacking context.
declare module 'react-dom' {
  import type { ReactNode, ReactPortal } from 'react';
  export function createPortal(
    children: ReactNode,
    container: Element | DocumentFragment
  ): ReactPortal;
}

// Augments the JSX namespace with HTML intrinsic elements so we can use
// `<input>`, `<div>`, etc. directly in JSX. Needed because tsconfig's
// `jsx: "react-native"` setting otherwise restricts intrinsics to RN components.
// This project ships only to web (Expo Router web export), so falling through
// to DOM elements is fine.
import type {
  DetailedHTMLProps,
  HTMLAttributes,
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      input: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      button: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      a: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    }
  }
}

export {};

"use client";

import * as React from "react";

import { Toast } from "@heroui/react";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <Toast.Provider placement="bottom" />
      {children}
    </>
  );
}

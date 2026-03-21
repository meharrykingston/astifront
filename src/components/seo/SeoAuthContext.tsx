import { createContext, useContext } from "react";

export type SeoUserContext = {
  name: string;
  email: string;
  role: string;
};

const SeoAuthContext = createContext<SeoUserContext | null>(null);

export function SeoAuthProvider({
  value,
  children,
}: {
  value: SeoUserContext | null;
  children: React.ReactNode;
}) {
  return <SeoAuthContext.Provider value={value}>{children}</SeoAuthContext.Provider>;
}

export function useSeoUser() {
  return useContext(SeoAuthContext);
}

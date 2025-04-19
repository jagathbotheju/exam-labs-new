"use client";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: 1000,
            //with SSR we usually want to set some default staleTime
            //above 0 to avoid refetching immediately on the client
            // staleTime: 6 * 1000,
            // refetchInterval: 6 * 1000,
          },
        },
      })
  );

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors />
      </QueryClientProvider>
    </NextThemesProvider>
  );
};

export default Providers;

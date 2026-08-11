import type { Metadata } from "next";
import { dmSans, libreCaslon } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Meal planning application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${libreCaslon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

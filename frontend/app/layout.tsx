import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Chamelo — Learn Languages",
  description: "A premium language learning app with gamified lessons, streaks, and XP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                let isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Providers>
            <AppLayout>{children}</AppLayout>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Little Bird - Political Intelligence Platform",
  description: "Political intelligence platform for Colorado lobbying firms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

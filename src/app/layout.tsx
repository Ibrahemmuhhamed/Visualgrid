import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VisualGrid",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-gray-950 text-green-50 min-h-screen 
      6"
      >
        {children}
      </body>
    </html>
  );
}

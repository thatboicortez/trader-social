import './globals.css';

export const metadata = {
  title: 'Trader Social',
  description: 'Trader Social',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
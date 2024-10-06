import '../app/styles/globals.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[url('/college-building-2_generated.jpg')] bg-cover bg-center bg-fixed"
      >
        {children}
      </body>
    </html>
  );
}

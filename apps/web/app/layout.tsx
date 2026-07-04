// Root layout delegates html/body to `app/[locale]/layout.tsx` (next-intl).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

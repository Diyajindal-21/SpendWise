
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center pt-30 pb-15">{children}</div>
  );
}

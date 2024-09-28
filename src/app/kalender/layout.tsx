export default function KalenderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: number };
}) {
  return <section>{children}</section>;
}

export default function KalenderLayout({
                                           children,
                                           params,
                                       }: {
    children: React.ReactNode;
    params: { id: number };
}) {
    return (
        <>
            <main> {children}</main>
        </>
    );
}

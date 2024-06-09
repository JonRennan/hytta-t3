import "~/styles/globals.css";

import {GeistSans} from "geist/font/sans";

export const metadata = {
    title: "Hytta",
    description: "En liten privat side for å booke hytta på fjellet",
    icons: [{rel: "icon", url: "/favicon.ico"}],
};

function TopNav() {
    return (
        <nav className="navbar">
            <div> Kalender </div>
            <div> Logg inn </div>
        </nav>
    )
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="no">
        <body className={GeistSans.className}>
            <TopNav />
            {children}
        </body>
        </html>
    );
}

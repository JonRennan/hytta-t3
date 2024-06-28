import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";

export const metadata = {
  title: "Hytta",
  description: "En liten privat side for å booke hytta på fjellet",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function TopNav() {
  return (
    <nav className="navbar">
      <div> Kalender</div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="no">
        <body className={GeistSans.className}>
          <TopNav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

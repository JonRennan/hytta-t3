import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";

export const metadata = {
  title: "Hytta",
  description: "En liten privat side for å booke hytta på fjellet",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function TopNav() {
  return (
    <nav className="flex w-full justify-around bg-surface-bright py-3">
      <Link href="/">Kalender</Link>
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
        <body className={`dark ${GeistSans.className}`}>
          <TopNav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

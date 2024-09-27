import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { nbNO } from "@clerk/localizations";
import { ModeToggle } from "~/components/mode-toggle";
import { ThemeProvider } from "~/providers";
import { Toaster } from "~/components/ui/sonner";
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
    <nav className="flex w-full items-center justify-around bg-surface-bright py-3">
      <Link href="/">Kalender</Link>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <SignedOut>
          <SignInButton mode={"modal"}>
            <button>Logg inn</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={nbNO}>
      <html lang="no">
        <body className={GeistSans.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TopNav />
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

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
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", sizes: "16x16", url: "/favicon-16x16.png" },
    { rel: "icon", sizes: "32x32", url: "/favicon-32x32.png" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    { rel: "manifest", url: "/site.webmanifest" },
  ],
};

function TopNav() {
  return (
    <nav className="flex w-full items-center justify-around bg-surface-bright py-1">
      <Link href="/">Hytter</Link>
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
          <ThemeProvider>
            <TopNav />
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

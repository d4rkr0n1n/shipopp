import type { Metadata } from "next";
import "./globals.css";

const title = "ShipOps — DevOps as a Service";
const description = "Senior DevOps expertise on subscription. CI/CD, Terraform, Kubernetes, cloud infrastructure, and GitOps for ambitious product teams.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: "ShipOps",
    locale: "en_IN",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ShipOps — Ship faster. Sleep better." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/og.png", alt: "ShipOps — Ship faster. Sleep better." }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

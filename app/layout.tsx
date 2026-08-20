import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "ShipOps — DevOps as a Service", description: "Senior DevOps expertise on subscription. CI/CD, Terraform, Kubernetes, cloud infrastructure, and GitOps for ambitious product teams." };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthGuard from '@/components/AuthGuard'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI営業自動化システム",
    description: "AI営業自動化システムのダッシュボード",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthGuard>
                    {children}
                </AuthGuard>
            </body>
        </html>
    );
}

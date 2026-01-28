import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Telegram Clone - Messaging App",
	description: "A modern messaging app inspired by Telegram",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">{children}</body>
		</html>
	);
}

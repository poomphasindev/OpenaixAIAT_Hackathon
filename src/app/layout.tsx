import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoutineSense AI — ผู้ช่วยดูแลพลังงานประจำวัน",
  description:
    "RoutineSense เรียนรู้สิ่งที่ทำให้พลังงานตก แล้วช่วยแนะนำก่อนวันหลุดจังหวะ สำหรับชีวิตเมืองไทยในยุค post-AGI",
  openGraph: {
    title: "RoutineSense AI",
    description: "ผู้ช่วยดูแลพลังงานประจำวันสำหรับชีวิตเมืองไทย",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700;800;900&family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import { Montserrat, Poppins } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-poppins",
  display: "swap",
});
/*const highCruiser = localFont({
  src: "./fonts/HighCruiser.otf",
  variable: "--font-high-cruiser",
  display: "swap",
});*/

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Gestão de Projetos",
  description: "Plataforma de gerenciamento de tarefas e projetos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} ${poppins.variable} font-sans antialiased bg-stone-100 text-carvao dark:bg-neutral-950 dark:text-gray-100`}>

        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster theme="system" richColors position="bottom-right" />

      </body>
    </html>
  );
}
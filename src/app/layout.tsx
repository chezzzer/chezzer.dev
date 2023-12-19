import type { Metadata } from "next";
import "./globals.css";
import HoverRadial from "@/components/HoverRadial/HoverRadial";
import Header from "@/components/Header/Header";
import Socials from "@/components/Socials/Socials";
import Status from "@/components/Status/Status";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
    title: "Ryan Cherry",
    description:
        "Ryan Cherry is a software engineer who builds accessible, inclusive products and digital experiences for the web.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://use.typekit.net/urn6xmu.css"
                ></link>
            </head>
            <body>
                <HoverRadial />
                <main>
                    <div className="md:flex md:gap-10">
                        <div className="md:w-1/2 md:sticky top-[100px] h-fit md:flex flex-col gap-2">
                            <h1 className="text-6xl font-extrabold fields">
                                Ryan Cherry
                            </h1>
                            <h4 className="text-2xl fields text-primary">
                                Full-Stack Engineer
                            </h4>
                            <p className="opacity-80 w-3/4">
                                Ryan Cherry is a software engineer who builds
                                accessible, inclusive products and digital
                                experiences for the web.
                            </p>
                            <div className="mt-2">
                                <Status />
                            </div>
                            <div className="mt-10">
                                <Socials />
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <Header />
                            <div className="my-10 page">{children}</div>
                            <Footer />
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );
}
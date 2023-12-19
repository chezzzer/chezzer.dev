"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";

type Item = {
    name: string;
    href: string;
};

export default function Header() {
    const items = [
        {
            name: "about me",
            href: "/",
        },
        {
            name: "contact",
            href: "/contact",
        },
    ];

    const pathname = usePathname();

    return (
        <div className="md:flex md:justify-end mt-10 md:mt-0">
            <div className={styles.pages}>
                {items.map((item: Item) => (
                    <div className={styles.page} key={item.href}>
                        <Link
                            href={item.href}
                            className={
                                pathname == item.href
                                    ? "font-bold text-primary"
                                    : ""
                            }
                            key={item.name}
                        >
                            {item.name}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

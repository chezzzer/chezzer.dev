"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HoverRadial.module.css";

export default function HoverRadial() {
    const radial = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!radial.current) return;
        window.addEventListener("mousemove", (e) => {
            if (!radial.current) return;

            radial.current.style.setProperty("--x", `${e.clientX}px`);
            radial.current.style.setProperty("--y", `${e.clientY}px`);
        });
    }, [radial]);

    return <div ref={radial} className={styles.radial}></div>;
}

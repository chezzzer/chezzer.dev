"use client";

import { useState, useEffect } from "react";

export default function LocalTime() {
    const [time, setTime] = useState<string>();

    useEffect(() => {
        const calculateTime = () => {
            var d = new Date();
            var utc = d.getTime() + d.getTimezoneOffset() * 60000;
            var nd = new Date(utc + 3600000 * 13);
            setTime(
                nd.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
        };
        const interval = setInterval(calculateTime, 1000);
        calculateTime();

        return () => clearInterval(interval);
    }, []);

    return (
        <span>
            {time} <span className="opacity-50">NZT</span>
        </span>
    );
}

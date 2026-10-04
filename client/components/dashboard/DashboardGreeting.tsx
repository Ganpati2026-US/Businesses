'use client';

import { useEffect, useState } from 'react';

function greetingForHour(hour: number) {
    if (hour >= 5 && hour < 12) return 'Hi, Good Morning!';
    if (hour >= 12 && hour < 17) return 'Hi, Good Afternoon!';
    if (hour >= 17 && hour < 21) return 'Hi, Good Evening!';
    return 'Hi, Good Night!';
}

export default function DashboardGreeting() {
    const [greeting, setGreeting] = useState('');
    const [visibleGreeting, setVisibleGreeting] = useState('');

    useEffect(() => {
        const updateGreeting = () => setGreeting(greetingForHour(new Date().getHours()));
        updateGreeting();
        const interval = window.setInterval(updateGreeting, 60_000);
        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!greeting) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisibleGreeting(greeting);
            return;
        }

        const letters = Array.from(greeting);
        let letterIndex = 0;
        setVisibleGreeting('');
        const interval = window.setInterval(() => {
            letterIndex += 1;
            setVisibleGreeting(letters.slice(0, letterIndex).join(''));
            if (letterIndex === letters.length) window.clearInterval(interval);
        }, 70);
        return () => window.clearInterval(interval);
    }, [greeting]);

    return (
        <p className="mt-1 min-h-5 text-sm text-slate-500" aria-label={greeting}>
            <span aria-hidden="true">{visibleGreeting}</span>
        </p>
    );
}

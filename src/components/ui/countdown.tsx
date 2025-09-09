import { useState, useEffect } from "react";

interface CountdownProps {
    targetDate: Date;
    className?: string;
}

export function Countdown({ targetDate, className = "" }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = targetDate.getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className={`flex gap-4 justify-center ${className}`}>
            <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-lg p-3 min-w-[60px]">
                    <div className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">DIAS</div>
            </div>
            <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-lg p-3 min-w-[60px]">
                    <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">HORAS</div>
            </div>
            <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-lg p-3 min-w-[60px]">
                    <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">MIN</div>
            </div>
            <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-lg p-3 min-w-[60px]">
                    <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">SEG</div>
            </div>
        </div>
    );
}

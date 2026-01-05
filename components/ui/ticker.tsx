
import { cn } from "@/lib/utils";

interface TickerItem {
    label: string;
    value: string;
    change: number;
}

const items: TickerItem[] = [
    { label: "10Y T-NOTE", value: "4.21%", change: 0.05 },
    { label: "2Y T-NOTE", value: "4.55%", change: -0.02 },
    { label: "30Y BOND", value: "4.38%", change: 0.01 },
    { label: "DXY", value: "104.1", change: 0.15 },
    { label: "GOLD", value: "$2,345", change: -0.4 },
    { label: "OIL (WTI)", value: "$85.20", change: 1.2 },
    { label: "BTC", value: "$67,890", change: 3.5 },
];

export function Ticker() {
    return (
        <div className="w-full bg-slate-950 border-y border-white/10 overflow-hidden py-3 select-none">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center mx-8 gap-3 font-mono text-sm tracking-wider">
                        <span className="text-muted-foreground font-bold">{item.label}</span>
                        <span className="text-foreground">{item.value}</span>
                        <span className={cn(
                            "flex items-center",
                            item.change >= 0 ? "text-yield-up" : "text-yield-down"
                        )}>
                            {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change)}%
                        </span>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
            `}</style>
        </div>
    );
}

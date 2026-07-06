import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string; // ISO string del próximo partido
  matchLabel?: string; // e.g. "México vs Argentina"
}

/**
 * Copiado 1:1 de components/CountdownTimer.tsx en WC2026Streams para
 * que el hero de manglar.hub se vea consistente con el resto del
 * ecosistema. Si ese componente cambia allá, conviene traer la
 * actualización aquí también.
 */
export function CountdownTimer({ targetDate, matchLabel }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          expired: false,
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  if (timeLeft.expired) return null;

  return (
    <div>
      {matchLabel && <p className="text-white/50 text-xs mb-2 truncate">{matchLabel}</p>}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 md:px-3 md:py-3 text-center">
            <div className="text-xl md:text-3xl font-black text-[#0be881]">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-wider">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

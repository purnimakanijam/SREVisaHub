
import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      // IST is UTC+5:30
      // 9 PM IST is 15:30 UTC
      const nextUpdate = new Date(now);
      nextUpdate.setUTCHours(15, 30, 0, 0);

      if (now > nextUpdate) {
        nextUpdate.setUTCDate(nextUpdate.getUTCDate() + 1);
      }

      const diff = nextUpdate.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    const interval = setInterval(calculateTime, 1000);
    calculateTime();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 bg-indigo-900/50 text-indigo-100 px-4 py-2 rounded-full border border-indigo-500/30">
      <i className="fas fa-clock animate-pulse"></i>
      <span className="text-xs font-bold uppercase tracking-widest">Next Refresh (9 PM IST):</span>
      <span className="text-sm font-mono font-bold">{timeLeft}</span>
    </div>
  );
};

export default CountdownTimer;

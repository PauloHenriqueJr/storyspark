import { useState, useEffect } from "react";

export function useFounderSpots() {
  const [spotsLeft, setSpotsLeft] = useState(50);
  const [totalSpots] = useState(50);

  // Simular redução de vagas ao longo do tempo (para demo)
  useEffect(() => {
    const savedSpots = localStorage.getItem("founderSpots");
    if (savedSpots) {
      setSpotsLeft(parseInt(savedSpots));
    } else {
      // Começar com um número mais baixo para criar urgência
      const initialSpots = Math.floor(Math.random() * 15) + 8; // Entre 8-23 vagas restantes
      setSpotsLeft(initialSpots);
      localStorage.setItem("founderSpots", initialSpots.toString());
    }

    // Reduzir vagas ocasionalmente (simulação)
    const interval = setInterval(() => {
      setSpotsLeft((prev) => {
        if (prev > 5 && Math.random() < 0.1) {
          // 10% chance a cada 30s
          const newSpots = prev - 1;
          localStorage.setItem("founderSpots", newSpots.toString());
          return newSpots;
        }
        return prev;
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const reserveSpot = () => {
    setSpotsLeft((prev) => {
      const newSpots = Math.max(0, prev - 1);
      localStorage.setItem("founderSpots", newSpots.toString());
      return newSpots;
    });
  };

  return {
    spotsLeft,
    totalSpots,
    reserveSpot,
    percentageLeft: (spotsLeft / totalSpots) * 100,
  };
}

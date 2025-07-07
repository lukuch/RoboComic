import { useEffect } from "react";
import { healthCheck } from "../services/apiService";

export function useKeepAlive() {
  useEffect(() => {
    // Ping every 14 minutes to prevent Render.com sleep mode
    const interval = setInterval(healthCheck, 14 * 60 * 1000);

    // Initial ping
    healthCheck();

    return () => clearInterval(interval);
  }, []);
}

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../context/AuthContext";
import type { Personas } from "../types";
import { API_CONFIG } from "../constants";

type PersonaRow = {
  name: string;
  description: string;
  description_pl: string;
};

export function usePersonas() {
  const { user } = useAuth();
  const [personas, setPersonas] = useState<Personas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!user) {
      // Not logged in: fetch only common personas
      fetch(`${API_CONFIG.BASE_URL}/personas`)
        .then((res) => res.json())
        .then((commonPersonas) => {
          setPersonas(commonPersonas.personas || commonPersonas);
        })
        .catch((err) => setError(err.message || "Failed to fetch personas"))
        .finally(() => setLoading(false));
      return;
    }

    // Logged in: fetch and merge
    Promise.all([
      fetch(`${API_CONFIG.BASE_URL}/personas`).then((res) => res.json()),
      supabase
        .from("personas")
        .select("name, description, description_pl")
        .eq("user_id", user.id)
        .then(({ data, error }) => {
          if (error) throw error;
          return data;
        }),
    ])
      .then(([commonPersonas, userPersonas]) => {
        const basePersonas = commonPersonas.personas || commonPersonas;
        const userPersonasObj = (userPersonas || []).reduce(
          (acc: Personas, p: PersonaRow) => {
            acc[p.name] = {
              name: p.name,
              description: p.description,
              description_pl: p.description_pl,
            };
            return acc;
          },
          {},
        );
        setPersonas({ ...basePersonas, ...userPersonasObj });
      })
      .catch((err) => setError(err.message || "Failed to fetch personas"))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [user, fetchAll]);

  return { personas, loading, error, refetch: fetchAll };
}

import { useEffect, useRef, useState } from "react";

export function usePersonaSelection(
  personas: Record<
    string,
    { description: string; description_pl: string }
  > | null,
  initial1 = "",
  initial2 = "",
) {
  const [comedian1, setComedian1] = useState(initial1);
  const [comedian2, setComedian2] = useState(initial2);

  const prevComedian1DetailsRef = useRef<{
    description: string;
    description_pl: string;
  } | null>(null);
  const prevComedian2DetailsRef = useRef<{
    description: string;
    description_pl: string;
  } | null>(null);

  useEffect(() => {
    if (personas && comedian1 && personas[comedian1]) {
      prevComedian1DetailsRef.current = {
        description: personas[comedian1].description,
        description_pl: personas[comedian1].description_pl,
      };
    }
    if (personas && comedian2 && personas[comedian2]) {
      prevComedian2DetailsRef.current = {
        description: personas[comedian2].description,
        description_pl: personas[comedian2].description_pl,
      };
    }
  }, [comedian1, comedian2, personas]);

  useEffect(() => {
    if (!personas) return;
    const keys = Object.keys(personas);

    if (!keys.includes(comedian1)) {
      const prevDetails = prevComedian1DetailsRef.current;
      const foundKey =
        prevDetails &&
        keys.find(
          (key) =>
            personas[key].description === prevDetails.description &&
            personas[key].description_pl === prevDetails.description_pl,
        );
      if (foundKey) {
        setComedian1(foundKey);
      } else {
        setComedian1(keys[0] || "");
      }
    }

    if (!keys.includes(comedian2)) {
      const prevDetails = prevComedian2DetailsRef.current;
      const foundKey =
        prevDetails &&
        keys.find(
          (key) =>
            personas[key].description === prevDetails.description &&
            personas[key].description_pl === prevDetails.description_pl,
        );
      if (foundKey) {
        setComedian2(foundKey);
      } else {
        setComedian2(keys[0] || "");
      }
    }
  }, [personas]);

  return { comedian1, setComedian1, comedian2, setComedian2 };
}

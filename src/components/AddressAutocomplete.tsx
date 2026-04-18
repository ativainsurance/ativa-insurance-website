"use client";

import { useEffect, useRef } from "react";

/* ─── Minimal Window type augmentation ────────────────────────────────────── */
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options?: Record<string, any>
          ) => {
            addListener: (event: string, handler: () => void) => void;
            getPlace: () => { formatted_address?: string };
          };
        };
      };
    };
  }
}

interface AddressAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({
  id,
  value,
  onChange,
  placeholder = "Start typing your address…",
  className = "",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const tryInit = () => {
      if (
        initializedRef.current ||
        !inputRef.current ||
        !window.google?.maps?.places?.Autocomplete
      ) return;

      initializedRef.current = true;

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
      });

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (place.formatted_address) {
          onChange(place.formatted_address);
        }
      });

      clearInterval(intervalId);
    };

    tryInit();
    // Retry until the Google Maps script has loaded
    intervalId = setInterval(tryInit, 400);

    return () => clearInterval(intervalId);
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
    />
  );
}

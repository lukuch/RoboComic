"use client";

import React, { useState, useEffect } from "react";
import { TemperaturePreset } from "../../types";
import type { TranslationStrings } from "../../types";
import {
  getDefaultLLMConfig,
  getTemperaturePresets,
} from "../../services/apiService";
import { toSentenceCase } from "../../utils/stringUtils";
import { PERSONAS_RETRY_TIMEOUT_MS } from "../../constants";

interface TemperatureConfigProps {
  temperature: number;
  onTemperatureChange: (temperature: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  t: TranslationStrings;
}

const TemperatureConfig: React.FC<TemperatureConfigProps> = ({
  temperature,
  onTemperatureChange,
  isOpen,
  onToggle,
  t,
}) => {
  const [presets, setPresets] = useState<TemperaturePreset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const [presetsData, defaultConfigData] = await Promise.all([
        getTemperaturePresets(),
        getDefaultLLMConfig(),
      ]);
      setPresets(presetsData);
      if (temperature === 0.9) {
        onTemperatureChange(defaultConfigData.temperature);
      }
      setError(null);
    } catch {
      setPresets([]);
      setError("Failed to load AI presets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTemperatureChange, temperature]);

  useEffect(() => {
    if (error && !loading) {
      const retry = setTimeout(fetchConfig, PERSONAS_RETRY_TIMEOUT_MS);
      return () => clearTimeout(retry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, loading, onTemperatureChange, temperature]);

  const handlePresetSelect = (preset: TemperaturePreset) => {
    onTemperatureChange(preset.temperature);
  };

  const getTemperatureLabel = (temp: number) => {
    if (temp <= 0.3) {
      return t.conservative;
    }
    if (temp <= 0.7) {
      return t.balanced;
    }
    if (temp <= 0.9) {
      return t.creative;
    }
    return t.experimental;
  };

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0.3) {
      return "text-blue-600";
    }
    if (temp <= 0.7) {
      return "text-green-600";
    }
    if (temp <= 0.9) {
      return "text-orange-600";
    }
    return "text-red-600";
  };

  if ((loading || error) && !isOpen) {
    return (
      <div className="rounded-2xl bg-gray-900/90 border border-gray-800 shadow-lg p-3 mt-4">
        <div className="flex items-center justify-between w-full animate-pulse">
          <div className="h-5 w-40 bg-gray-400 dark:bg-gray-700 rounded mb-0.5" />
          <div className="h-5 w-5 bg-gray-400 dark:bg-gray-700 rounded ml-2" />
        </div>
      </div>
    );
  }
  if (loading && isOpen) {
    // If loading and expanded, show nothing or a minimal placeholder
    return <div className="mt-4" />;
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-lg p-3 mt-4">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className="flex items-center justify-between w-full text-left font-bold text-gray-900 dark:text-gray-100"
        aria-label="Toggle AI creativity settings"
      >
        <span>{t.aiCreativitySettings}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-6">
          {/* Current Temperature Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {temperature}
            </div>
            <div
              className={`text-sm font-medium ${getTemperatureColor(temperature)}`}
            >
              {getTemperatureLabel(temperature)}
            </div>
          </div>

          {/* Temperature Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.adjustCreativity}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span>{t.conservative}</span>
              <span>{t.creative}</span>
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.quickPresets}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePresetSelect(preset);
                  }}
                  className={`min-w-0 p-2 sm:p-3 text-left rounded-lg border transition-colors font-medium text-gray-900 dark:text-gray-100 whitespace-normal text-sm sm:text-base ${
                    Math.abs(temperature - preset.temperature) < 0.05
                      ? "border-blue-500 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-400"
                      : "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="whitespace-normal text-sm sm:text-base font-bold">
                    {t[preset.name as keyof TranslationStrings]}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-normal">
                    {preset.temperature}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-500 mt-1 whitespace-normal normal-case">
                    {toSentenceCase(
                      t[
                        `${preset.name}Desc` as keyof TranslationStrings
                      ]?.trim(),
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
            {t.temperatureHelp}
          </div>
          {!loading && error && (
            <div className="text-sm text-red-600 dark:text-red-400 mt-2">
              {error}
            </div>
          )}
          {!loading && !error && presets.length === 0 && (
            <div className="text-sm text-yellow-700 dark:text-yellow-400 mt-2">
              {t.noPresets}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemperatureConfig;

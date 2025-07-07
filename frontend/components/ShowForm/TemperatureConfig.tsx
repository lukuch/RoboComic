"use client";

import React, { useState, useEffect } from "react";
import { TemperaturePreset } from "../../types";
import {
  getDefaultLLMConfig,
  getTemperaturePresets,
} from "../../services/apiService";
import { toSentenceCase } from "../../utils/toTitleCase";

interface TemperatureConfigProps {
  temperature: number;
  onTemperatureChange: (temperature: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  t: Record<string, string>;
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

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const [presetsData, defaultConfigData] = await Promise.all([
          getTemperaturePresets(),
          getDefaultLLMConfig(),
        ]);
        setPresets(presetsData);

        // Set default temperature if not already set
        if (temperature === 0.9) {
          // Assuming 0.9 is the hardcoded default
          onTemperatureChange(defaultConfigData.temperature);
        }
      } catch {
        setPresets([]);
        setError("Failed to load AI presets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [onTemperatureChange, temperature]);

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

  if (loading) {
    return (
      <div className="border rounded-lg p-4 mt-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gray-900/90 border border-gray-800 shadow-lg p-3 mt-4">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className="flex items-center justify-between w-full text-left font-bold text-gray-100"
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
            <div className="text-2xl font-bold text-indigo-400">
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.adjustCreativityLevel}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{t.conservative}</span>
              <span>{t.creative}</span>
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
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
                  className={`min-w-0 p-2 sm:p-3 text-left rounded-lg border transition-colors font-medium text-gray-100 whitespace-normal text-sm sm:text-base ${
                    Math.abs(temperature - preset.temperature) < 0.05
                      ? "border-blue-500 bg-blue-900/60 text-blue-400"
                      : "border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <div className="whitespace-normal text-sm sm:text-base font-bold">
                    {t[preset.name]}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 whitespace-normal">
                    {preset.temperature}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 whitespace-normal normal-case">
                    {toSentenceCase(t[`${preset.name}Desc`]?.trim())}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-300 bg-gray-800 p-3 rounded border border-gray-700">
            {t.temperatureHelp}
          </div>
          {!loading && error && (
            <div className="text-sm text-red-400 mt-2">{error}</div>
          )}
          {!loading && !error && presets.length === 0 && (
            <div className="text-sm text-yellow-400 mt-2">
              {t.noAIPresetsAvailable}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemperatureConfig;

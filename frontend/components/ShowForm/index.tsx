import { useState, useEffect } from 'react';
import { fetchPersonas } from '../../services/apiService';
import { ComedianSelector } from './ComedianSelector';
import { FormInput } from './FormInput';
import { NumberInput } from './NumberInput';
import { CheckboxWithTooltip } from './CheckboxWithTooltip';
import { SubmitButton } from './SubmitButton';
import TemperatureConfig from './TemperatureConfig';
import { UI, DEFAULTS } from '../../constants';

interface ShowFormProps {
  onSubmit: (params: {
    comedian1_style: string;
    comedian2_style: string;
    lang: string;
    topic: string;
    num_rounds: number;
    roast_mode: boolean;
    tts_mode: boolean;
    temperature?: number;
  }) => void;
  loading: boolean;
  lang: string;
  t: {
    customize: string;
    comedian1: string;
    comedian2: string;
    language: string;
    topic: string;
    numRounds: string;
    roastMode: string;
    ttsMode: string;
    generate: string;
    generating: string;
    placeholder: string;
    roastModeTooltip: string;
    ttsModeTooltip: string;
    numRoundsTooltip: string;
  };
}

export default function ShowForm({ onSubmit, loading, lang, t }: ShowFormProps) {
  const [comedian1, setComedian1] = useState<string>(DEFAULTS.COMEDIAN1);
  const [comedian2, setComedian2] = useState<string>(DEFAULTS.COMEDIAN2);
  const [topic, setTopic] = useState('');
  const [numRounds, setNumRounds] = useState<number>(DEFAULTS.NUM_ROUNDS);
  const [roastMode, setRoastMode] = useState<boolean>(DEFAULTS.ROAST_MODE);
  const [ttsMode, setTtsMode] = useState<boolean>(DEFAULTS.TTS_MODE);
  const [temperature, setTemperature] = useState<number>(0.9);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [personas, setPersonas] = useState<{[key: string]: {description: string; description_pl: string}} | null>(null);

  useEffect(() => {
    fetchPersonas()
      .then(setPersonas)
      .catch(() => setPersonas(null));
  }, []);

  const personaOptions = personas ? Object.keys(personas) : [];

  return (
    <section className="w-full flex flex-col items-center mb-10">
      <form
        className="flex flex-col gap-6 p-8 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-800 backdrop-blur-lg mt-4"
        onSubmit={e => {
          e.preventDefault();
          onSubmit({
            comedian1_style: comedian1,
            comedian2_style: comedian2,
            lang,
            topic,
            num_rounds: numRounds,
            roast_mode: roastMode,
            tts_mode: ttsMode,
            temperature: temperature,
          });
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100 tracking-tight">{t.customize}</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <ComedianSelector
            label={t.comedian1}
            value={comedian1}
            onChange={setComedian1}
            personaOptions={personaOptions}
            personas={personas}
            lang={lang}
          />
          <ComedianSelector
            label={t.comedian2}
            value={comedian2}
            onChange={setComedian2}
            personaOptions={personaOptions}
            personas={personas}
            lang={lang}
          />
        </div>
        <FormInput
          label={t.topic}
          value={topic}
          onChange={setTopic}
          placeholder={t.placeholder}
        />
        <NumberInput
          value={numRounds}
          onChange={setNumRounds}
          min={UI.MIN_ROUNDS}
          max={UI.MAX_ROUNDS}
          label={t.numRounds}
          tooltip={t.numRoundsTooltip}
        />
        <div className="flex gap-6">
          <CheckboxWithTooltip
            checked={roastMode}
            onChange={setRoastMode}
            label={t.roastMode}
            tooltip={t.roastModeTooltip}
          />
          <CheckboxWithTooltip
            checked={ttsMode}
            onChange={setTtsMode}
            label={t.ttsMode}
            tooltip={t.ttsModeTooltip}
          />
        </div>
        
        <TemperatureConfig
          temperature={temperature}
          onTemperatureChange={setTemperature}
          isOpen={showAdvanced}
          onToggle={() => setShowAdvanced(!showAdvanced)}
          t={t}
        />
        
        <SubmitButton
          loading={loading}
          loadingText={t.generating}
          submitText={t.generate}
        />
      </form>
    </section>
  );
} 
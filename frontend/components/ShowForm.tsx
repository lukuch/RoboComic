import { useState, useEffect, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { fetchPersonas } from '../services/apiService';
import { toTitleCase } from '../utils/toTitleCase';

interface ShowFormProps {
  onSubmit: (params: {
    comedian1_style: string;
    comedian2_style: string;
    lang: string;
    topic: string;
    num_rounds: number;
    roast_mode: boolean;
    tts_mode: boolean;
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
  const [comedian1, setComedian1] = useState('uncle_heniek');
  const [comedian2, setComedian2] = useState('gen_z');
  const [topic, setTopic] = useState('');
  const [numRounds, setNumRounds] = useState(1);
  const [roastMode, setRoastMode] = useState(true);
  const [ttsMode, setTtsMode] = useState(true);
  const [personas, setPersonas] = useState<{[key: string]: {description: string; description_pl: string}} | null>(null);

  useEffect(() => {
    fetchPersonas()
      .then(data => setPersonas(data))
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
          });
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100 tracking-tight">{t.customize}</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">{t.comedian1}</label>
            <Listbox value={comedian1} onChange={setComedian1}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white/10 dark:bg-gray-800/40 border border-gray-400 dark:border-gray-700 py-2 pl-4 pr-10 text-left shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100">
                  <span className="block truncate">{toTitleCase(comedian1)}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/10 focus:outline-none">
                    {personaOptions.map((option) => (
                      <Listbox.Option
                        key={option}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`
                        }
                        value={option}
                      >
                        {({ selected }: { selected: boolean }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>{toTitleCase(option)}</span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                            <span className="block text-xs text-gray-500 dark:text-gray-400">{personas?.[option]?.[lang === 'pl' ? 'description_pl' : 'description']}</span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">{t.comedian2}</label>
            <Listbox value={comedian2} onChange={setComedian2}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white/10 dark:bg-gray-800/40 border border-gray-400 dark:border-gray-700 py-2 pl-4 pr-10 text-left shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100">
                  <span className="block truncate">{toTitleCase(comedian2)}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/10 focus:outline-none">
                    {personaOptions.map((option) => (
                      <Listbox.Option
                        key={option}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`
                        }
                        value={option}
                      >
                        {({ selected }: { selected: boolean }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>{toTitleCase(option)}</span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                            <span className="block text-xs text-gray-500 dark:text-gray-400">{personas?.[option]?.[lang === 'pl' ? 'description_pl' : 'description']}</span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">{t.topic}</label>
          <input className="w-full rounded-xl bg-white/10 dark:bg-gray-800/40 border border-gray-400 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition px-4 py-2 text-base placeholder-gray-400 dark:placeholder-gray-500" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t.placeholder} />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200 relative">
            {t.numRounds}
            <span className="relative group">
              <span className="ml-2 text-blue-500 cursor-pointer">?
                <span className="absolute left-1/2 -translate-x-1/2 mb-2 bottom-full w-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs rounded-lg shadow-lg px-3 py-2 z-30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none">
                  {t.numRoundsTooltip}
                </span>
              </span>
            </span>
          </label>
          <input type="number" min={1} max={10} className="w-full rounded-xl bg-white/10 dark:bg-gray-800/40 border border-gray-400 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition px-4 py-2 text-base placeholder-gray-400 dark:placeholder-gray-500" value={numRounds} onChange={e => setNumRounds(Number(e.target.value))} />
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked={roastMode} onChange={e => setRoastMode(e.target.checked)} />
            <span className="relative flex items-center">
              {t.roastMode}
              <span className="relative group">
                <span className="ml-2 text-blue-500 cursor-pointer">?
                  <span className="absolute left-1/2 -translate-x-1/2 mb-2 bottom-full w-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs rounded-lg shadow-lg px-3 py-2 z-30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none">
                    {t.roastModeTooltip}
                  </span>
                </span>
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" checked={ttsMode} onChange={e => setTtsMode(e.target.checked)} />
            <span className="relative flex items-center">
              {t.ttsMode}
              <span className="relative group">
                <span className="ml-2 text-blue-500 cursor-pointer">?
                  <span className="absolute left-1/2 -translate-x-1/2 mb-2 bottom-full w-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs rounded-lg shadow-lg px-3 py-2 z-30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none">
                    {t.ttsModeTooltip}
                  </span>
                </span>
              </span>
            </span>
          </div>
        </div>
        <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-xl font-bold text-lg shadow hover:from-blue-700 hover:to-blue-500 transition disabled:opacity-50" disabled={loading}>
          {loading ? t.generating : t.generate}
        </button>
      </form>
    </section>
  );
} 
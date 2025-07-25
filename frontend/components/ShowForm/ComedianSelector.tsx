import { Fragment } from "react";
import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { toTitleCase } from "../../utils/stringUtils";

interface ComedianSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  personaOptions: string[];
  personas: {
    [key: string]: { description: string; description_pl: string };
  } | null;
  lang: string;
}

export function ComedianSelector({
  label,
  value,
  onChange,
  personaOptions,
  personas,
  lang,
}: ComedianSelectorProps) {
  if (!personas) {
    // Skeleton placeholder for loading
    return (
      <div className="flex-1">
        <div className="relative">
          <div
            className="relative w-full cursor-pointer rounded-xl bg-white/10 dark:bg-gray-800/40 border border-gray-400 dark:border-gray-700 py-2 pl-4 pr-10 text-left shadow flex items-center animate-pulse"
            style={{ height: "42px" }}
          >
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </span>
          </div>
        </div>
      </div>
    );
  }
  let badgeIcon = null;
  if (label.toLowerCase().includes("1")) {
    badgeIcon = (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-base shadow-md drop-shadow border border-white">
        1
      </span>
    );
  } else if (label.toLowerCase().includes("2")) {
    badgeIcon = (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold text-base shadow-md drop-shadow border border-white">
        2
      </span>
    );
  }
  const personaLabel = lang === "pl" ? "Persona Komika" : "Comedian Persona";
  return (
    <div className="flex-1">
      <div className="flex flex-col items-center gap-1 mb-1">
        {badgeIcon}
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {personaLabel}
        </span>
      </div>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton
            className="relative w-full cursor-pointer rounded-xl bg-white/10 dark:bg-gray-800/40 border border-gray-400 dark:border-gray-700 py-2 pl-4 pr-10 text-left shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100"
            data-testid={`comedian-selector-${label.replace(/\s+/g, "").toLowerCase()}`}
          >
            <span className="block truncate">{toTitleCase(value)}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/10 focus:outline-none scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-900 scrollbar-rounded-lg hover:scrollbar-thumb-zinc-400 dark:hover:scrollbar-thumb-zinc-500">
              {personaOptions.map((option) => (
                <ListboxOption
                  key={option}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-100"}`
                  }
                  value={option}
                >
                  {({ selected }: { selected: boolean }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-bold" : "font-normal"}`}
                      >
                        {toTitleCase(option)}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {
                          personas?.[option]?.[
                            lang === "pl" ? "description_pl" : "description"
                          ]
                        }
                      </span>
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

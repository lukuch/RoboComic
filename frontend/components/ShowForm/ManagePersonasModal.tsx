import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { FiEdit2, FiX, FiUsers, FiPlus, FiCheck } from "react-icons/fi";
import type { TranslationStrings } from "../../types";

interface ManagePersonasModalProps {
  open: boolean;
  onClose: () => void;
  t: TranslationStrings;
}

interface PersonaRow {
  id: string;
  name: string;
  description: string;
  description_pl: string;
  user_id: string;
}

export default function ManagePersonasModal({
  open,
  onClose,
  t,
}: ManagePersonasModalProps) {
  const { user } = useAuth();
  const [personas, setPersonas] = useState<PersonaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    description_pl: "",
  });
  const [editing, setEditing] = useState<string | null>(null);

  // Fetch user personas
  useEffect(() => {
    if (open && user) {
      setLoading(true);
      supabase
        .from("personas")
        .select("*")
        .eq("user_id", user.id)
        .then(({ data, error }) => {
          if (error) {
            setPersonas([]);
          } else {
            setPersonas((data as PersonaRow[]) || []);
          }
          setLoading(false);
        });
    }
  }, [open, user]);

  // Add or update persona
  const handleSave = async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    if (editing) {
      await supabase
        .from("personas")
        .update(form)
        .eq("id", editing)
        .eq("user_id", user.id);
    } else {
      await supabase.from("personas").insert([{ ...form, user_id: user.id }]);
    }
    setForm({ name: "", description: "", description_pl: "" });
    setEditing(null);
    // Refresh list
    const { data } = await supabase
      .from("personas")
      .select("*")
      .eq("user_id", user.id);
    setPersonas((data as PersonaRow[]) || []);
    setLoading(false);
  };

  // Delete persona
  const handleDelete = async (id: string) => {
    if (!user) {
      return;
    }
    setLoading(true);
    await supabase
      .from("personas")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    setPersonas(personas.filter((p) => p.id !== id));
    setLoading(false);
  };

  // Start editing
  const startEdit = (persona: PersonaRow) => {
    setForm({
      name: persona.name,
      description: persona.description,
      description_pl: persona.description_pl,
    });
    setEditing(persona.id);
  };

  // Cancel editing
  const cancelEdit = () => {
    setForm({ name: "", description: "", description_pl: "" });
    setEditing(null);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-70" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900/95 border border-blue-700 p-10 text-left align-middle shadow-2xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3"
                >
                  <FiUsers className="w-7 h-7 text-blue-400" />
                  {t.managePersonas}
                </DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.close}
                  className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2 transition"
                >
                  <FiX className="w-6 h-6" />
                </button>
                <div className="flex-1 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-900 scrollbar-rounded-lg hover:scrollbar-thumb-zinc-400 dark:hover:scrollbar-thumb-zinc-500">
                  {personas.map((p) => (
                    <div
                      key={p.name}
                      className="bg-white/90 dark:bg-gray-900/80 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-4 flex flex-col gap-2 transition hover:shadow-lg hover:-translate-y-1 mx-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                            {p.name}
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {p.description}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {p.description_pl}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="text-blue-400 hover:text-blue-200"
                            onClick={() => startEdit(p)}
                            title={t.update}
                            aria-label={t.update}
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-400 hover:text-red-200 mr-2"
                            onClick={() => handleDelete(p.id)}
                            title={t.cancel}
                            aria-label={t.cancel}
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-col space-y-5 p-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-900 scrollbar-rounded-lg hover:scrollbar-thumb-zinc-400 dark:hover:scrollbar-thumb-zinc-500 overflow-y-auto">
                  <input
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 px-4 py-2 mb-2 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                    placeholder={t.name}
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    maxLength={40}
                    autoFocus
                  />
                  <textarea
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 px-4 py-2 mb-2 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition resize-none scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-900 scrollbar-rounded-lg hover:scrollbar-thumb-zinc-400 dark:hover:scrollbar-thumb-zinc-500"
                    placeholder={t.descriptionEn}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    maxLength={200}
                  />
                  <textarea
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 px-4 py-2 mb-2 text-base shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition resize-none scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-zinc-900 scrollbar-rounded-lg hover:scrollbar-thumb-zinc-400 dark:hover:scrollbar-thumb-zinc-500"
                    placeholder={t.descriptionPl}
                    value={form.description_pl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description_pl: e.target.value }))
                    }
                    maxLength={200}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className={`${editing ? "w-full" : "w-3/4 mx-auto"} mt-2 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-md hover:brightness-110 hover:scale-[1.01] transition-all duration-150 flex items-center justify-center`}
                      onClick={handleSave}
                      disabled={loading || !form.name}
                    >
                      {editing ? (
                        <FiCheck className="w-5 h-5 mr-2" />
                      ) : (
                        <FiPlus className="w-5 h-5 mr-2" />
                      )}
                      {editing ? t.update : t.add}
                    </button>
                    {editing && (
                      <button
                        type="button"
                        className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-bold text-lg shadow-md hover:brightness-110 hover:scale-[1.01] transition-all duration-150 flex items-center justify-center"
                        onClick={cancelEdit}
                        disabled={loading}
                      >
                        <FiX className="w-5 h-5 mr-2" />
                        {t.cancel}
                      </button>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

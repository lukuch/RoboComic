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
import { FiEdit2, FiX, FiUsers } from "react-icons/fi";
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
                <div className="space-y-6 max-h-[240px] overflow-y-auto pr-2 persona-scrollbar">
                  {personas.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {p.description}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
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
                  ))}
                </div>
                <div className="mt-8 flex flex-col space-y-5">
                  <input
                    className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.name}
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    disabled={loading}
                  />
                  <textarea
                    className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[60px]"
                    placeholder={t.descriptionEn}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    disabled={loading}
                  />
                  <textarea
                    className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[60px]"
                    placeholder={t.descriptionPl}
                    value={form.description_pl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description_pl: e.target.value }))
                    }
                    disabled={loading}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 rounded-xl shadow hover:from-blue-600 hover:to-purple-700 transition"
                      onClick={handleSave}
                      disabled={loading || !form.name}
                    >
                      {editing ? t.update : t.add}
                    </button>
                    {editing && (
                      <button
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold py-2 rounded-xl shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        onClick={cancelEdit}
                        disabled={loading}
                      >
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

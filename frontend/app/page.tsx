"use client";

import { useState } from "react";
import Home from "./Home";
import AuthForm from "../components/Auth/AuthForm";
import { useAuth } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";
import Tooltip from "../components/shared/Tooltip";

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setShowAuth(false);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {user ? (
          <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 px-5 py-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <Tooltip content={user.email || ""}>
              <span className="text-gray-900 dark:text-gray-100 font-semibold truncate max-w-[160px] cursor-pointer">
                {user.email}
              </span>
            </Tooltip>
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-red-600 hover:to-pink-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-2"
          >
            <FaUser className="text-xl" />
            Login
          </button>
        )}
      </div>
      <Home />
      {showAuth && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <AuthForm />
          </div>
        </div>
      )}
    </>
  );
}

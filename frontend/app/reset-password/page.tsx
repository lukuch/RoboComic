"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";

function getTokenFromHash(hash: string, key: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return params.get(key);
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Extract tokens from query or hash on mount
  useEffect(() => {
    let at = searchParams.get("access_token");
    let rt = searchParams.get("refresh_token");
    if (typeof window !== "undefined" && (!at || !rt)) {
      at = getTokenFromHash(window.location.hash, "access_token");
      rt = getTokenFromHash(window.location.hash, "refresh_token");
    }
    setAccessToken(at);
    setRefreshToken(rt);
  }, [searchParams]);

  // Set session when tokens are available
  useEffect(() => {
    async function setSession() {
      if (accessToken && refreshToken) {
        setCheckingSession(true);
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        setCheckingSession(false);
        if (error) {
          setError("Invalid or expired password reset link.");
        } else {
          setSessionReady(true);
        }
      } else if (accessToken === null && refreshToken === null) {
        setCheckingSession(false);
        setError("Invalid or missing password reset token.");
      }
    }
    setSession();
    // eslint-disable-next-line
  }, [accessToken, refreshToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!sessionReady) {
      setError("Invalid or missing password reset token.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 px-4">
      <div className="w-[440px] max-w-full mx-auto p-0 rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 animate-fadeIn">
        <div className="flex flex-col items-center py-8 px-12 w-full">
          <div className="mb-6 flex items-center justify-center gap-4">
            <Image
              src="/icon-192x192.png"
              alt="RoboComic Icon"
              width={48}
              height={48}
              className="inline-block align-middle"
            />
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">
              RoboComic
            </span>
          </div>
          <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
            Reset Your Password
          </h2>
          {checkingSession && (
            <div className="mb-4 text-blue-600 dark:text-blue-400">
              Processing...
            </div>
          )}
          {success ? (
            <>
              <p className="text-green-700 dark:text-green-400 mb-4 text-center">
                Your password has been updated! You can now log in with your new
                password.
              </p>
              <div className="flex justify-end w-full mt-4">
                <button
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  type="button"
                  onClick={() => router.push("/")}
                >
                  Back to app
                </button>
              </div>
            </>
          ) : sessionReady ? (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 text-blue-400 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200"
                    onClick={() => setShowNewPassword((v) => !v)}
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaRegEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 text-blue-400 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaRegEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-60 mt-4"
                >
                  {loading ? "Updating..." : "Reset Password"}
                </button>
                <div className="flex justify-end w-full mt-4">
                  <button
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    type="button"
                    onClick={() => router.push("/")}
                  >
                    Back to app
                  </button>
                </div>
              </div>
            </form>
          ) : null}
          {!sessionReady && !checkingSession && error && (
            <div className="mt-4 text-red-600 text-center font-medium">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

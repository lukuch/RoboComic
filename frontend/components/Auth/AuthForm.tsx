"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import { FaEyeSlash, FaRegEnvelope, FaRegEye } from "react-icons/fa";

const AuthForm: React.FC = () => {
  const { signUp, signIn, signInWithGoogle, user, loading, resetPassword } =
    useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    if (isRegister) {
      const { error } = await signUp(email, password);
      if (!error) {
        setRegistrationSuccess(true);
      } else if (error.toLowerCase().includes("user already registered")) {
        setError(
          'This email is already registered. Please log in or use the password reset option. If you registered with Google, use "Sign in with Google".',
        );
      } else {
        setError(error);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error && error.toLowerCase().includes("email not confirmed")) {
        setError(
          "Please confirm your email before logging in. Check your inbox for the confirmation link.",
        );
      } else if (
        error &&
        error.toLowerCase().includes("invalid login credentials")
      ) {
        setError(
          'Invalid email or password. If you registered with Google, use "Sign in with Google".',
        );
      } else {
        setError(error);
      }
    }
    setFormLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    const { error } = await resetPassword(email);
    if (!error) {
      setResetSuccess(true);
    } else {
      setError(error);
    }
    setFormLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-8 w-8 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      </div>
    );
  }
  if (user) {
    return (
      <div className="p-6 bg-green-50 rounded-lg shadow text-center">
        <div className="text-2xl font-semibold mb-2">
          Welcome, {user.email}!
        </div>
        <div className="text-green-700">You are logged in.</div>
      </div>
    );
  }

  if (registrationSuccess) {
    return (
      <div className="max-w-[672px] mx-auto p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 animate-fadeIn flex flex-col items-center">
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
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          Registration Successful!
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-200 mb-4">
          Please check your email and click the confirmation link to activate
          your account before logging in.
        </p>
        <button
          className="w-full text-blue-600 dark:text-blue-400 hover:underline mt-2"
          type="button"
          onClick={() => {
            setIsRegister(false);
            setRegistrationSuccess(false);
          }}
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (showReset) {
    return (
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
            Reset Password
          </h2>
          <form onSubmit={handleReset} className="space-y-4 w-full">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <span className="absolute right-3 top-2.5 text-blue-400 dark:text-blue-300">
                  <FaRegEnvelope className="h-5 w-5" />
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <button
                type="submit"
                disabled={formLoading}
                className="w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-60 mt-4"
              >
                {formLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="flex justify-end w-full mt-4">
                <button
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  type="button"
                  onClick={() => {
                    setShowReset(false);
                    setResetSuccess(false);
                    setError(null);
                  }}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
          {resetSuccess && (
            <div className="mt-4 text-green-700 dark:text-green-400 text-center font-medium">
              If an account with that email exists, a password reset link has
              been sent. Please check your inbox.
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-600 text-center font-medium">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
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
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          {isRegister ? "Create an Account" : "Sign In"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <span className="absolute right-3 top-2.5 text-blue-400 dark:text-blue-300">
                <FaRegEnvelope className="h-5 w-5" />
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
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
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
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
              disabled={formLoading}
              className="w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-60 mt-4"
            >
              {formLoading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              )}
              {isRegister ? "Register" : "Login"}
            </button>
            {!isRegister && (
              <div className="flex justify-end w-full mt-4">
                <button
                  type="button"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setShowReset(true);
                    setError(null);
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </form>
        <div className="my-6 flex items-center w-full">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="mx-4 text-gray-400 text-sm font-medium">or</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-800 transition mb-2"
          type="button"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
            <g>
              <path
                fill="#4285F4"
                d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.98 17.56 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.67 28.29a14.5 14.5 0 010-8.58l-7.98-6.2A23.94 23.94 0 000 24c0 3.77.9 7.34 2.69 10.49l7.98-6.2z"
              />
              <path
                fill="#EA4335"
                d="M24 46c6.13 0 11.64-2.02 15.85-5.5l-7.19-5.59c-2.01 1.35-4.6 2.16-8.66 2.16-6.44 0-11.87-4.48-13.33-10.49l-7.98 6.2C6.73 42.18 14.82 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </g>
          </svg>
          Sign in with Google
        </button>
        <button
          onClick={() => setIsRegister((r) => !r)}
          className="w-full text-blue-600 dark:text-blue-400 hover:underline mt-2"
          type="button"
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
        {error && (
          <div className="mt-4 text-red-600 text-center font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;

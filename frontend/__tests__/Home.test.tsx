import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../app/Home/index";
import { act } from "react";
import { AuthProvider } from "../context/AuthContext";
import { TRANSLATIONS } from "../app/Home/translations";

let mockUseShowGeneration: any = () => ({
  history: [],
  loading: false,
  error: null,
  ttsMode: false,
  comedian1: "comedian1",
  comedian2: "comedian2",
  generateShow: jest.fn(),
  clearError: jest.fn(),
});
let mockLang = "en";
jest.mock("../hooks/useShowGeneration", () => ({
  useShowGeneration: () => mockUseShowGeneration(),
}));
jest.mock("../hooks/useLanguage", () => ({
  useLanguage: () => ({ lang: mockLang, setLang: jest.fn() }),
}));
jest.mock("../services/apiService", () => ({
  fetchVoiceIds: jest.fn(() => Promise.resolve({})),
  fetchPersonas: jest.fn(() => Promise.resolve({})),
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          personas: {
            comedian1: { description: "desc", description_pl: "desc_pl" },
            comedian2: { description: "desc", description_pl: "desc_pl" },
          },
        }),
    }),
  ) as jest.Mock;
});

describe("Home", () => {
  it("renders main UI components", async () => {
    mockUseShowGeneration = () => ({
      history: [],
      loading: false,
      error: null,
      ttsMode: false,
      comedian1: "comedian1",
      comedian2: "comedian2",
      generateShow: jest.fn(),
      clearError: jest.fn(),
    });
    mockLang = "en";
    await act(async () => {
      render(
        <AuthProvider>
          <Home
            lang={mockLang}
            setLang={jest.fn()}
            t={TRANSLATIONS[mockLang as "en" | "pl"]}
          />
        </AuthProvider>,
      );
    });
    expect(
      screen.getAllByRole("heading", { name: /RoboComic AI/i })[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: /Customize/i })[0],
    ).toBeInTheDocument();
    expect(screen.getByTestId("main-form")).toBeInTheDocument();
  });

  it("shows loading overlay when loading", async () => {
    mockUseShowGeneration = () => ({
      history: [],
      loading: true,
      error: null,
      ttsMode: false,
      comedian1: "comedian1",
      comedian2: "comedian2",
      generateShow: jest.fn(),
      clearError: jest.fn(),
    });
    mockLang = "en";
    await act(async () => {
      render(
        <AuthProvider>
          <Home
            lang={mockLang}
            setLang={jest.fn()}
            t={TRANSLATIONS[mockLang as "en" | "pl"]}
          />
        </AuthProvider>,
      );
    });
    expect(screen.getByTestId("loading-overlay")).toBeInTheDocument();
  });

  it("shows error display when error exists", async () => {
    mockUseShowGeneration = () => ({
      history: [],
      loading: false,
      error: "Something went wrong!",
      ttsMode: false,
      comedian1: "comedian1",
      comedian2: "comedian2",
      generateShow: jest.fn(),
      clearError: jest.fn(),
    });
    mockLang = "en";
    await act(async () => {
      render(
        <AuthProvider>
          <Home
            lang={mockLang}
            setLang={jest.fn()}
            t={TRANSLATIONS[mockLang as "en" | "pl"]}
          />
        </AuthProvider>,
      );
    });
    expect(screen.getByTestId("error-display")).toBeInTheDocument();
  });

  it("renders Polish translations when language is set to 'pl'", async () => {
    mockUseShowGeneration = () => ({
      history: [],
      loading: false,
      error: null,
      ttsMode: false,
      comedian1: "comedian1",
      comedian2: "comedian2",
      generateShow: jest.fn(),
      clearError: jest.fn(),
    });
    mockLang = "pl";
    await act(async () => {
      render(
        <AuthProvider>
          <Home
            lang={mockLang}
            setLang={jest.fn()}
            t={TRANSLATIONS[mockLang as "en" | "pl"]}
          />
        </AuthProvider>,
      );
    });
    expect(screen.getByText(/Dostosuj pojedynek komików/i)).toBeInTheDocument();
    expect(screen.getByText(/Rozpocznij show/i)).toBeInTheDocument();
  });
});

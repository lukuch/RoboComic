import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../app/Home/index";
import { TRANSLATIONS } from "../app/Home/translations";
import { act } from "react";

// Mock dependencies as needed
jest.mock("../hooks/useShowGeneration", () => ({
  useShowGeneration: () => ({
    history: [],
    loading: false,
    error: null,
    ttsMode: false,
    comedian1: "comedian1",
    comedian2: "comedian2",
    generateShow: jest.fn(),
    clearError: jest.fn(),
  }),
}));
jest.mock("../hooks/useLanguage", () => ({
  useLanguage: () => ({ lang: "en", setLang: jest.fn() }),
}));
jest.mock("../services/apiService", () => ({
  fetchVoiceIds: jest.fn(() => Promise.resolve({})),
  fetchPersonas: jest.fn(() => Promise.resolve({})),
}));

describe("Home", () => {
  it("renders main UI components", async () => {
    await act(async () => {
      render(<Home />);
    });
    // There are multiple headings, check for expected text
    expect(
      screen.getAllByRole("heading", { name: /RoboComic AI/i })[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: /Customize/i })[0],
    ).toBeInTheDocument();
    // Find the form by test id
    expect(screen.getByTestId("main-form")).toBeInTheDocument();
    // screen.debug();
  });

  it("shows loading overlay when loading", () => {
    // TODO: Implement test for loading overlay
  });

  it("shows error display when error exists", () => {
    // TODO: Implement test for error display
  });
});

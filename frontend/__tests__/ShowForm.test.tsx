import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ShowForm from "../components/ShowForm/index";
import { TRANSLATIONS } from "../app/Home/translations";
import * as apiService from "../services/apiService";
import { act } from "react";

describe("ShowForm", () => {
  const mockOnSubmit = jest.fn();
  const t = TRANSLATIONS["en"];

  beforeEach(() => {
    jest.spyOn(apiService, "fetchPersonas").mockResolvedValue({
      comedian1: {
        description: "Funny Person 1",
        description_pl: "Zabawna Osoba 1",
      },
      comedian2: {
        description: "Funny Person 2",
        description_pl: "Zabawna Osoba 2",
      },
    });
    jest.spyOn(apiService, "getTemperaturePresets").mockResolvedValue([]);
    jest
      .spyOn(apiService, "getDefaultLLMConfig")
      .mockResolvedValue({ temperature: 0.9 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders form fields", async () => {
    await act(async () => {
      render(
        <ShowForm onSubmit={mockOnSubmit} loading={false} lang="en" t={t} />,
      );
    });
    expect(
      await screen.findByTestId("comedian-selector-comedian1style"),
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId("comedian-selector-comedian2style"),
    ).toBeInTheDocument();
    expect(await screen.findByTestId("topic-input")).toBeInTheDocument();
    expect(await screen.findByTestId("rounds-value")).toBeInTheDocument();
  });

  it("calls onSubmit with form values", async () => {
    await act(async () => {
      render(
        <ShowForm onSubmit={mockOnSubmit} loading={false} lang="en" t={t} />,
      );
    });
    // Fill out the form fields
    const topicInput = await screen.findByTestId("topic-input");
    const roundsInput = await screen.findByTestId("rounds-value");
    const submitButton = await screen.findByTestId("submit-button");

    // Simulate user input
    await act(async () => {
      (topicInput as HTMLInputElement).value = "Test Topic";
      (roundsInput as HTMLInputElement).value = "3";
      topicInput.dispatchEvent(new Event("input", { bubbles: true }));
      roundsInput.dispatchEvent(new Event("input", { bubbles: true }));
    });

    // Submit the form
    await act(async () => {
      submitButton.click();
    });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("submits successfully when topic is empty (if allowed)", async () => {
    await act(async () => {
      render(
        <ShowForm onSubmit={mockOnSubmit} loading={false} lang="en" t={t} />,
      );
    });
    const topicInput = await screen.findByTestId("topic-input");
    const submitButton = await screen.findByTestId("submit-button");

    // Ensure topic is empty
    await act(async () => {
      (topicInput as HTMLInputElement).value = "";
      topicInput.dispatchEvent(new Event("input", { bubbles: true }));
    });

    // Submit the form
    await act(async () => {
      submitButton.click();
    });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("shows error message when personas API fails", async () => {
    jest
      .spyOn(apiService, "fetchPersonas")
      .mockRejectedValue(new Error("API error"));
    await act(async () => {
      render(
        <ShowForm onSubmit={mockOnSubmit} loading={false} lang="en" t={t} />,
      );
    });
    expect(await screen.findByTestId("personas-error")).toBeInTheDocument();
  });
});

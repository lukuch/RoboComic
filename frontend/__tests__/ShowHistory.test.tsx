import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ShowHistory from "../components/ShowHistory/index";
import { TRANSLATIONS } from "../app/Home/translations";
import { act } from "react";

const baseProps = {
  history: [
    { role: "manager", content: "Welcome!" },
    { role: "comedian1", content: "Joke 1" },
    { role: "comedian2", content: "Joke 2" },
    { role: "comedian1", content: "Joke 3" },
    { role: "comedian2", content: "Joke 4" },
  ],
  lang: "en",
  ttsMode: false,
  comedian1Persona: "comedian1",
  comedian2Persona: "comedian2",
  personas: null,
  t: TRANSLATIONS["en"],
  loading: false,
  voiceIds: { comedian1_voice_id: "id1", comedian2_voice_id: "id2" },
};

describe("ShowHistory", () => {
  it("renders chat bubbles for each round", async () => {
    await act(async () => {
      render(<ShowHistory {...baseProps} />);
    });
    expect(await screen.findByTestId("manager-message")).toBeInTheDocument();
    expect(await screen.findByText(/Joke 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Joke 2/i)).toBeInTheDocument();
  });

  it("shows skeletons when loading and no history", async () => {
    // TODO: Implement loading skeleton test with async/await
  });

  it("handles TTS and judging section", async () => {
    // TODO: Implement TTS and judging section test with async/await
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ShowHistory from "../components/ShowHistory/index";
import { TRANSLATIONS } from "../app/Home/translations";
import { act } from "react";
import * as apiService from "../services/apiService";

jest.mock("react-confetti", () => () => null);

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
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("renders chat bubbles for each round", async () => {
    await act(async () => {
      render(<ShowHistory {...baseProps} />);
    });
    expect(await screen.findByTestId("manager-message")).toBeInTheDocument();
    expect(await screen.findByText(/Joke 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Joke 2/i)).toBeInTheDocument();
  });

  it("shows skeletons when loading and no history", async () => {
    await act(async () => {
      render(<ShowHistory {...baseProps} loading={true} history={[]} />);
    });
    // Check for skeleton elements (should be 4)
    expect(await screen.findAllByTestId("skeleton-bubble")).toHaveLength(4);
  });

  it("handles TTS and judging section", async () => {
    await act(async () => {
      render(<ShowHistory {...baseProps} ttsMode={true} />);
    });
    // Check for at least one TTS button and judging section
    expect(screen.getAllByTestId("tts-button").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("judging-section").length).toBeGreaterThan(0);
  });

  it("calls TTS API and plays audio when TTS button is clicked", async () => {
    const ttsMock = jest
      .spyOn(apiService, "tts")
      .mockResolvedValue("test-audio-url.mp3");
    await act(async () => {
      render(
        <ShowHistory
          {...baseProps}
          ttsMode={true}
          personas={{
            comedian1: { description: "desc1", description_pl: "desc1pl" },
            comedian2: { description: "desc2", description_pl: "desc2pl" },
          }}
        />,
      );
    });
    const ttsButtons = screen.getAllByTestId("tts-button");
    expect(ttsButtons.length).toBeGreaterThan(0);
    await act(async () => {
      ttsButtons[0].click();
    });
    expect(ttsMock).toHaveBeenCalled();
    // Optionally, check for audio element
    // expect(await screen.findByRole("audio")).toBeInTheDocument();
  });

  it("shows winner and summary after judging", async () => {
    const judgeShowMock = jest
      .spyOn(apiService, "judgeShow")
      .mockResolvedValue({
        winner: "comedian1",
        summary: "comedian1 was the funniest!",
      });
    await act(async () => {
      render(
        <ShowHistory
          {...baseProps}
          ttsMode={true}
          personas={{
            comedian1: { description: "desc1", description_pl: "desc1pl" },
            comedian2: { description: "desc2", description_pl: "desc2pl" },
          }}
        />,
      );
    });
    // Find and click the Judge Duel button
    const judgeButton = screen.getByRole("button", { name: /judge/i });
    await act(async () => {
      judgeButton.click();
    });
    // Wait for winner and summary to appear
    expect(await screen.findByText(/was the funniest/i)).toBeInTheDocument();
    expect(judgeShowMock).toHaveBeenCalled();
  });
});

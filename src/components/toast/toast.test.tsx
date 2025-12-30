import { expect, test, describe } from "bun:test";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { ToastProvider, useToast } from "./use-toast";
import { ToastViewport } from "./toast"; // Import the viewport

const TestTrigger = () => {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast({ title: "Success!", type: "success" })}>
      Show
    </button>
  );
};

describe("JigsawUI Toast", () => {
  test("shows toast on trigger and removes on click", async () => {
    render(
      <ToastProvider>
        <ToastViewport />
        <TestTrigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText("Show"));
    expect(screen.getByText("Success!")).toBeTruthy();

    fireEvent.click(screen.getByText("×"));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 100));
    });

    expect(screen.queryByText("Success!")).toBeNull();
  });
});
test("applies correct styling based on toast type", async () => {
  const TestTrigger = () => {
    const { addToast } = useToast();
    return (
      <button onClick={() => addToast({ title: "Error!", type: "error" })}>
        Trigger Error
      </button>
    );
  };

  render(
    <ToastProvider>
      <ToastViewport />
      <TestTrigger />
    </ToastProvider>
  );

  fireEvent.click(screen.getByText("Trigger Error"));

  const toast = screen.getByRole("status");

  // We check for the hex code since that's what the DOM received in this environment
  // Using toMatch allows it to pass whether it's the full '4px solid #ef4444' or just the color
  expect(toast.style.borderLeft).toMatch(/#ef4444|rgb\(239, 68, 68\)/);
});

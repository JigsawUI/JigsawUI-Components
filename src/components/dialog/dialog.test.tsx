import { expect, test, describe } from "bun:test";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "./dialog";

describe("JigsawUI Dialog", () => {
  test("closes when Close button is clicked", async () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose>
            <button>Close</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );

    const btn = screen.getByText("Close");
    fireEvent.click(btn);

    // We wait for the Presence fallback timer (500ms) to clear the DOM
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("closes when the Escape key is pressed", async () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogContent>
          <DialogTitle>Escape Test</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

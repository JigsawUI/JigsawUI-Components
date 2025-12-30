import { expect, test, describe } from "bun:test";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { Tooltip } from "./tooltip";

describe("JigsawUI Tooltip", () => {
  test("shows on hover after a delay", async () => {
    render(
      <Tooltip content="Helper text" delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me");
    fireEvent.mouseEnter(trigger);

    // Should not be visible immediately
    expect(screen.queryByRole("tooltip")).toBeNull();

    // Wait for delay
    await act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });

    expect(screen.getByRole("tooltip").textContent).toBe("Helper text");

    fireEvent.mouseLeave(trigger);

    // Cleanup for Presence fallback
    await act(async () => {
      await new Promise((r) => setTimeout(r, 600));
    });

    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});

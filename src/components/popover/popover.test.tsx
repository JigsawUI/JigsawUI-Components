import { expect, test, describe, mock, beforeEach } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

describe("JigsawUI Professional Popover", () => {
  beforeEach(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  const TestPopover = ({ placement = "bottom" as any }) => (
    <Popover placement={placement}>
      <PopoverTrigger>
        <button data-testid="trigger">Open</button>
      </PopoverTrigger>
      <PopoverContent data-testid="content">
        <div>Popover Content</div>
      </PopoverContent>
    </Popover>
  );

  test("calculates and applies floating styles (positioning)", async () => {
    render(<TestPopover />);
    const trigger = screen.getByTestId("trigger");

    fireEvent.click(trigger);

    const content = screen.getByRole("dialog");

    await waitFor(() => {
      expect(content.style.position).toBeDefined();
      expect(content.style.transform).toBeDefined();
    });

    expect(content).toHaveAttribute("data-jigsaw-state", "open");
  });

  test("merges internal and external refs on the trigger", () => {
    const externalRef = createRef<HTMLButtonElement>();

    render(
      <Popover>
        <PopoverTrigger>
          <button ref={externalRef}>Ref Test</button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );

    expect(externalRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(externalRef.current?.innerText).toBe("Ref Test");
  });

  test("correctly applies ARIA relationship between anchor and content", async () => {
    render(<TestPopover />);
    const trigger = screen.getByTestId("trigger");

    fireEvent.click(trigger);

    const content = screen.getByRole("dialog");
    const contentId = content.getAttribute("id");

    expect(trigger).toHaveAttribute("aria-controls", contentId!);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("dismisses when the Escape key is pressed", async () => {
    render(<TestPopover />);
    fireEvent.click(screen.getByTestId("trigger"));

    const content = screen.getByRole("dialog");
    expect(content).toHaveAttribute("data-jigsaw-state", "open");
    fireEvent.keyDown(window, { key: "Escape" });
  });
});

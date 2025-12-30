import { expect, test, describe, mock } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";
import React from "react";

describe("JigsawUI Button", () => {
  test("renders as a button by default", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button.tagName).toBe("BUTTON");
  });

  test("renders as an anchor when the 'as' prop is provided", () => {
    render(
      <Button as="a" href="https://jigsawui.com">
        Link
      </Button>
    );
    const link = screen.getByRole("button", { name: /link/i });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://jigsawui.com");
  });

  test("prevents onClick execution when isLoading is true", () => {
    const handleClick = mock(() => {});
    render(
      <Button isLoading onClick={handleClick}>
        Submit
      </Button>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-jigsaw-state", "loading");
  });

  test("shows loader and hides label visually when loading", () => {
    render(<Button isLoading>Submit</Button>);

    const loader = document.querySelector("[data-jigsaw-loader]");
    const label = document.querySelector("[data-jigsaw-label]");

    expect(loader).toBeTruthy();
    expect(label).toHaveStyle({ visibility: "hidden" });
  });

  test("forwards refs correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

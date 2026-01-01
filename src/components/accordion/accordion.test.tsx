import { expect, test, describe } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

describe("JigsawUI Accordion", () => {
  test("toggles content visibility on click", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes, it follows WAI-ARIA patterns.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("closes other items in 'single' mode", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="1">
          <AccordionTrigger>T1</AccordionTrigger>
          <AccordionContent>C1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>T2</AccordionTrigger>
          <AccordionContent>C2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    fireEvent.click(screen.getByText("T1"));
    expect(screen.getByText("T1")).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByText("T2"));
    expect(screen.getByText("T1")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("T2")).toHaveAttribute("aria-expanded", "true");
  });
});

test("navigates between triggers with ArrowDown and ArrowUp", () => {
  render(
    <Accordion type="single">
      <AccordionItem value="1">
        <AccordionTrigger>Trigger 1</AccordionTrigger>
        <AccordionContent>C1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger>Trigger 2</AccordionTrigger>
        <AccordionContent>C2</AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  const firstTrigger = screen.getByText("Trigger 1");
  const secondTrigger = screen.getByText("Trigger 2");

  firstTrigger.focus();

  fireEvent.keyDown(firstTrigger, { key: "ArrowDown" });
  expect(document.activeElement).toBe(secondTrigger);

  fireEvent.keyDown(secondTrigger, { key: "ArrowUp" });
  expect(document.activeElement).toBe(firstTrigger);
});

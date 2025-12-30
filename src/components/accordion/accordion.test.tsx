import { expect, test, describe } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
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
          <AccordionTrigger value="item-1">Is it accessible?</AccordionTrigger>
          <AccordionContent value="item-1">
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
          <AccordionTrigger value="1">T1</AccordionTrigger>
          <AccordionContent value="1">C1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger value="2">T2</AccordionTrigger>
          <AccordionContent value="2">C2</AccordionContent>
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
        <AccordionTrigger value="1">Trigger 1</AccordionTrigger>
        <AccordionContent value="1">C1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger value="2">Trigger 2</AccordionTrigger>
        <AccordionContent value="2">C2</AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  const firstTrigger = screen.getByText("Trigger 1");
  const secondTrigger = screen.getByText("Trigger 2");

  firstTrigger.focus();

  // Down to second
  fireEvent.keyDown(firstTrigger, { key: "ArrowDown" });
  expect(document.activeElement).toBe(secondTrigger);

  // Up to first
  fireEvent.keyDown(secondTrigger, { key: "ArrowUp" });
  expect(document.activeElement).toBe(firstTrigger);
});
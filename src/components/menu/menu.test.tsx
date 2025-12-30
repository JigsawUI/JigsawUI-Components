import { expect, test, describe } from "bun:test";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { Menu, MenuTrigger, MenuContent, MenuItem } from "./menu";

describe("JigsawUI Menu", () => {
  test("opens and navigates between items with ArrowDown", async () => {
    render(
      <Menu>
        <MenuTrigger>
          <button>Open Menu</button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>
    );

    fireEvent.click(screen.getByText("Open Menu"));

    const menu = screen.getByRole("menu");
    const firstItem = screen.getByText("Edit");
    const secondItem = screen.getByText("Duplicate");

    // Corrected to keyDown (Capital D)
    fireEvent.keyDown(menu, { key: "ArrowDown", code: "ArrowDown" });
    expect(document.activeElement).toBe(firstItem);

    fireEvent.keyDown(menu, { key: "ArrowDown", code: "ArrowDown" });
    expect(document.activeElement).toBe(secondItem);
  });

  test("closes when an item is selected", async () => {
    render(
      <Menu>
        <MenuTrigger>
          <button>Open</button>
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Action</MenuItem>
        </MenuContent>
      </Menu>
    );

    fireEvent.click(screen.getByText("Open"));
    fireEvent.click(screen.getByText("Action"));

    // Wait for the Presence fallback timer (600ms)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 650));
    });

    expect(screen.queryByRole("menu")).toBeNull();
  });
});

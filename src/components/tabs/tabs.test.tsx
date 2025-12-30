import { expect, test, describe } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, TabList, Tab, TabPanel } from "./tabs";

describe("JigsawUI Tabs", () => {
  const TestTabs = () => (
    <Tabs defaultValue="account">
      <TabList>
        <Tab value="account">Account</Tab>
        <Tab value="password">Password</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="account">Account Content</TabPanel>
      <TabPanel value="password">Password Content</TabPanel>
      <TabPanel value="settings">Settings Content</TabPanel>
    </Tabs>
  );

  test("renders correct default content and accessibility attributes", () => {
    render(<TestTabs />);

    const activeTab = screen.getByRole("tab", { name: /account/i });
    expect(activeTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Account Content")).toBeVisible();
    expect(screen.queryByText("Password Content")).toBeNull();
  });

  test("switches content on click", async () => {
    render(<TestTabs />);

    const passwordTab = screen.getByRole("tab", { name: /password/i });
    fireEvent.click(passwordTab);

    expect(passwordTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Password Content")).toBeVisible();
    expect(screen.queryByText("Account Content")).toBeNull();
  });

  test("navigates with arrow keys (Horizontal)", () => {
    render(<TestTabs />);
    const firstTab = screen.getByRole("tab", { name: /account/i });

    firstTab.focus();

    fireEvent.keyDown(firstTab, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /password/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(document.activeElement).toHaveTextContent("Password");

    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /settings/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /account/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  test("jumps to start/end with Home and End keys", () => {
    render(<TestTabs />);
    const firstTab = screen.getByRole("tab", { name: /account/i });

    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: "End" });

    expect(screen.getByRole("tab", { name: /settings/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(screen.getByRole("tab", { name: /account/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});

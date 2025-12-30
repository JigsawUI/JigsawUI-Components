// happydom.ts
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "bun:test" {
  interface Matchers<T = unknown, Parent = any>
    extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

import { expect, afterEach } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";

// @ts-ignore
expect.extend(matchers);

afterEach(async () => {
  const { cleanup } = await import("@testing-library/react");
  cleanup();
});

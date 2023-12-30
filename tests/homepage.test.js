import { render, screen } from "../test-utils";
import "@testing-library/jest-dom";
import Home from "../pages/index";
import { describe } from "node:test";

describe("Homepage", () => {
  test("Homepage renders", async () => {
    render(<Home />);
    expect(screen.getByText("Homepage"));
  });

  test("Username displays correctly", async () => {
    render(<Home />);
    expect(screen.getByText("Nikos"));
  });
});

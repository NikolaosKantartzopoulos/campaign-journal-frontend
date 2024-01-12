import "@testing-library/jest-dom";
import { render, screen } from "../test-utils";
import Factions from "../pages/factions";

describe("Factions", () => {
  it("renders a heading", () => {
    render(<Factions />);

    const heading = screen.getByText("Factions");

    expect(heading).toBeInTheDocument();
  });
});

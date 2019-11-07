// TEST FILE FOR APPOINTMENT COMPONENT, ONLY HAS RENDER TEST AS MOST FUNCTIONALITY IS TESTED IN THE INTEGRATION TESTS
import React from "react";

import { render, cleanup } from "@testing-library/react";

import Appointment from "components/Appointment";

afterEach(cleanup);

describe('Appointment', () => {
  it("renders without crashing", () => {
    render(<Appointment />);
  });
});

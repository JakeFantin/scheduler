// FILE FOR INTERGRATION TESTS 
import React from "react";
import axios from 'axios';
import { render, cleanup, waitForElement, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryAllByText, waitForElementToBeRemoved } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

describe('Application', () => {
  it("default to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText('Monday'))
      .then(() => {
        fireEvent.click(getByText('Tuesday'));
        expect(getByText('Leopold Silvers')).toBeInTheDocument();
      });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />)

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointment = getAllByTestId(container, 'appointment')[0];
    
    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.click(getByAltText(appointment, 'Tori Malcolm'));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));

    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Confirm'));

    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();
    
    await waitForElementToBeRemoved(() => queryByText(appointment, 'Deleting'));
    
    const day = getAllByTestId(container, 'day').find(day => 
        queryByText(day, 'Monday')
      );

    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Edit'));
    
    expect(getByText(appointment, 'Cancel')).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const day = getAllByTestId(container, 'day').find(day => 
      queryByText(day, 'Monday')
    );

  expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Edit'));
    
    expect(getByText(appointment, 'Cancel')).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Save'));
    
    await waitForElementToBeRemoved(() => queryByText(appointment, 'Saving'));
  
    expect(getByText(appointment, 'Could not save appointment.')).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, 'Close'))

    expect(getByText(appointment, 'Cancel')).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Delete'));
    
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, 'Confirm'));
    
    await waitForElementToBeRemoved(() => queryByText(appointment, 'Deleting'));
  
    expect(getByText(appointment, 'Could not cancel appointment.')).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, 'Close'))

    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();

  });
});

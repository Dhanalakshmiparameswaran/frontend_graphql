import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { ADD_NEW_ROW, GET_STUDENTS } from "../../graphQl/graphQlMutations";
import { AddNewRow } from "../../components/addNewRow";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

const mocks = [
  {
    request: {
      query: ADD_NEW_ROW,
      variables: {
        roll_no: "123",
        name: "test",
        classSection: "A",
        mark: "85",
      },
    },
    result: {
      data: {
        addNewRow: {
          id: "1",
          roll_no: "123",
          name: "test",
          classSection: "A",
          mark: "85",
        },
      },
    },
  },
  {
    request: {
      query: GET_STUDENTS,
    },
    result: {
      data: {
        students: [
          {
            id: "1",
            roll_no: "123",
            name: "test",
            classSection: "A",
            mark: "85",
          },
        ],
      },
    },
  },
];

describe("addNewRow funtion", () => {
  beforeEach(() => {
    localStorage.setItem("userRole", "TEACHER");
  });

  afterEach(() => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  });

  test("renders Add New Student button", () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <AddNewRow />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(screen.getByText(/Add New Student/i)).toBeInTheDocument();
  });

  test("opens the dialog when Add New Student button is clicked", () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <AddNewRow />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/Add New Student/i));
    let button = screen.getAllByText("Add New Student")[0] as HTMLButtonElement;
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Add New Student");
  });

  test("submits the form and shows success alert", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <AddNewRow />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/Add New Student/i));

    fireEvent.change(screen.getByLabelText(/Roll No/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "test" },
    });
    fireEvent.change(screen.getByLabelText(/Class Section/i), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByLabelText(/Mark/i), {
      target: { value: "85" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Record Added Successfully/i)
      ).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Roll No/i)).toHaveValue("");
    expect(screen.getByLabelText(/Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Class Section/i)).toHaveValue("");
    expect(screen.getByLabelText(/Mark/i)).toHaveValue("");
  });

  test("handles logout correctly", () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <AddNewRow />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(/Logout/i));
    expect(localStorage.getItem("token")).toBeNull();
  });
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { DELETE_ROW, GET_STUDENTS } from "../../graphQl/graphQlMutations";
import TableData from "../../components/tableData";
import { MemoryRouter } from "react-router-dom";

const mockStudents = [
  { id: 1, name: "John Doe", roll_no: "101" },
  { id: 2, name: "Jane Smith", roll_no: "102" },
  { id: 3, name: "Alice Johnson", roll_no: "103" },
  { id: 4, name: "Bob Brown", roll_no: "104" },
  { id: 5, name: "Charlie Black", roll_no: "105" },
  { id: 6, name: "David White", roll_no: "106" },
  { id: 7, name: "Eva Green", roll_no: "107" },
  { id: 8, name: "Frank Gray", roll_no: "108" },
  { id: 9, name: "Grace Blue", roll_no: "109" },
  { id: 10, name: "Hannah Purple", roll_no: "110" },
  { id: 11, name: "Ivy Orange", roll_no: "111" },
];

const mocks = [
  {
    request: {
      query: GET_STUDENTS,
    },
    result: {
      data: {
        students: mockStudents,
      },
    },
  },
  {
    request: {
      query: DELETE_ROW,
      variables: { id: 1 },
    },
    result: {
      data: {
        deleteRow: { id: 1 },
      },
    },
  },
];

describe("TableData Component", () => {
  test("renders loading state", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter>
          <TableData />
        </MemoryRouter>
      </MockedProvider>
    );
    expect(screen.getByText(/Page Rendering.../i)).toBeInTheDocument();
  });

  test("renders error state", async () => {
    const errorMock = [
      {
        request: {
          query: GET_STUDENTS,
        },
        error: new Error("An error occurred"),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <MemoryRouter>
          <TableData />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error: An error occurred/i)).toBeInTheDocument();
    });
  });

  test("renders students and search functionality", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <TableData />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Search by Name or Roll Number/i), {
      target: { value: "John" },
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  test("handles pagination", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <TableData />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    const nextButton = screen.getByRole("button", { name: /Next/i });
    const previousButton = screen.getByRole("button", { name: /Previous/i });

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
  });
});

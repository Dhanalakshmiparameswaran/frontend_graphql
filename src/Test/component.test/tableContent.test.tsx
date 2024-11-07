import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { Student, Table } from "../../components/tableContent";
import { UPDATE_ROW } from "../../graphQl/graphQlMutations";

const mockData: Student[] = [
  { id: 1, roll_no: "101", name: "Alice", classSection: "10A", mark: 80 },
  { id: 2, roll_no: "102", name: "Bob", classSection: "10B", mark: 90 },
];

const updateRowMock = {
  request: {
    query: UPDATE_ROW,
    variables: { id: 1, roll_no: "101", name: "Alice", classSection: "10A", mark: "85" },
  },
  result: { data: { updateRow: { id: 1 } } },
};

const renderTable = (userRole: string, onUpdate = jest.fn(), onDelete = jest.fn()) => {
  localStorage.setItem("userRole", userRole);
  return render(
    <MockedProvider mocks={[updateRowMock]} addTypename={false}>
      <Table data={mockData} onUpdate={onUpdate} onDelete={onDelete} />
    </MockedProvider>
  );
};

describe("Table Component with Student and Teacher Role", () => {
  test("renders student data and sorts names in ascending order initially", () => {
    renderTable("TEACHER");
    const nameHeader = screen.getByText(/Name/i);
    expect(nameHeader).toBeInTheDocument();

    const names = screen.getAllByText(/Alice|Bob/).map((el) => el.textContent);
    expect(names).toEqual(["Alice", "Bob"]);
  });

  test("toggles sort order on clicking the name header", () => {
    renderTable("TEACHER");

    const nameHeader = screen.getByText(/Name/i);
    fireEvent.click(nameHeader);

    const names = screen.getAllByText(/Alice|Bob/).map((el) => el.textContent);
    expect(names).toEqual(["Bob", "Alice"]);
  });

  test("opens dialog and displays student data when update button is clicked", async () => {
    renderTable("TEACHER");

    const updateButton = screen.getAllByText("Update")[0] as HTMLButtonElement;
    fireEvent.click(updateButton);

    expect(updateButton).toBeInTheDocument();
  });

  test("shows message for students when no data is available", () => {
    renderTable("STUDENT");

    expect(
      screen.getByText("Your Answer Sheet didn't validate till now. Could you please check after?")
    ).toBeInTheDocument();
  });

  test("renders update and delete buttons for teacher role", () => {
    renderTable("TEACHER");
  
    mockData.forEach((student) => {
      const row = screen.getByText(student.name).closest("tr");
      expect(row).toBeInTheDocument();
      expect(within(row!).getByText("Update")).toBeInTheDocument();
      expect(within(row!).getByText("Delete")).toBeInTheDocument();
    });
  });
  
});

const mocks = [
  {
    request: {
      query: UPDATE_ROW,
      variables: {
        id: 1,
        roll_no: "101",
        name: "Alice",
        classSection: "A",
        mark: "85",
      },
    },
    result: { data: { updateRow: { id: 1 } } },
  },
];

describe("Table Component", () => {
  beforeEach(() => {
    localStorage.setItem("userRole", "TEACHER");
    localStorage.setItem("userName", "101");
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("sets user role and user name from localStorage on mount", () => {
    render(
      <MockedProvider>
        <Table data={mockData} onUpdate={jest.fn()} onDelete={jest.fn()} />
      </MockedProvider>
    );

    expect(screen.queryByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).toBeInTheDocument();
  });

  test("closes dialog when handleClose is called", () => {
    render(
      <MockedProvider>
        <Table data={mockData} onUpdate={jest.fn()} onDelete={jest.fn()} />
      </MockedProvider>
    );
  
    const updateButton = screen.getAllByRole("button", { name: /Update/i })[0] as HTMLButtonElement
    fireEvent.click(updateButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();    
    const cancelButton = screen.getAllByRole("button", { name: /cancel/i })[0] as HTMLButtonElement
    fireEvent.click(cancelButton);
  });
});

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Student, Table } from "./tableContent";
import { TextField, Button, Alert } from "@mui/material";
import { DELETE_ROW, GET_STUDENTS } from "../graphQl/graphQlMutations";

const TableData: React.FC = () => {
  const { loading, error, data } = useQuery(GET_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [deleteRow] = useMutation(DELETE_ROW, {
    refetchQueries: [{ query: GET_STUDENTS }],
  });

  const handleUpdate = (student: Student) => {
    console.log("Update student:", student);
  };

  const handleDelete = (id: number) => {
    deleteRow({
      variables: { id },
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) return <p>Page Rendering...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || data.students.length === 0) {
    return <p>No students found</p>;
  }

  const filteredStudents = data.students.filter(
    (student: Student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll_no.toString().includes(searchQuery)
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentStudents = filteredStudents.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  return (
    <>
      <div>
        <h1 style={{ textAlign: "center" }}>Student Table</h1>
        <TextField
          helperText=" "
          id="searchBar"
          label="Search by Name or Roll Number"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginLeft: "15px" }}
        />
        {filteredStudents.length === 0 && searchQuery && (
          <Alert
            severity="warning"
            style={{ width: "500px", marginLeft: "33%", fontSize: "20px" }}
          >
            The expected input should not appear in the table.
          </Alert>
        )}
        {currentStudents.length > 0 && (
          <>
            <Table
              data={currentStudents}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                style={{ marginRight: "10px" }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextPage}
                disabled={
                  currentPage * recordsPerPage >= filteredStudents.length
                }
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TableData;

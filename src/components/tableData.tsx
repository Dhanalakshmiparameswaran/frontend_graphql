import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Student, Table } from "./tableContent";
import { DELETE_ROW, GET_STUDENTS } from "./fetchData";

const TableData: React.FC = () => {
  const { loading, error, data } = useQuery(GET_STUDENTS);

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

  if (loading) return <p>Page Rendering...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || data.students.length === 0) {
    return <p>No students found</p>;
  }

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Student Table</h1>
      <Table
        data={data.students}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TableData;

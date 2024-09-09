import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import "../table.css";
import { GET_STUDENTS, UPDATE_ROW } from "../graphQl/graphQlMutations";

export interface Student {
  id: number;
  roll_no: string;
  name: string;
  classSection: string;
  mark: number;
}

interface TableProps {
  data: Student[];
  onUpdate: (student: Student) => void;
  onDelete: (id: number) => void;
}

export const Table: React.FC<TableProps> = ({ data, onUpdate, onDelete }) => {
  const [updateRow] = useMutation(UPDATE_ROW, {
    refetchQueries: [{ query: GET_STUDENTS }],
  });

  const [sortedData, setSortedData] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const sorted = [...data].sort((a, b) => a.id - b.id);
    setSortedData(sorted);
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  const handleUpdate = (student: Student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedStudent) {
      updateRow({
        variables: {
          id: selectedStudent.id,
          roll_no: selectedStudent.roll_no,
          name: selectedStudent.name,
          classSection: selectedStudent.classSection,
          mark: selectedStudent.mark.toString(),
        },
      }).catch((error) => {
        console.error("Submit Error:", error);
      });
      handleClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedStudent((prevData) =>
      prevData
        ? {
            ...prevData,
            [name]: name === "mark" ? Number(value) : value,
          }
        : null
    );
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Roll No</th>
            <th>Name</th>
            <th>Class Section</th>
            <th>Mark</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.roll_no}</td>
              <td>{row.name}</td>
              <td>{row.classSection}</td>
              <td>{row.mark}</td>
              <td>
                <button onClick={() => handleUpdate(row)}>Update</button>
              </td>
              <td>
                <button onClick={() => onDelete(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Student</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <TextField
                  label="Roll No"
                  name="roll_no"
                  variant="outlined"
                  fullWidth
                  value={selectedStudent.roll_no}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Name"
                  name="name"
                  variant="outlined"
                  fullWidth
                  value={selectedStudent.name}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Class Section"
                  name="classSection"
                  variant="outlined"
                  fullWidth
                  value={selectedStudent.classSection}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Mark"
                  name="mark"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={selectedStudent.mark}
                  onChange={handleChange}
                  required
                />
              </Box>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

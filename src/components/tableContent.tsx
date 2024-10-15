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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    setUserName(name || "");
    setUserRole(role || "");
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  const handleUpdate = (student: Student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedStudent) {
      try {
        await updateRow({
          variables: {
            id: selectedStudent.id,
            roll_no: selectedStudent.roll_no,
            name: selectedStudent.name,
            classSection: selectedStudent.classSection,
            mark: selectedStudent.mark.toString(),
          },
        });
        handleClose();
      } catch (error) {
        console.error("Submit Error:", error);
        setErrorMessage("Failed to update the student. Please try again.");
      }
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

  const filteredData =
    userRole === "STUDENT"
      ? data.filter((student) => student.roll_no === userName) 
      : data; 

  const sortedData = [...filteredData].sort((a, b) => {
    return sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Roll No</th>
            <th onClick={toggleSortOrder}>
              Name{" "}
              {sortOrder === "asc" ? (
                <ExpandLessIcon fontSize="medium" />
              ) : (
                <ExpandMoreIcon fontSize="medium" />
              )}
            </th>
            <th>Class Section</th>
            <th>Mark</th>
            {userRole === "TEACHER" && (
              <>
                <th>Update</th>
                <th>Delete</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {userRole === "STUDENT" && filteredData.length === 0 ? (
            <tr>
              <td colSpan={5}  style={{ textAlign: "center" }}>
                Your Answer Sheet didn't validate till now. Could you please check after?
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.roll_no}</td>
                <td>{row.name}</td>
                <td>{row.classSection}</td>
                <td>{row.mark}</td>
                {userRole === "TEACHER" && (
                  <>
                    <td>
                      <button onClick={() => handleUpdate(row)}>Update</button>
                    </td>
                    <td>
                      <button onClick={() => onDelete(row.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
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
                  type="number"
                  fullWidth
                  value={selectedStudent.mark}
                  onChange={handleChange}
                  required
                />
              </Box>
              {errorMessage && (
                <Box mb={2} color="red">
                  {errorMessage}
                </Box>
              )}
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

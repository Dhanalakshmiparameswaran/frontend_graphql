import { useMutation } from "@apollo/client";
import "../table.css";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { ADD_NEW_ROW, GET_STUDENTS } from "../graphQl/graphQlMutations";

export const AddNewRow = () => {
  const [formData, setFormData] = useState({
    roll_no: "",
    name: "",
    classSection: "",
    mark: "",
  });
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [addNewRow] = useMutation(ADD_NEW_ROW, {
    refetchQueries: [{ query: GET_STUDENTS }],
    onCompleted: () => {
      console.log("Mutation completed successfully");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    },
  });

  const handleAddNew = (
    rollno: string,
    name: string,
    classSection: string,
    mark: string
  ) => {
    console.log("Adding new row:", { rollno, name, classSection, mark });
    addNewRow({
      variables: {
        roll_no: rollno,
        name: name,
        classSection: classSection,
        mark: mark,
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    handleAddNew(
      formData.roll_no,
      formData.name,
      formData.classSection,
      formData.mark
    );
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="header">
        <button onClick={handleClickOpen} className="btn">
          Add New Student
        </button>
      </div>

      {showAlert && (
        <Alert
          severity="success"
          onClose={() => setShowAlert(false)}
          sx={{
            position: "fixed",
            top: 10,
            left: "50%",
            right: 0,
            zIndex: 9999,
            borderRadius: 0,
            width: 500,
          }}
        >
          Record Added Successfully
        </Alert>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="Roll No"
                name="roll_no"
                variant="outlined"
                fullWidth
                value={formData.roll_no}
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
                value={formData.name}
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
                value={formData.classSection}
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
                value={formData.mark}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

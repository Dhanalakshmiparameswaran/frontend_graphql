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
import { useEffect, useState } from "react";
import { ADD_NEW_ROW, GET_STUDENTS } from "../graphQl/graphQlMutations";
import { useNavigate } from "react-router-dom";

export const AddNewRow: React.FC = () => {
  const [formData, setFormData] = useState({
    roll_no: "",
    name: "",
    classSection: "",
    mark: "",
  });
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
  }, []);

  const [addNewRow] = useMutation(ADD_NEW_ROW, {
    refetchQueries: [{ query: GET_STUDENTS }],
    onCompleted: () => {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      resetForm(); 
    },
  });

  const resetForm = () => {
    setFormData({
      roll_no: "",
      name: "",
      classSection: "",
      mark: "",
    });
  };

  const handleAddNew = (
    rollno: string,
    name: string,
    classSection: string,
    mark: string
  ) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddNew(formData.roll_no, formData.name, formData.classSection, formData.mark);
    handleClose();
  };

  const handleClickOpen = () => {
    resetForm(); 
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {userRole === "TEACHER" && (
          <button onClick={handleClickOpen} className="btn">
            Add New Student
          </button>
        )}
        <button onClick={handleLogout} className="btn">
          Logout
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

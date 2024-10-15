import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { SIGNUP_MUTATION } from "../graphQl/graphQlMutations";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");

  const [signup] = useMutation(SIGNUP_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data } = await signup({ variables: { email, password, role } });
      console.log(email, password, role);
      if (data) {
        setError("");
        navigate("/login");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as "STUDENT" | "TEACHER")}
              label="Role"
            >
              <MenuItem value="STUDENT">Student</MenuItem>
              <MenuItem value="TEACHER">Teacher</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </Box>
    </Container>
  );
};

export default SignupForm;

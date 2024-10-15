import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Link,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { SIGNIN_MUTATION } from "../graphQl/graphQlMutations";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [signIn] = useMutation(SIGNIN_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const { data } = await signIn({ variables: { email, password } });

      if (data && data.login) {
        const { login } = data;
        console.log("Logged in user:", login);
        setError("");
        navigate("/table");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" id="login">
      <Box sx={{ mt: 8, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <p>
          Don't have an account? <Link href="/signup">Sign up here</Link>
        </p>
      </Box>
    </Container>
  );
};

export default LoginForm;

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import { SIGNUP_MUTATION } from "../../graphQl/graphQlMutations";
import SignupForm from "../../components/signUp";

const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: "test",
        email: "test@gmail.com",
        password: "password123",
        role: "STUDENT",
      },
    },
    result: {
      data: {
        signup: {
          id: "1",
          name: "test",
          email: "test@gmail.com",
          role: "STUDENT",
        },
      },
    },
  },
];

describe("SignupForm", () => {
  test("should display an error if required fields are empty", async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>
      );
  
      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
  
      expect(await screen.findByText(/all fields are required/i)).toBeInTheDocument();
    });
  
    test("should display an error if email is not a Gmail address", async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>
      );
  
      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "test" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@yahoo.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
      fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
  
      expect(await screen.findByText(/please enter a valid gmail address/i)).toBeInTheDocument();
    });
  
    test("should display an error if password length is invalid", async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>
      );
  
      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "test" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@gmail.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "pass" } });
      fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "pass" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
      const errorMessage = screen.getAllByText(/password must be between 6 and 12 characters/i)[0] as HTMLParagraphElement
  
      expect(errorMessage).toBeInTheDocument();
    });
  
    test("should display an error if passwords do not match", async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>
      );
    
      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "test" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@gmail.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
      fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password456" } });
    
      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    const errorMessage = screen.getAllByText(/Passwords do not match/i)[0] as HTMLParagraphElement;    
      expect(errorMessage).toBeInTheDocument();
    });
    
    test("should navigate on successful signup", async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MemoryRouter>
            <SignupForm />
          </MemoryRouter>
        </MockedProvider>
      );
  
      fireEvent.change(screen.getByLabelText("Name"), { target: { value: "test" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@gmail.com" } });
      fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
      fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password123" } });
      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
  
      await waitFor(() => expect(screen.queryByText(/signup failed/i)).not.toBeInTheDocument());
    });
});
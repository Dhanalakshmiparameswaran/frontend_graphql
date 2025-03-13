import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing"; 
import { SIGNIN_MUTATION } from "../../graphQl/graphQlMutations";
import LoginForm from "../../components/signIn";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';

const mocks = [
  {
    request: {
      query: SIGNIN_MUTATION,
      variables: {
        email: "test@example.com",
        password: "password123",
      },
    },
    result: {
      data: {
        signIn: {
          id: "1",
          email: "test@example.com",
          role: "user",
          token: "mockToken",
        },
      },
    },
  },
];

const errorMocks = [
    {
      request: {
        query: SIGNIN_MUTATION,
        variables: { email: 'test@example.com', password: 'wrongpassword' },
      },
      error: new Error('Login failed'),
    },
  ];

describe("LoginForm", () => {
  test("renders login heading", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("submits the form successfully", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
  });
  test('stores user data in local storage and navigates on successful login', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mockToken');
      expect(localStorage.getItem('userRole')).toBe('user');
    });

  });
  test('displays an error message on login failure', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/login failed. please try again/i)).toBeInTheDocument();
  });
  test('should show an error message if email is empty', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/both fields are required/i)).toBeInTheDocument();
  });

  test('should show an error message if password is empty', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/both fields are required/i)).toBeInTheDocument();
  });

  test('should not show an error message if both fields are filled', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.queryByText(/both fields are required/i)).not.toBeInTheDocument();
  });
});

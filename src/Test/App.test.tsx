import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import App from '../App';

jest.mock('../components/signIn', () => () => <div>Login Form</div>);
jest.mock('../components/signUp', () => () => <div>Signup Form</div>);
jest.mock('../components/productedRoute', () => ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
));
jest.mock('../components/onboardPage', () => () => <div>Onboard Page</div>);

describe('App Component Routing', () => {

  test('renders LoginForm on "/" route', () => {
    render(
        <App />
    );
    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

  test('renders SignupForm on "/signup" route', () => {
    render(
        <App />
    );
    window.history.pushState({}, 'Signup', '/signup');
    render(
        <App />
    );
    expect(screen.getByText('Signup Form')).toBeInTheDocument();
  });

  test('renders OnboardPage with Protected Route on "/table" route', () => {
    render(
        <App />
    );
    window.history.pushState({}, 'Table', '/table');
    render(
        <App />
    );
    expect(screen.getByText('Onboard Page')).toBeInTheDocument();
  });
});


import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginForm from "./components/signIn";
import SignupForm from "./components/signUp";
import Protected from "./components/productedRoute";
import OnboardPage from "./components/onboardPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/table" element={<Protected><OnboardPage /></Protected>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

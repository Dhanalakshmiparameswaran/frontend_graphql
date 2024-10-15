import { Navigate } from 'react-router-dom';


const Protected= ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Protected;
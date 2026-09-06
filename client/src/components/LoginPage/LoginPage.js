import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showerr, setShowerr] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleLogin = async () => {
    try {
      const existingToken = localStorage.getItem('auth-token') || '';

      const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${existingToken}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('auth-token', json.authtoken);
        localStorage.setItem('name', json.userName);
        localStorage.setItem('email', json.userEmail);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setShowerr(json.error || 'Login failed');
      }
    } catch (e) {
      console.error(e);
      setShowerr('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <h2 className="mb-4">Login</h2>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {showerr && <p className="text-danger">{showerr}</p>}
          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

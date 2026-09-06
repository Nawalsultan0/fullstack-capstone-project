import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showerr, setShowerr] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleRegister = async () => {
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem('auth-token', json.authtoken);
        localStorage.setItem('email', email);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setShowerr(json.error || 'Registration failed');
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
          <h2 className="mb-4">Register</h2>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              className="form-control"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
          <button className="btn btn-primary" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

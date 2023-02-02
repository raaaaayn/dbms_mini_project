import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

import login from '@/services/login';

const LoginPage = () => {
  const [username, set_username] = useState('');
  const [password, set_password] = useState('');

  const navigate = useNavigate();

  const login_user = useMutation(login);

  return (
    <main className="login-page">
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login_user.mutate(
            { username, password },
            {
              onSuccess: () => {
                navigate('/');
              },
            },
          );
        }}
        className="login-form"
      >
        <TextField
          className="user-inputs"
          required
          label="username"
          value={username}
          onChange={(e) => {
            set_username(e.target.value);
          }}
        />
        {/* <p className="error-field">{userexists === true ? "Username already taken" : null}</p>*/}
        <TextField
          className="user-inputs"
          required
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            set_password(e.target.value);
          }}
        />
        <Button type="submit">Next</Button>
      </form>
    </main>
  );
};

export default LoginPage;

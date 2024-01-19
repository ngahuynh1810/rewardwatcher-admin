import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

import {  toast } from 'react-toastify';
import { saveCookie, loadCookie } from "src/utils/cookies";
import {LOGIN_TOKEN} from "src/utils/setting"
// ----------------------------------------------------------------------

export default function LoginForm(props) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleClick = async() => {
    const resLogin = await props.login({
      username: process.env.REACT_APP_USER_NAME_LOGIN || username,
      password: process.env.REACT_APP_USER_NAME_PASSWORD || password,
    });
    if(resLogin.code === 1)  {
      saveCookie({
        name: LOGIN_TOKEN,
        data: resLogin.data,
      });
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" InputLabelProps={{ shrink: true }} value={username} onChange={(e) => setUsername(e.target.value)}/>

        <TextField
          name="password"
          label="Password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" /> */}
        {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}

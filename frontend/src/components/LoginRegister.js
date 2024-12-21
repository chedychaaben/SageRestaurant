import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import SageImage from '../assets/img/SageLogo.png';
import { useNavigate } from 'react-router-dom';
import API_HOST from './config';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  width: '100%',  // Make width flexible to adjust to container
  maxWidth: '600px',  // Limit max width for larger screens
  height: 'auto',  // Height adapts to content
  maxHeight: '600px',  // Limit max height to avoid overflowing
  margin: 'auto',
  borderRadius: '20px',  // Rounded corners
  boxShadow: theme.shadows[3],  // Subtle shadow for better look
  backgroundColor: theme.palette.background.paper,  // Use background paper color
  overflow: 'hidden',  // Prevent content from overflowing the rounded edges
}));



function LoginRegister(props) {
  const [isLogin, setIsLogin] = useState(true);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const validateInputs = (email, password) => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Veuillez entrer une adresse e-mail valide.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmitRegister = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if (!validateInputs(email, password)) return;

    try {
      const response = await axios.post(
        `${API_HOST}/api/Account/Register`,
        { email, password },
        { headers: { Accept: 'application/json' } }
      );
      setSnackbarMessage(`Account Created ! You are now redirected to the login Interface !!`);
      setIsLogin(true);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error during register:', error.response?.data || error.message);
      setSnackbarMessage(`Register Error : ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if (!validateInputs(email, password)) return;

    try {
      const response = await axios.post(
        `${API_HOST}/api/Account/Login`,
        { email, password },
        { headers: { Accept: 'application/json' } }
      );
      localStorage.setItem('token', response.data.token);
      setSnackbarMessage(`Connected ! Reloading...`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      window.location.reload();
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      setSnackbarMessage(`Login Error : ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Box item xs={12} sm={6} sx={{minWidth: "450px" , minHeight: "450px"}}>
            <Card variant="outlined" >
              <Typography
                component="h1"
                variant="h4"
                sx={{ fontSize: 'clamp(2rem, 5vw, 1.5rem)', textAlign: 'center' }}
              >
                {isLogin ? <>Login<br></br><LoginIcon sx={{ fontSize : "40px"}}/></> : <>Register<br></br><AppRegistrationIcon sx={{ fontSize : "40px"}}/></>}
              </Typography>
              <Box
                component="form"
                onSubmit={isLogin ? handleSubmitLogin : handleSubmitRegister}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    error={emailError}
                    helperText={emailErrorMessage}
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    fullWidth
                    required
                    variant="outlined"
                    autoFocus
                    aria-describedby="email-helper-text"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    id="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                    fullWidth
                    required
                    variant="outlined"
                    aria-describedby="password-helper-text"
                  />
                </FormControl>
                <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: '#00A082', color: 'white' }}>
                  {isLogin ? "Login" : "Register"}
                </Button>
              </Box>
              
              {
                isLogin ? 
                <Button onClick={() => {setIsLogin(false)}}>
                  Create an account ?
                </Button>
              :
              <Button onClick={() => {setIsLogin(true)}}>
                Already have an account ?
              </Button>
              }
              

            </Card>
          </Box>
          <Box>
          </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled">
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </>
  );
}


export default LoginRegister;
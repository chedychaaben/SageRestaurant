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



function ChangePassword(props) {
  // State for oldPassword
  const [oldPasswordError, setOldPasswordError] = React.useState(false);
  const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = React.useState('');
  
  // State for newPassword
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = React.useState('');
  
  // State for confirmNewPassword
  const [confirmNewPasswordError, setConfirmNewPasswordError] = React.useState(false);
  const [confirmNewPasswordErrorMessage, setConfirmNewPasswordErrorMessage] = React.useState('');

  // snackBar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const validateInputs = (oldPassword, newPassword, confirmNewPassword) => {
    let isValid = true;

    // Validate oldPassword
    if (!oldPassword || oldPassword.length < 6) {
      setOldPasswordError(true);
      setOldPasswordErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      isValid = false;
    } else {
      setOldPasswordError(false);
      setOldPasswordErrorMessage('');
    }

    // Validate newPassword
    if (!newPassword || newPassword.length < 6) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      isValid = false;
    } else {
      setNewPasswordError(false);
      setNewPasswordErrorMessage('');
    }

    // Validate confirmNewPassword
    if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError(true);
      setConfirmNewPasswordErrorMessage('Les mots de passe ne correspondent pas.');
      isValid = false;
    } else {
      setConfirmNewPasswordError(false);
      setConfirmNewPasswordErrorMessage('');
    }


    return isValid;
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const oldPassword = data.get('oldPassword');
    const newPassword = data.get('newPassword');
    const confirmNewPassword = data.get('confirmNewPassword');

    if (!validateInputs(oldPassword, newPassword, confirmNewPassword)) return;

    try {
      const response = await axios.post(
        `${API_HOST}/api/Account/ChangePassword`,
        { "currentPassword" : oldPassword , "newPassword" : newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSnackbarMessage(`Password changed!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error during password change:', error.response?.data || error.message);
      setSnackbarMessage(`Password Change Error : ${error.message}`);
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
                sx={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', textAlign: 'center' }}
              >
                Change Password
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmitLogin}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <FormControl>
                  <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
                  <TextField
                    error={oldPasswordError}
                    helperText={oldPasswordErrorMessage}
                    id="oldPassword"
                    name="oldPassword"
                    placeholder="Old password"
                    type="password"
                    fullWidth
                    required
                    variant="outlined"
                    aria-describedby="password-helper-text"
                  />
                </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                    <TextField
                      error={newPasswordError}
                      helperText={newPasswordErrorMessage}
                      id="newPassword"
                      name="newPassword"
                      placeholder="New password"
                      type="password"
                      fullWidth
                      required
                      variant="outlined"
                      aria-describedby="password-helper-text"
                    />
                  </FormControl>
                <FormControl>
                  <FormLabel htmlFor="confirmNewPassword">Confirm New Password</FormLabel>
                  <TextField
                    error={confirmNewPasswordError}
                    helperText={confirmNewPasswordErrorMessage}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    placeholder="Confirm New Password"
                    type="password"
                    fullWidth
                    required
                    variant="outlined"
                    aria-describedby="password-helper-text"
                  />
                </FormControl>
                <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: '#00A082', color: 'white' }}>
                  Save
                </Button>
              </Box>
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


export default ChangePassword;
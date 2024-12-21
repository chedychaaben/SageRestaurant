import React, { useState, useEffect} from 'react';
import axios from 'axios';
import API_HOST from './config';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, FormControl, FormLabel, TextField, Button, Container } from '@mui/material';
import ChangePassword from "./ChangePassword";
import { Modal } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Profil() {
    const [user, setUser] = useState({})
    const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('');

    const handleOpenPasswordChangeModal = (e) => {
      setPasswordChangeOpen((prevState) => !prevState)
      setPasswordChangeOpen(e.currentTarget)
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSaveName = async() => {
    try
    {
      const res = await axios.post(
        `${API_HOST}/api/Account/ChangeFullName`,
        { "newFullName": user.fullName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setSnackbarMessage(`Name changed!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error changing name:', error.response?.data || error.message);
      setSnackbarMessage(`Changing name Error : ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
   }
  }

    const fetchuser = async() => {
        try
        {
          const res = await axios.get(
            `${API_HOST}/api/Account/GetUser`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )
          setUser(res.data)
        }
        catch(e)
        {
          console.error(e)
        }
      }

      
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {
    }
  };

  const handleChangeFullName = (e) => {
    setUser(prevUser => ({
      ...prevUser,
      fullName: e.target.value,
    }));
  };

    useEffect(() => {
      fetchuser();
    }, []);

  return (
    <div >
    <Container maxWidth="sm" sx={{ mt: 19, p: 4, borderRadius: 10 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Profile
      </Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
        {/* Name Field */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <FormLabel htmlFor="name">Name:</FormLabel>
            <TextField
              fullWidth
              id="name"
              name="name"
              value={user.fullName}
              onChange={handleChangeFullName}
              variant="outlined"
              margin="normal"
            />
          </FormControl>
        </Box>

        {/* Name Field */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <FormLabel htmlFor="email">Email:</FormLabel>
            <TextField
              fullWidth
              id="email"
              name="email"
              value={user.email}
              variant="outlined"
              margin="normal"
              disabled
            />
          </FormControl>
        </Box>

        {/* Password Change Section */}
        <Box>
          <Typography variant="body1" gutterBottom>
            <strong>Password:</strong>
            <Button
              variant="text"
              color="secondary"
              onClick={handleOpenPasswordChangeModal}
              sx={{ textTransform: 'none', fontSize: '1rem', ml: 1 }}
            >
              Change Password
            </Button>
          </Typography>
        </Box>
      </Box>

      {/* Save Button */}
      <Box sx={{ mb: 3 }}>
        <Button onClick={handleSaveName} fullWidth variant="contained" sx={{ backgroundColor: '#00A082', color: 'white' }}>
          Save
        </Button>
      </Box>

      {/* Modal for Changing Password */}
      {passwordChangeOpen && (
        <Modal
          open={passwordChangeOpen}
          onClose={() => setPasswordChangeOpen(false)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box>
            <ChangePassword />
          </Box>
        </Modal>
      )}
    </Container>
        
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled">
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
    </div>
  );
}


export default Profil;
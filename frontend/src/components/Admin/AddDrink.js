import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Grid, Box } from '@mui/material';
import API_HOST from '../config';
import { useNavigate } from 'react-router-dom';

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { Checkbox, FormControlLabel, FormGroup , MenuItem, Chip, Input, InputLabel, Select, FormControl, FormLabel} from "@mui/material";


import {
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';

function AddDrink () {
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const navigate = useNavigate();


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData object to send individual values
    const formDataToSend = new FormData();

    // Append each value separately to the FormData
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('images', formData.image.file);

    try {
      const response = await axios.post(
        `${API_HOST}/api/Drink/AddDrink`,
        formDataToSend,
        { 
          headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      navigate('/admin/drinks');
    } catch (error) {
      console.error('Error :', error.response?.data || error.message);
      setSnackbarOpen(true);
      setSnackbarMessage(error.message);
      console.log(error)
    }
  };



  return (
    <>
    <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
        Add Drink
        </Typography>
        <form onSubmit={handleSubmit}>
        <Box sx={{margin: "0 50px"}}>

            <Box  mb={4}>
              <FormControl fullWidth required>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <TextField
                      fullWidth
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                  />
              </FormControl>
            </Box>
    
            <Box  mb={4}>
              <FormControl fullWidth required>
                  <FormLabel htmlFor="price">Price</FormLabel>
                  <TextField
                      fullWidth
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      type="number"
                      required
                  />
              </FormControl>
            </Box>
    
            <Box container spacing={2}>
            <FormLabel htmlFor="Images">Images</FormLabel>
            
            <Box item xs={12} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "white" }}>
              <Box sx={{ flex: 1 }}>
                <label htmlFor={`upload-button`} style={{ display: "block", textAlign: "center", padding: "8px 16px", border: "1px dashed #ccc", borderRadius: "4px", cursor: "pointer", backgroundColor: "#ffffff" }}>
                  {formData.image ? formData.image.file.name : "Click to upload an image"}
                </label>
                <input
                  id="upload-button"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setFormData(prevData => ({
                      ...prevData,
                      image: { file: e.target.files[0] }
                    }));
                  }}
                  style={{ display: "none" }}
                  required
                />
              </Box>
              <IconButton
                onClick={() => {
                  setFormData(prevData => ({
                    ...prevData,
                    image: { file: null }
                  }));
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            </Box>


            <Box sx={{ flex: '1 1 100%', textAlign: 'center', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
            </Box>
        </Box>
        </form>
    </Box>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={2000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <MuiAlert onClose={handleSnackbarClose} severity="error" variant="filled">
        {snackbarMessage}
      </MuiAlert>
    </Snackbar>
    </>
  );
};

export default AddDrink;
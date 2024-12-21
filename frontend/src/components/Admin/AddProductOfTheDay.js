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

function AddProductOfTheDay () {
  const [products, setProducts] = useState([])
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
    const navigate = useNavigate();


  const fetchproducts = async() => {
    try
    {
      const res = await axios.get(
        `${API_HOST}/api/Product/GetAllProducts`
      )
      setProducts(res.data)
    }
    catch(e)
    {
      console.error(e)
    }
  }
  
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(false);



  const [formData, setFormData] = useState({
    ProductId: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_HOST}/api/ProductOfTheDay/AddProductOfTheDay`,
        formData,
        { 
          headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      navigate('/admin/productsoftheday');
    } catch (error) {
      console.error('Error :', error.response?.data || error.message);
      setSnackbarOpen(true);
      setSnackbarMessage(error.message);
      console.log(error)
    }
  };

  useEffect(() => {
    fetchproducts();
  }, []);

  return (
    <>
    <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
        Add Product Of The Day
        </Typography>
        <form onSubmit={handleSubmit}>
        <Box sx={{margin: "0 50px"}}>

            <Box  mb={4}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="Product">Product</FormLabel>
                <Select
                  labelId="select-label"
                  id="ProductId-select"
                  name="ProductId"
                  value={formData.ProductId}
                  onChange={(e) => setFormData((prevData) => ({...prevData,[e.target.name]: e.target.value,}))}
                  label="Product"
                  placeholder="Product"
                >
                  <MenuItem value="">
                    <em>Choose a Product</em>
                  </MenuItem>
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default AddProductOfTheDay;
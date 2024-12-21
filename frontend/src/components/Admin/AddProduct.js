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

function AddProduct () {
    const [categories, setCategories] = useState([])

    const fetchcategories = async() => {
      try
      {
        const res = await axios.get(
          `${API_HOST}/api/Category/GetAllCategories`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        setCategories(res.data)
      }
      catch(e)
      {
        console.error(e)
      }
    }
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };
  
  
    const navigate = useNavigate();


    const [ingredients, setIngredients] = useState([]);
    const [ingredientsCounter, setIngredientsCounter] = useState(1);
    const [supplements, setSupplements] = useState([]);
    const [supplementsCounter, setSupplementsCounter] = useState(1);
    const [images, setImages] = useState([]); //{ id: 1, value: "" }
    const [imagesCounter, setImagesCounter] = useState(1);
  
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(false);


    // Add a new ingredient
    const handleAddIngredient = () => {
    const newIngredient = { id: ingredientsCounter, value: "" };
    setIngredients([...ingredients, newIngredient]);
    setIngredientsCounter(ingredientsCounter + 1);
    };
    // Remove an ingredient
    const handleRemoveIngredient = (id) => {
        setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    };

    // Handle input changes Ingredient
    const handleInputChangeIngredient = (id, newValue) => {
      setIngredients(
        ingredients.map((field) =>
          field.id === id ? { ...field, value: newValue } : field
        )
      );
    };

    // Add a new supplement
    const handleAddSupplement = () => {
    const newSupplement = { id: supplementsCounter, value: "", price: 0 };
    setSupplements([...supplements, newSupplement]);
    setSupplementsCounter(supplementsCounter + 1);
    };
    // Remove an supplement
    const handleRemoveSupplement = (id) => {
        setSupplements(supplements.filter((supplement) => supplement.id !== id));
    };

    // Handle input changes Supplement
    const handleInputChangeSupplement = (id, newValue) => {
      setSupplements(
        supplements.map((field) =>
          field.id === id ? { ...field, value: newValue } : field
        )
      );
    };
    const handleInputChangeSupplementPrice = (id, newValue) => {
      setSupplements(
        supplements.map((field) =>
          field.id === id ? { ...field, price: newValue } : field
        )
      );
    };

    // Add a new image
    const handleAddImage = () => {
    const newImage = { id: imagesCounter, value: "" };
    setImages([...images, newImage]);
    setImagesCounter(imagesCounter + 1);
    };
    // Remove an image
    const handleRemoveImage = (id) => {
        setImages(images.filter((image) => image.id !== id));
    };

    // Handle input changes Image
    const handleInputChangeImage = (id, newValue) => {
      setImages(
        images.map((field) =>
          field.id === id ? { ...field, value: newValue } : field
        )
      );
    };
    

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    discountRate: 0,
    prepTime: 0,
    categoryId: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, process your data (images, ingredients, supplements)
    const processedImages = images.map(image => ({ filedata: image.value }));
    const processedIngredients = ingredients.map(ingredient => ({ Name: ingredient.value })); // Remove id, keep name
    const processedSupplements = supplements.map(supplement => ({ Name: supplement.value, Price: supplement.price })); // Remove id, keep name

    // Create a new FormData object to send individual values
    const formDataToSend = new FormData();

    // Append each value separately to the FormData
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('discountRate', formData.discountRate);
    formDataToSend.append('prepTime', formData.prepTime);
    formDataToSend.append('categoryId', formData.categoryId);

    // Append the processed arrays separately
    formDataToSend.append('ingredients', JSON.stringify(processedIngredients));
    formDataToSend.append('supplements', JSON.stringify(processedSupplements));

    // Append the images as binary data
    processedImages.forEach((image, index) => {
      formDataToSend.append('images', image.filedata); // 'images' key for each image file
    });

    try {
      const response = await axios.post(
        `${API_HOST}/api/Product/AddProduct`,
        formDataToSend,
        { 
          headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      navigate('/admin/products');
    } catch (error) {
      console.error('Error :', error.response?.data || error.message);
      setSnackbarOpen(true);
      setSnackbarMessage(error.message);
      console.log(error)
    }
  };

  // State to track selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle change event for Select component
  const handleChangeCategories = (event) => {
    setSelectedOptions(event.target.value);
  };


  useEffect(() => {
    fetchcategories();
  }, []);

  return (
    <>
    <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
        Add Product
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
              <FormControl fullWidth>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <TextField
                      fullWidth
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
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
    
            <Box  mb={4}>
              <FormControl fullWidth>
                <FormLabel htmlFor="discountRate">Discount Rate</FormLabel>
                <Select
                  fullWidth
                  id="discountRate"
                  name="discountRate"
                  value={formData.discountRate}
                  onChange={handleChange}
                  label="Discount Rate"
                >
                  <MenuItem value="">
                    <em>Choose a Discount Rate</em>
                  </MenuItem>
                  <MenuItem value={5}>5%</MenuItem>
                  <MenuItem value={10}>10%</MenuItem>
                  <MenuItem value={15}>15%</MenuItem>
                  <MenuItem value={20}>20%</MenuItem>
                  <MenuItem value={25}>25%</MenuItem>
                  <MenuItem value={30}>30%</MenuItem>
                </Select>
              </FormControl>
            </Box>
    
            <Box  mb={4}>
              <FormControl fullWidth>
                <FormLabel htmlFor="prepTime">Preparation Time</FormLabel>
                <Select
                  fullWidth
                  id="prepTime"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                  label="Preparation Time"
                >
                  <MenuItem value="">
                    <em>Choose a Preparation Time</em>
                  </MenuItem>
                  <MenuItem value={5}>5 Minutes</MenuItem>
                  <MenuItem value={10}>10 Minutes</MenuItem>
                  <MenuItem value={15}>15 Minutes</MenuItem>
                  <MenuItem value={20}>20 Minutes</MenuItem>
                  <MenuItem value={25}>25 Minutes</MenuItem>
                  <MenuItem value={30}>30 Minutes</MenuItem>
                  <MenuItem value={35}>35 Minutes</MenuItem>
                  <MenuItem value={40}>40 Minutes</MenuItem>
                </Select>
              </FormControl>
            </Box>
    
            <Box  mb={4}>
              <FormControl fullWidth required>
                <FormLabel htmlFor="Category">Category</FormLabel>
                <Select
                  labelId="select-label"
                  id="categoryId-select"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData((prevData) => ({...prevData,[e.target.name]: e.target.value,}))}
                  label="Category"
                  placeholder="Category"
                >
                  <MenuItem value="">
                    <em>Choose a Category</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box mb={4} container spacing={2}>
            <FormLabel htmlFor="Ingredients">Ingredients</FormLabel>
              
            {ingredients.map((field) => (
                <Box item xs={12} key={field.id}  sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "white" }}>
                <TextField
                    label={`Ingredient ${field.id}`}
                    value={field.value}
                    onChange={(e) => handleInputChangeIngredient(field.id, e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                />
                <IconButton
                    onClick={() => handleRemoveIngredient(field.id)}
                    color="error"
                >
                    <DeleteIcon />
                </IconButton>
                </Box>
            ))}
              <br/>
              <Box  mb={4} container spacing={2}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#4caf50', // Use a custom green color
                    color: 'white',             // Ensure text is white for contrast
                    '&:hover': {
                      backgroundColor: '#45a049', // Slightly darker green on hover
                    },
                    textTransform: 'none', 
                    borderRadius: 2,
                  }}
                  startIcon={<AddIcon />}
                  onClick={handleAddIngredient}
                >
                  Add Ingredient
                </Button>
              </Box>
            </Box>

            <Box  mb={4} container spacing={2}>
            <FormLabel htmlFor="Supplements">Supplements</FormLabel>
            {supplements.map((field) => (
                <Box item xs={12} key={field.id}  sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "white" }}>
                <TextField
                    label={`Supplement ${field.id}`}
                    value={field.value}
                    onChange={(e) => handleInputChangeSupplement(field.id, e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                />
                <TextField
                    label={`Price ${field.id}`}
                    value={field.price}
                    onChange={(e) => handleInputChangeSupplementPrice(field.id, e.target.value)}
                    fullWidth
                    type="number"
                    required
                    variant="outlined"
                />
                <IconButton
                    onClick={() => handleRemoveSupplement(field.id)}
                    color="error"
                >
                    <DeleteIcon />
                </IconButton>
                </Box>
            ))}
              <br/>
              <Box item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#4caf50', // Use a custom green color
                    color: 'white',             // Ensure text is white for contrast
                    '&:hover': {
                      backgroundColor: '#45a049', // Slightly darker green on hover
                    },
                    textTransform: 'none', 
                    borderRadius: 2,
                  }}
                  startIcon={<AddIcon />}
                  onClick={handleAddSupplement}
                >
                  Add Supplement
                </Button>
              </Box>
            </Box>

            
            <Box container spacing={2}>
            <FormLabel htmlFor="Images">Images</FormLabel>
            {images.map((field) => (
                <Box item xs={12} key={field.id} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "white" }}>
                  <Box sx={{ flex: 1 }}>
                    <label htmlFor={`upload-button-${field.id}`} style={{ display: "block", textAlign: "center", padding: "8px 16px", border: "1px dashed #ccc", borderRadius: "4px", cursor: "pointer", backgroundColor: "#ffffff" }}>
                      {field.value ? field.value.name : "Click to upload an image"}
                    </label>
                    <input
                      id={`upload-button-${field.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleInputChangeImage(field.id, e.target.files[0])}
                      style={{ display: "none" }}
                      required
                    />
                  </Box>
                  <IconButton
                      onClick={() => handleRemoveImage(field.id)}
                      color="error"
                  >
                      <DeleteIcon />
                  </IconButton>
                </Box>
            ))}
            <br/>
              <Box item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#4caf50', // Use a custom green color
                    color: 'white',             // Ensure text is white for contrast
                    '&:hover': {
                      backgroundColor: '#45a049', // Slightly darker green on hover
                    },
                    textTransform: 'none', 
                    borderRadius: 2,
                  }}
                  startIcon={<AddIcon />}
                  onClick={handleAddImage}
                >
                  Add Image
                </Button>
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

export default AddProduct;
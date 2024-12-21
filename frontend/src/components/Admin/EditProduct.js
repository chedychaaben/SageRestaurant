import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Grid, Box } from '@mui/material';
import API_HOST from '../config';

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate,useParams } from 'react-router-dom';

import { Checkbox, FormControlLabel, FormGroup , MenuItem, Chip, Input, InputLabel, Select, FormControl, FormLabel} from "@mui/material";


import {
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';

function EditProduct () {
    const{id} = useParams()
    const [categories, setCategories] = useState([])
    const [ingredientsCounter, setIngredientsCounter] = useState(1);
    const [supplementsCounter, setSupplementsCounter] = useState(1);
    const [imagesCounter, setImagesCounter] = useState(1);
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: 0,
      discountRate: 0,
      prepTime: 0,
      categoryId: 0,
      ingredients: [],
      supplements: [],
      images: []
    });


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


  
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');


  // Add a new ingredient
  const handleAddIngredient = () => {
    const newIngredient = { index: ingredientsCounter, name: "" };
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, newIngredient]
    });
    setIngredientsCounter(ingredientsCounter + 1);
  };

  // Remove an ingredient
  const handleRemoveIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter(ingredient => ingredient.index !== index)
    });
  };

  // Handle input changes Ingredient
  const handleInputChangeIngredient = (index, newValue) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.map((ingredient) =>
        ingredient.index === index ? { ...ingredient, name: newValue } : ingredient
      ),
    });
  };

  // Add a new supplement
  const handleAddSupplement = () => {
    const newSupplement = { index: supplementsCounter, name: "" };
    setFormData({
      ...formData,
      supplements: [...formData.supplements, newSupplement]
    });
    setSupplementsCounter(supplementsCounter + 1);
  };

  // Remove an supplement
  const handleRemoveSupplement = (index) => {
    setFormData({
      ...formData,
      supplements: formData.supplements.filter(supplement => supplement.index !== index)
    });
  };

  // Handle input changes Supplement
  const handleInputChangeSupplement = (index, newValue) => {
    setFormData({
      ...formData,
      supplements: formData.supplements.map((supplement) =>
        supplement.index === index ? { ...supplement, name: newValue } : supplement
      ),
    });
  };

  // Handle input changes Supplement Price
  const handleInputChangeSupplementPrice = (index, newValue) => {
    setFormData({
      ...formData,
      supplements: formData.supplements.map((supplement) =>
        supplement.index === index ? { ...supplement, price: newValue } : supplement
      ),
    });
  };


  // Add a new image
  const handleAddImage = () => {
    const newImage = { index: imagesCounter, file: "" };
    setFormData({
      ...formData,
      images: [...formData.images, newImage]
    });
    setImagesCounter(imagesCounter + 1);
  };

  // Remove an image
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter(image => image.index !== index)
    });
  };

  // Handle input changes Image
  const handleInputChangeImage = (index, newValue) => {
    setFormData({
      ...formData,
      images: formData.images.map((image) =>
        image.index === index ? { ...image, file: newValue } : image
      ),
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const fetchProduct = async (id) => {
    try {
      const res = await axios.get(`${API_HOST}/api/Product/GetProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const {
        name,
        description,
        price,
        discountRate,
        prepTime,
        categoryId,
        ingredients,
        supplements,
        images: rawImages,
      } = res.data;
  
      // Fetch image files with axios
      const fetchImageFile = async (imageUrl, imageName) => {
        try {
          const response = await axios.get(imageUrl, {
            responseType: 'blob', // Ensures we get binary data
          });
          return new File([response.data], imageName, { type: response.data.type });
        } catch (error) {
          console.error(`Failed to fetch image: ${imageUrl}`, error);
          return null; // Return null if fetching image fails
        }
      };
  
      const imagePromises = rawImages.map((image, index) =>
        fetchImageFile(`${API_HOST}${image.imagePath}`, image.imagePath).then((file) => ({
          index,
          file,
        }))
      );
  
      const images = (await Promise.all(imagePromises)).filter((image) => image.file !== null);
  
      const formattedIngredients = ingredients.map((ingredient, index) => ({
        index,
        name: ingredient.name,
      }));
  
      const formattedSupplements = supplements.map((supplement, index) => ({
        index,
        name: supplement.name,
        price: supplement.price,
      }));
  
      setFormData({
        name,
        description,
        price,
        discountRate,
        prepTime,
        categoryId,
        ingredients: formattedIngredients,
        supplements: formattedSupplements,
        images,
      });
  
      setImagesCounter(images.length);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // First, process your data (images, ingredients, supplements)
    const processedImages = formData.images.map(image => ({ filedata: image.file }));
    const processedIngredients = formData.ingredients.map(ingredient => ({ Name: ingredient.name })); // Remove id, keep name
    const processedSupplements = formData.supplements.map(supplement => ({ Name: supplement.name, Price: supplement.price })); // Remove id, keep name

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
      const response = await axios.put(
        `${API_HOST}/api/Product/EditProduct/${id}`,
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


  useEffect(() => {
    fetchcategories();
    fetchProduct(id);
  }, []);

  return (
    <>
    <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
        Edit Product ({formData.name})
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
                  {categories?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box mb={4} container spacing={2}>
            <FormLabel htmlFor="Ingredients">Ingredients</FormLabel>
              
            {formData.ingredients?.map((field, index) => (
                <Box item xs={12} key={index}  sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "white" }}>
                <TextField
                    label={`Ingredient ${field.index}`}
                    value={field.name}
                    onChange={(e) => handleInputChangeIngredient(field.index, e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                />
                <IconButton
                    onClick={() => handleRemoveIngredient(field.index)}
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


            
            <Box mb={4} container spacing={2}>
            <FormLabel htmlFor="Supplements">Supplements</FormLabel>
              
            {formData.supplements?.map((field, index) => (
                <Box item xs={12} key={index}  sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "white" }}>
                <TextField
                    label={`Supplement ${field.index}`}
                    value={field.name}
                    onChange={(e) => handleInputChangeSupplement(field.index, e.target.value)}
                    fullWidth
                    variant="outlined"
                    required
                />
                <TextField
                    label={`Price ${field.index}`}
                    value={field.price}
                    onChange={(e) => handleInputChangeSupplementPrice(field.index, e.target.value)}
                    fullWidth
                    type="number"
                    variant="outlined"
                    required
                />
                <IconButton
                    onClick={() => handleRemoveSupplement(field.index)}
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
                  onClick={handleAddSupplement}
                >
                  Add Supplement
                </Button>
              </Box>
            </Box>


            
            <Box mb={4} container spacing={2}>
            <FormLabel htmlFor="Images">Images</FormLabel>
              
            {formData.images?.map((field, index) => (
                <Box item xs={12} key={index} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "white" }}>
                <Box sx={{ flex: 1 }}>
                  { 
                    field.file.name?.startsWith("/uploads/") ? (
                      <img src={`${API_HOST}${field.file.name}`} width={50}/>
                    ) : (
                      <>
                        <label htmlFor={`upload-button-${field.index}`} style={{ display: "block", textAlign: "center", padding: "8px 16px", border: "1px dashed #ccc", borderRadius: "4px", cursor: "pointer", backgroundColor: "#ffffff" }}>
                          {field.file ? field.file.name : `Click to upload image ${field.index}`}
                        </label>
                        
                        <input
                          id={`upload-button-${field.index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleInputChangeImage(field.index, e.target.files[0])}
                          style={{ display: "none" }}
                        />
                      </>
                    )
                  }
                </Box>
                <IconButton
                    onClick={() => handleRemoveImage(field.index)}
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
      <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled">
        {snackbarMessage}
      </MuiAlert>
    </Snackbar>
    </>
  );
};

export default EditProduct;
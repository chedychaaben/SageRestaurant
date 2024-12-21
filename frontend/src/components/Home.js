
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_HOST from './config';
import { AppBar, Toolbar, Typography, Container, Grid, Button, Box, Card, CardMedia, CardContent } from '@mui/material';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import CoffeeIcon from '@mui/icons-material/Coffee';
import { Link } from "react-router-dom";
import { fontWeight, styled } from '@mui/system';
import FoodLogo from "../assets/svg/food.svg";
import CitiesLogo from "../assets/svg/cities.svg";

import SearchIcon from '@mui/icons-material/Search';
import {  alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#ffffff", 0.15),
  '&:hover': {
    backgroundColor: alpha("#ffffff", 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const CategorieButton = styled(Button)({
  backgroundColor: '#FFF3DA', // Couleur verte
  color: 'black', // Texte blanc
  borderRadius: '30px', // Border radius pour un bouton plus arrondi
  mb: 3,
  width: '170px',
  fontSize: '1.0rem',
  fontWeight: 'bold',
  padding: '10px 20px', // Espacement interne
  textTransform: 'none', // Pour garder le texte en majuscules exactes
  '&:hover': {
      backgroundColor: '#FFC244', // Change la couleur lors du survol
  },
});

function Home() {
  const [categories, setCategories] = useState([])
  const [productOfTheDay, setProductOfTheDay] = useState([])

  const fetchcategories = async() => {
    try
    {
      const res = await axios.get(
        `${API_HOST}/api/Category/GetAllCategories`
      )
      setCategories(res.data)
    }
    catch(e)
    {
      console.error(e)
    }
  }

  const fetchProductOfTheDay = async () => {
    try {
      // Fetch the list of product of the day entities
      const res = await axios.get(`${API_HOST}/api/ProductOfTheDay/GetAllProductOfTheDays`);
      
      // Check if the response contains data and the list is not empty
      if (res.data && res.data.length > 0) {
        // Get the last entity from the list
        const lastEntity = res.data[res.data.length - 1];
        
        // Get the productId from the last entity
        const productId = lastEntity.productId;
        
        // Fetch product details using the productId
        const productRes = await axios.get(`${API_HOST}/api/Product/GetProduct/${productId}`);
        
        // Save the fetched product details to the state
        setProductOfTheDay(productRes.data);
      } else {
        console.error('No product of the day found.');
      }
    } catch (e) {
      console.error('Error fetching product of the day:', e);
    }
  };
  
  useEffect(() => {
    fetchcategories();
    fetchProductOfTheDay();
  }, []);
    return (
      <>
      <Box sx={{ textAlign: 'center', py: 6, color: 'white',  backgroundColor: '#FFC244', padding:"20px"}}>
        <Typography variant="h2" gutterBottom>
          <Container sx={{ py: 4, textAlign: 'center' }}>
          <Box 
            sx={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',  // Center align the content horizontally
              justifyContent: 'center',  // Center align the content vertically
              textAlign: 'center',  // Align the text to the center
            }}
          >
            <Box
              component="img"
              src={productOfTheDay?.images?.[0]?.imagePath ? `${API_HOST}${productOfTheDay.images[0].imagePath}` : FoodLogo}
              alt="Plat du jour"
              sx={{
                width: 240, // Control the image width
                height: 240, // Control the image height
                borderRadius: '50%', // Makes the image round
                objectFit: 'cover', // Ensures the image covers the circle properly
              }}
            />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: "black" }}>
              {productOfTheDay.name}
            </Typography>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Plat du jour
            </Typography>
          </Box>

          </Container>
        </Typography>
      </Box>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80">
      <path fill="#FFC244" d="M0,70L60,72.5C120,75,240,80,360,77.5C480,75,600,70,720,67.5C840,65,960,72.5,1080,75C1200,77.5,1320,77.5,1380,77.5L1440,77.5L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"/>
    </svg>
  <Container sx={{ py: 4, textAlign: 'center' }}>
    
      <Box
                component="img"
                src={CitiesLogo}
                alt="Material UI Logo"
                sx={{
                  width: 120, // Control the image width
                  height: 120, // Control the image height
                  borderRadius: '50%', // Makes the image round
                  objectFit: 'cover', // Ensures the image covers the circle properly
                }}
            />

      <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Menu
      </Typography>


      <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap', // Allows wrapping to prevent overflow
            gap: 2, // Adds space between items
            justifyContent: 'center', // Centers items horizontally
            overflowX: 'auto', // Enables horizontal scrolling if necessary
          }}
        >
        {categories.map((category, index) => (
          <Link to={`/categorie/${category.id}`}>
            <CategorieButton 
              key={index} 
            >
              {category.name}
            </CategorieButton>
          </Link>
        ))}
      </Box>
    </Container>

    </>
    );
}

export default Home;

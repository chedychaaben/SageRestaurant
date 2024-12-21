import React, { useState, useEffect } from 'react';
import { Box, CardMedia, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import API_HOST from "./config";


function ProductImageSlider(images) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.images.length - 1 : prev - 1
    );
  };

  // Move to the next image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.images.length);
    }, 3000); // 3-second interval

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: 250,
        height: 250,
        margin: 'auto',
        mt: 4,
      }}
    >
      {/* Slider Content */}
      <CardMedia
        component="img"
        height="250"
        width="250"
        image={`${API_HOST}${images.images[currentIndex]?.imagePath}`}
        sx={{
          borderRadius: '8px',
          padding: '0 20px',
          objectFit: 'cover',
        }}
      />

      {/* Navigation Buttons */}
      {images.images.length > 1 ? (
        <>
            <IconButton
            onClick={handlePrevious}
            sx={{
                position: 'absolute',
                top: '50%',
                left: '10px', // Adjusted from '-20px' for better visibility
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(30, 30, 30, 0.8)', // Dark gray background
                color: '#f5f5f5', // Slightly off-white for a softer appearance
                padding: '10px', // Increased padding for better clickability
                borderRadius: '50%', // Circular button for modern design
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                '&:hover': {
                backgroundColor: 'rgba(30, 30, 30, 1)', // Fully opaque on hover
                color: '#fff', // White icon color on hover
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)', // Stronger shadow on hover
                },
            }}
            >
            <ArrowBackIosIcon />
            </IconButton>
            <IconButton
            onClick={handleNext}
            sx={{
                position: 'absolute',
                top: '50%',
                right: '10px', // Adjusted from '-20px' for better visibility
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(30, 30, 30, 0.8)', // Dark gray background
                color: '#f5f5f5', // Slightly off-white for a softer appearance
                padding: '10px', // Increased padding for better clickability
                borderRadius: '50%', // Circular button for modern design
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                '&:hover': {
                backgroundColor: 'rgba(30, 30, 30, 1)', // Fully opaque on hover
                color: '#fff', // White icon color on hover
                boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.3)', // Stronger shadow on hover
                },
            }}
            >
            <ArrowForwardIosIcon />
            </IconButton>
        </>
        ) : null}

    </Box>
  );
}

export default ProductImageSlider;

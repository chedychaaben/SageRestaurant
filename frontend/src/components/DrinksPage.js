import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_HOST from './config';
import { Link } from "react-router-dom";
import { Container, Box, Paper, Typography, Button, Card, CardMedia, CardContent, Modal, Stack } from '@mui/material';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { styled } from '@mui/system';




const CustomElement = styled(Button)({
    backgroundColor: 'white',  // Set background color to white
    color: '#c1c1c1',            // Set text color to black
    boxShadow: 'none',         // Remove box shadow
    border: '1px solid #c1c1c1',
    width: '100%',             // Set the width to 100% of the parent container
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures arrow stays on the right
    textTransform: 'none',
    marginBottom: "15px",
    padding: "10px"
  });
  
const CustomElementSelected = styled(Button)({
    backgroundColor: 'white',  // Set background color to white
    color: 'black',            // Set text color to black
    boxShadow: 'none',         // Remove box shadow
    border: '1px solid #00a082',
    width: '100%',             // Set the width to 100% of the parent container
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures arrow stays on the right
    textTransform: 'none',
    marginBottom: "15px",
    padding: "10px"
  });

const CustomCloseIcon = styled(CloseIcon) ({
    backgroundColor: '#b2b2b2', // Couleur verte
    color: 'white',
    borderRadius: '30px',
    padding: '2px',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        cursor: 'pointer',
    },
})

const AddToCartButton = styled(Button)({
    backgroundColor: '#00a082', // Couleur verte
    color: 'white', // Texte blanc
    borderRadius: '30px', // Border radius pour un bouton plus arrondi
    fontWeight: 'bold',
    fontSize: '20px',
    padding: '10px 20px', // Espacement interne
    textTransform: 'none', // Pour garder le texte en majuscules exactes
    width: "100%",
    '&:hover': {
        backgroundColor: '#00846b', // Change la couleur lors du survol
    },
});


const CustomDiscountContainer = styled(Button) ({
    backgroundColor: '#FFC244', // Couleur verte
    color: 'black',
    borderRadius: '10px',
    padding: '2px',
    fontWeight: 'bold',
    textTransform: 'none',
})

const CustomAddProductButton = styled(Button)({
    backgroundColor: '#e9f8f5',
    color: '#00a082',
    borderRadius: '50%', // Fully rounded corners
    padding: '12px 20px', // Adjust padding to maintain shape
    textTransform: 'none',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#b6d4ce',
    },
})

const CustomRemoveProductButton = styled(Button)(({ disabled }) => ({
    backgroundColor: disabled ? '#eeeeee' : '#e9f8f5',
    color: '#00a082',
    borderRadius: '50%', // Fully rounded corners
    padding: '12px 20px', // Adjust padding to maintain shape
    textTransform: 'none',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#b6d4ce',
    },
}));

function DrinksPage({ openOverlay, setOpenOverlay, product, cart, setCart, fetchcart}) {
    const [drinks, setDrinks] = useState([])

    
    const adddrinkcart = async(DrinkId) => {
        try
        {
          const res = await axios.post(
            `${API_HOST}/api/DrinkCart/AddDrinkCart/${DrinkId}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )
          setCart((prevCart) => ({
            ...prevCart, // Preserve existing properties in the cart object
            drinkCarts: [...prevCart.drinkCarts, res.data] // Add the new object to the drinkCarts array
            }));
        }
        catch(e)
        {
          console.error(e)
        }
      }


    const adddrinkcartquantity = async(DrinkId) => {
        try
        {
          const res = await axios.put(
            `${API_HOST}/api/DrinkCart/AddQuantity/${DrinkId}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )
          setCart(prevCart => {
            return {
              ...prevCart,
              drinkCarts: prevCart.drinkCarts.map(drink => 
                drink.drinkId === DrinkId // Use 'drinkId' to match the property name
                  ? { ...drink, quantity: drink.quantity + 1 } // Increase quantity by 1
                  : drink // Keep other products unchanged
              )
            };
          });

        }
        catch(e)
        {
          console.error(e)
        }
      }
    
  const removedrinkcartquantity = async(DrinkId) => {
    try
    {
      const res = await axios.put(
        `${API_HOST}/api/DrinkCart/RemoveQuantity/${DrinkId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      
      setCart(prevCart => {
        return {
          ...prevCart,
          drinkCarts: prevCart.drinkCarts.map(drink => 
            drink.drinkId === DrinkId // Use 'drinkId' to match the property name
              ? { ...drink, quantity: drink.quantity - 1 } // Decrease quantity by 1
              : drink // Keep other products unchanged
          )
          .filter((drink) => drink.quantity > 0), // Remove product if quantity is 0
        };
      });
      
    }
    catch(e)
    {
      console.error(e)
    }
  }

    const fetchdrinks = async() => {
        try
        {
        const res = await axios.get(
            `${API_HOST}/api/Drink/GetAllDrinks`,
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            }
        )
        setDrinks(res.data)
        }
        catch(e)
        {
        console.error(e)
        }
    }

    useEffect(() => {
        fetchdrinks();
    }, []);
    if (!product) return null; // If product is null, don't render the modal
    return (
        
        <Modal
            open={openOverlay}
            onClose={() => setOpenOverlay(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    display: 'flex',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 5,
                    maxHeight: 800,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { display: "none" } // Hide scrollbar
                }}
            >
                <CustomCloseIcon onClick={() => setOpenOverlay(false)} sx={{ position: 'absolute', top: 20, right: 20 }}/>
                
                <Box sx={{ width: "500px" }}>
                <div style={{ padding: 16 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }} >
                        Drinks
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: "grey", marginBottom: "20px"}}>
                        Choose your drinks
                    </Typography>
                    {drinks.map((drink, index) => {
                        const currentDrink = cart?.drinkCarts?.find(d => d.drinkId == drink.id);
                        const quantity = currentDrink ? currentDrink.quantity : 0;
                        return (
                        <>
                        {quantity === 0 ? (
                            <CustomElement key={drink.id} disableRipple>
                                <img src={`${API_HOST}${drink.imagePath}`} width="100px" />
                                <Typography sx={{ fontWeight: "bold" }} >{drink.name}</Typography>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2}}>
                                    <CustomRemoveProductButton disabled>
                                        <RemoveIcon/>
                                    </CustomRemoveProductButton>
                                    <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                                    <CustomAddProductButton onClick={() => adddrinkcart(drink.id)}>
                                        <AddIcon />
                                    </CustomAddProductButton>
                                </Box>
                            </CustomElement>
                        ) : (
                            <CustomElementSelected key={drink.id} disableRipple>
                                <img src={`${API_HOST}${drink.imagePath}`} width="100px" />
                                <Typography sx={{ fontWeight: "bold" }} >{drink.name}</Typography>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2}}>
                                    <CustomRemoveProductButton onClick={() => removedrinkcartquantity(drink.id)}>
                                        <RemoveIcon/>
                                    </CustomRemoveProductButton>
                                    <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                                    <CustomAddProductButton onClick={() => adddrinkcartquantity(drink.id)}>
                                        <AddIcon />
                                    </CustomAddProductButton>
                                </Box>
                            </CustomElementSelected>
                        )}
                        </>
                        )
                    })}
                </div>
                <Link to="/checkout">
                    <AddToCartButton fullWidth sx={{ mt: 3 }}>
                        Order now
                    </AddToCartButton>
                </Link>
                
                </Box>
            </Box>
        </Modal>
    );
}

export default DrinksPage;

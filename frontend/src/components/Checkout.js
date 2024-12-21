
import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_HOST from './config';
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {
    Container,
    Box,
    Paper,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    Modal,
    Stack,
    Divider,
    Stepper,
    Step,
    StepLabel,
    TextField
  } from '@mui/material';
  
  
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

const CommanderButton = styled(Button)({
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


const IngredientSupplementButton = styled(Button)({
  backgroundColor: '#FFF3DA', // Couleur verte
  color: 'black', // Texte blanc
  borderRadius: '30px', // Border radius pour un bouton plus arrondi
  fontSize: '10px',
  textTransform: 'none', // Pour garder le texte en majuscules exactes
});

function calculateCartTotals(cart) {
  // Total products (including supplements)
  let totalProducts = 0;
  let totalDiscounts = 0; // New variable to track total discounts

  cart.productCarts?.forEach(product => {
    const productTotal = product.price * product.quantity;
    const productDiscount = (product.price * product?.discountRate / 100) * product.quantity;

    // Calculate supplements
    const supplementsTotal = product.productCartSupplements?.reduce(
        (acc, supplement) => acc + supplement.price * product.quantity, 0
    );

    // Add to totals
    totalProducts += productTotal + supplementsTotal;
    totalDiscounts += productDiscount; // Add discount to the total discounts
});

  // Total drinks
  const totalDrinks = cart.drinkCarts?.reduce(
      (acc, drink) => acc + drink.price * drink.quantity, 0
  );

  // Total whole cart
  const totalCart = totalProducts - totalDiscounts + totalDrinks;

  return {
      totalProducts,
      totalDiscounts,
      totalDrinks,
      totalCart
  };
}

function Checkout() {
    const [cart, setCart] = useState({})
    const [message, setMessage] = useState('')

    const { totalProducts, totalDiscounts, totalDrinks, totalCart } = calculateCartTotals(cart);

    const navigate = useNavigate();

    const calculateDiscountedPrice = (price, discountRate) => {
    return price - (price * discountRate) / 100;
    };

    const handleChange = (e) => {
      setMessage(e.target.value);
    };

    const fetchcart = async() => {
        try
        {
        const res = await axios.get(
            `${API_HOST}/api/Cart/GetCart`,
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            }
        )
        setCart(res.data)
        }
        catch(e)
        {
        console.error(e)
        }
    }
    const PlaceOrder = async() => {
        try
        {
            const res = await axios.post(
                `${API_HOST}/api/Order/AddOrder`,
                { "message" : message},
                {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                }
            )
            navigate("/order-placed");
        }
        catch(e)
        {
          console.error(e)
        }
    }

  useEffect(() => {
    fetchcart();
  }, []);

    return(
        <>
            <Container maxWidth="lg" sx={{ marginTop: 9 }}>
                <h1>Order Summary</h1>

                <Box sx={{ padding: 2 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }} // Stack items vertically on small screens, horizontally on medium+
                spacing={3} // Spacing between sections
                sx={{ alignItems: 'stretch' }} // Ensure items stretch to equal height
            >
                {/* Mail Section */}
                <Card sx={{ flex: 2 }}>
                    <CardContent>
                        <div>
      
      {/* Products List */}
      <h2>Products</h2>
      {cart.productCarts?.length > 0 ? (
        
        cart.productCarts?.map((product) => (
          <CustomElementSelected key={product.id} disableRipple>
              <img src={`${API_HOST}${product.imagePath}`} width="100px" />
              <Typography sx={{ fontWeight: "bold" }} >
                <Typography sx={{ fontWeight: "bold", alignSelf: 'flex-start'}} >X{product.quantity}</Typography>
                {product.name}
                <Box>
                  {[
                    ...product.productCartIngredients?.map(i => <IngredientSupplementButton disableRipple>{`${i.name}`}</IngredientSupplementButton>),
                    ...product.productCartSupplements?.map(s => <IngredientSupplementButton disableRipple>{`${s.name} (${s.price} TND)`}</IngredientSupplementButton>)
                  ]}
                </Box>
              </Typography>
              <Box
                  sx={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    marginBottom: 2,
                    marginTop: 2
                  }}
                  key={product.id}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <p><strong>Description:</strong> {product.description}</p>

                    <p><strong>Discounted Price:</strong> {calculateDiscountedPrice(product.price, product.discountRate)?.toFixed(2)} TND</p>
                    <p><strong>Preparation Time:</strong> {product.prepTime} minutes</p>
                  </Box>
                </Box>
        </CustomElementSelected>
        ))

      ) : (
        <p>No products in the cart.</p>
      )}

      {/* Drinks List */}
      <h2>Drinks</h2>
      {cart.drinkCarts?.length > 0 ? (

        cart.drinkCarts?.map((drink) => (
          <CustomElementSelected key={drink.id} disableRipple>
              <img src={`${API_HOST}${drink.imagePath}`} width="100px" />
              <Typography sx={{ fontWeight: "bold" }} >
                <Typography sx={{ fontWeight: "bold", alignSelf: 'flex-start'}} >X{drink.quantity}</Typography>
                {drink.name}
              </Typography>
              <Box
                  sx={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    marginBottom: 2,
                    marginTop: 2
                  }}
                  key={drink.id}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <Typography sx={{ fontWeight: "bold" }} >{drink.price} TND</Typography>
                  </Box>
                </Box>
        </CustomElementSelected>
        ))
      
      ) : (
        <p>No drinks in the cart.</p>
      )}

      <h2>Message</h2>
      <Container>
          <TextField
            label="Your Message"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={6} // Adjust the default number of rows
            value={message}
            onChange={handleChange}
          />
      </Container>
    </div>
                    </CardContent>
                </Card>

                {/* Steps Section */}
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Summary
                        </Typography>
                        <Divider />
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center" // Optional: Align items vertically in the center
                            padding={2} // Optional: Add padding
                            >
                            <Typography variant="h6">Products</Typography>
                            <Typography variant="h6">{totalProducts?.toFixed(2)} TND</Typography>
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center" // Optional: Align items vertically in the center
                            padding={2} // Optional: Add padding
                            >
                            <Typography variant="h6">Discount</Typography>
                            <Typography variant="h6">{totalDiscounts?.toFixed(2)} TND</Typography>
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center" // Optional: Align items vertically in the center
                            padding={2} // Optional: Add padding
                            >
                            <Typography variant="h6">Drinks</Typography>
                            <Typography variant="h6">{totalDrinks?.toFixed(2)} TND</Typography>
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center" // Optional: Align items vertically in the center
                            padding={2} // Optional: Add padding
                            >
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6">{totalCart?.toFixed(2)} TND</Typography>
                        </Box>
                        <CommanderButton
                        variant="contained"
                        onClick={() => {PlaceOrder()}}
                    >
                        Confirm Order
                    </CommanderButton>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
            </Container>
        </>
    )
}

export default Checkout;

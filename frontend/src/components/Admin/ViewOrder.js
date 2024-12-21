
import { styled } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate,useParams } from 'react-router-dom'
import axios from 'axios';
import API_HOST from '../config';
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

  cart?.productCarts?.forEach(product => {
    const productTotal = product.price * product.quantity;
    const productDiscount = (product.price * product?.discountRate / 100) * product.quantity;

    // Calculate supplements
    const supplementsTotal = product?.productCartSupplements?.reduce(
        (acc, supplement) => acc + supplement.price * product.quantity, 0
    );

    // Add to totals
    totalProducts += productTotal + supplementsTotal;
    totalDiscounts += productDiscount; // Add discount to the total discounts
});

  // Total drinks
  const totalDrinks = cart?.drinkCarts?.reduce(
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

function ViewOrder() {
    const [order, setOrder] = useState({})

    const { totalProducts, totalDiscounts, totalDrinks, totalCart } = calculateCartTotals(order.cart);

    const{id} = useParams()

    const calculateDiscountedPrice = (price, discountRate) => {
      return price - (price * discountRate) / 100;
    };
    
    const fetchorder = async(id) => {
        try
        {
        const res = await axios.get(
            `${API_HOST}/api/Order/GetOrder/${id}`,
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            }
        )
        setOrder(res.data)
        }
        catch(e)
        {
        console.error(e)
        }
    }

  useEffect(() => {
    fetchorder(id);
  }, []);

    return(
        <>
            <Container maxWidth="lg" sx={{ marginTop: 9 }}>
                <h1>Order No.{order.id}</h1>

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
      {order?.cart?.productCarts?.length > 0 ? (
        
        order?.cart?.productCarts?.map((product) => (
          <CustomElementSelected key={product.id} disableRipple>
              <img src={`${API_HOST}${product.imagePath}`} width="100px" />
              <Typography sx={{ fontWeight: "bold" }} >
                <Typography sx={{ fontWeight: "bold", alignSelf: 'flex-start'}} >X{product.quantity}</Typography>
                {product.name}
                <Box>
                  {[
                    ...product?.productCartIngredients?.map(i => <IngredientSupplementButton disableRipple>{`${i.name}`}</IngredientSupplementButton>),
                    ...product?.productCartSupplements?.map(s => <IngredientSupplementButton disableRipple>{`${s.name} (${s.price} TND)`}</IngredientSupplementButton>)
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
      {order?.cart?.drinkCarts?.length > 0 ? (

        order?.cart?.drinkCarts?.map((drink) => (
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

      {order.message && order.message.trim() !== "" && (
        <div>
          <h2>Message</h2>
          <Container>
            <p style={{ whiteSpace: 'pre-line' }}>
              {order.message}
            </p>
          </Container>
        </div>
      )}
      <br />
      <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center" // Optional: Align items vertically in the center
          padding={2} // Optional: Add padding
          >
          <Typography variant="h6"  sx={{ fontWeight: "bold" }}>Products</Typography>
          <Typography variant="h6">{totalProducts?.toFixed(2)} TND</Typography>
      </Box>
      <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center" // Optional: Align items vertically in the center
          padding={2} // Optional: Add padding
          >
          <Typography variant="h6"  sx={{ fontWeight: "bold" }}>Discount</Typography>
          <Typography variant="h6">{totalDiscounts?.toFixed(2)} TND</Typography>
      </Box>
      <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center" // Optional: Align items vertically in the center
          padding={2} // Optional: Add padding
          >
          <Typography variant="h6"  sx={{ fontWeight: "bold" }}>Drinks</Typography>
          <Typography variant="h6">{totalDrinks?.toFixed(2)} TND</Typography>
      </Box>
      <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center" // Optional: Align items vertically in the center
          padding={2} // Optional: Add padding
          >
          <Typography variant="h6"  sx={{ fontWeight: "bold" }}>Total</Typography>
          <Typography variant="h6">{totalCart?.toFixed(2)} TND</Typography>
      </Box>

    </div>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
            </Container>
        </>
    )
}

export default ViewOrder;

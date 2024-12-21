import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_HOST from './config';
import { useParams } from "react-router-dom";
import { Container, Box, Paper, Typography, Button, Card, CardMedia, CardContent, Modal, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from "react-router-dom";
import ProductDetails from "./ProductDetails"
import DrinksPage from "./DrinksPage"
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';

const Overlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#00000099', // Adds a semi-transparent overlay
    zIndex: 1, // Ensures the overlay is below the button
  });

  
  const CategorieButton = styled(Button)({
    color: 'black', // Texte blanc
    width: "100%",
    padding: '10px 20px', // Espacement interne
    textTransform: 'none', // Pour garder le texte en majuscules exactes
    '&:hover': {
        backgroundColor: '#e9f8f5', // Change la couleur lors du survol
    },
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


const CustomDiscountContainer = styled(Button) ({
  backgroundColor: '#FFC244',  // Custom background color
  color: 'black',
  fontSize: '10px',  // Custom font size for smaller text
  textTransform: 'none',  // Disable text transformation (no uppercase)
  minWidth: "10px",
  padding: "0px 10px",
  float: "left"
})

const CustomAddProductButton = styled(Button)({
  backgroundColor: '#e9f8f5',
  color: '#00a082',
  borderRadius: '50%', // Fully rounded corners
  textTransform: 'none',
  minWidth: "5px",
  padding: "3px",
  cursor: 'pointer',
  '&:hover': {
      backgroundColor: '#b6d4ce',
  },
})

const CustomRemoveProductButton = styled(Button)(({ disabled }) => ({
  backgroundColor: disabled ? '#eeeeee' : '#e9f8f5',
  color: '#00a082',
  borderRadius: '50%', // Fully rounded corners
  textTransform: 'none',
  minWidth: "5px",
  padding: "3px",
  cursor: 'pointer',
  '&:hover': {
      backgroundColor: '#b6d4ce',
  },
}));

function ListingPage() {
  const [category, setCategory] = useState({})

  const [categories, setCategories] = useState([])

  const [selectedProduct, setSelectedProduct] = useState({})

  const [openProductDetailsOverlay, setOpenProductDetailsOverlay] = useState(false)

  const [openDrinksPageOverlay, setOpenDrinksPageOverlay] = useState(false)
  
  const [cart, setCart] = useState({})

  const { id } = useParams()
  
  
  const addproductcartquantity = async(ProductId) => {
    try
    {
      const res = await axios.put(
        `${API_HOST}/api/ProductCart/AddQuantity/${ProductId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      // Update only the product that matches the ProductId in the cart
      setCart(prevCart => {
        return {
          ...prevCart,
          productCarts: prevCart.productCarts.map(product => 
            product.productId === ProductId 
              ? { ...product, quantity: product.quantity + 1 } // Increase quantity by 1
              : product // Keep other products unchanged
          )
        };
      });

    }
    catch(e)
    {
      console.error(e)
    }
  }

  const removeproductcartquantity = async(ProductId) => {
    try
    {
      const res = await axios.put(
        `${API_HOST}/api/ProductCart/RemoveQuantity/${ProductId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      // Update the cart: decrease the quantity, or remove the product if quantity reaches 0
      setCart((prevCart) => {
        return {
          ...prevCart,
          productCarts: prevCart.productCarts
            .map((product) =>
              product.productId === ProductId
                ? { ...product, quantity: product.quantity - 1 } // Decrease quantity by 1
                : product
            )
            .filter((product) => product.quantity > 0), // Remove product if quantity is 0
        };
      });

    }
    catch(e)
    {
      console.error(e)
    }
  }

  const fetchcategory = async() => {
    try
    {
      const res = await axios.get(
        `${API_HOST}/api/Category/GetCategory/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setCategory(res.data)
    }
    catch(e)
    {
      console.error(e)
    }
  }
  

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

  useEffect(() => {
    fetchcategories();
    fetchcategory();
    fetchcart();
  }, []);

    return(
        <>
        {openProductDetailsOverlay && <Overlay >
          <ProductDetails 
              openOverlay={openProductDetailsOverlay} 
              setOpenOverlay={setOpenProductDetailsOverlay} 
              product={selectedProduct}
              cart={cart}
              setCart={setCart}
              fetchcart = {fetchcart}
            />
        </Overlay>}
        
        {openDrinksPageOverlay && <Overlay >
          <DrinksPage 
              openOverlay={openDrinksPageOverlay} 
              setOpenOverlay={setOpenDrinksPageOverlay} 
              product={selectedProduct}
              cart={cart}
              setCart={setCart}
              fetchcart = {fetchcart}
            />
        </Overlay>}

      <Box sx={{ margin : 10}}>
      <Box 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Left Column: Filter */}
        <Box
          sx={{
            width: { xs: '100%', md: '17%' },
            display: 'flex',
          }}
        >
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Filtres</Typography>
            {categories.map((cat, index) => (
              <Link to={`/categorie/${cat.id}`} onClick={ () => { setCategory(cat)}}>
                <CategorieButton key={index} 
                  sx={{
                    backgroundColor: cat.id === category.id ? "#e9f8f5" : "" 
                  }}>
                  {cat.name}
                </CategorieButton>
                <Divider />
              </Link>
            ))}
          </Paper>
        </Box>

        {/* Middle Column: Results */}
        {category.products?.length == 0 ? 
          <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            padding: 2,
            mt: 3,
            display: 'flex',
            justifyContent: 'center', // Center horizontally
            alignItems: 'center',     // Center vertically
            textAlign: 'center',      // Optional: Centers text itself
          }}
        >
          <Box
            sx={{
              fontSize: '24px', // Adjust size as needed
              fontWeight: 'bold', // Optional: make the text bold
              color: 'black', // Text color
              animation: 'shine 1.5s infinite alternate',
            }}
          >
            No products in this category
          </Box>
        </Box>
        :
        <Box
          sx={{
            width: { xs: '100%', md: '50%'},
            padding: 2,
            mt : 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{category.name}</Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)', // 3 cards per row
              gap: 4,
              marginTop: 2,
            }}
          >
            {category.products?.map((product, index) => (
                <div onClick={() => {setSelectedProduct(product);setOpenProductDetailsOverlay(true) } }>
                <Card key={index} sx={{ boxShadow: 'none' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${API_HOST}${product.images[0]?.imagePath}`}
                    alt={product.name}
                    sx={{
                      borderRadius: 2,
                      objectFit: 'cover',  // Ensures image covers the area without distortion
                      cursor: 'pointer',
                      transition: 'transform 0.3s',  // Add transition to make the zoom smooth
                      '&:hover': {
                        transform: 'scale(1.05)',  // Apply zoom effect on hover
                      },
                    }}
                  />
                </Card>
                  <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {product.price} TND
                    </Typography>
                  </Box>
                </div>

            ))}
          </Box>
        </Box>
        }

        {/* Right Column: Cart */}
        <Box
          sx={{
            width: { xs: '100%', md: '25%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {cart?.productCarts?.length > 0 ? 
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: "bold", mb: 4 }}>Your Order</Typography>
              {cart.productCarts?.map((product, index) => (
              <>
              <Box
              sx={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                marginBottom: 2,
                marginTop: 2
              }}
              key={product.id || index}
            >
              <Typography sx={{ fontWeight: "bold", alignSelf: 'flex-start'}} >X{product.quantity}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Box
                sx={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between'
                }}>
                  <Typography sx={{ fontWeight: "bold" }}>{product.name}</Typography>
                  <Typography sx={{ fontWeight: "bold" }} >{product.price} TND
              {product.discountRate?
              <Typography>
                  <CustomDiscountContainer size="small">-{product.discountRate}%</CustomDiscountContainer>
              </Typography>
              : ""}</Typography>
                </Box>
                <Typography sx={{ fontSize : "10px"}}>
                  {[
                    ...product.productCartIngredients?.map(i => i.name),
                    ...product.productCartSupplements?.map(s => s.name)
                  ].join(', ')}
                </Typography>
              </Box>
            </Box>
            
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <CustomRemoveProductButton onClick={() => { removeproductcartquantity(product.productId) }}>
                    <RemoveIcon sx={{ fontWeight : "2px" }}/>
                </CustomRemoveProductButton>
                <CustomAddProductButton onClick={() => { addproductcartquantity(product.productId) }} >
                    <AddIcon />
                </CustomAddProductButton>
            </Box>
          </>
            ))}
            
            {cart?.productCarts?.length > 0 ? 
            <Divider sx={{ mt : 2, mb : 2}} /> : "" }
            {cart.drinkCarts?.map((drink, index) => (
              <>
              <Box
              sx={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                marginBottom: 2,
                marginTop: 2
              }}
              key={drink.id || index}
            >
              <Typography sx={{ fontWeight: "bold", alignSelf: 'flex-start'}} >X{drink.quantity}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Box
                sx={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between'
                }}>
                  <Typography sx={{ fontWeight: "bold" }}>{drink.name}</Typography>
                  <Typography sx={{ fontWeight: "bold" }} >{drink.price} TND
              </Typography>
                </Box>
              </Box>
            </Box>
          </>
            ))}
              <CommanderButton sx={{mt: 3}} onClick={() => {setOpenDrinksPageOverlay(true)}}>
                Order
              </CommanderButton>
            </Paper>
          : ''}
        </Box>
      </Box>
    </Box>
    </>
    )
}

export default ListingPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_HOST from './config';
import { Container, Box, Paper, Typography, Button, Card, CardMedia, CardContent, Modal, Stack } from '@mui/material';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { styled } from '@mui/system';
import ProductImageSlider from "./ProductImageSlider";



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

const CustomAddIcon = styled(AddIcon) ({
    backgroundColor: '#e9f8f5', // Couleur verte
    color: '#00a082',
    borderRadius: '30px',
    padding: '2px',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#b6d4ce',
    },
})

const CustomDoneIcon = styled(DoneIcon) ({
    backgroundColor: '#00a082', // Couleur verte
    color: 'white',
    borderRadius: '30px',
    padding: '2px',
    fontWeight: 'bold',
    textTransform: 'none'
})

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

function ProductDetails({ openOverlay, setOpenOverlay, product, cart, fetchcart}) {
  
    const [qte, setQte] = useState(1)
    const [ingredientIds, setIngredientIds] = useState([])
    const [supplementIds, setSupplementIds] = useState([])
    
    function productExistsInCart(productId) {
        return cart.productCarts?.some(productCart => productCart.productId === productId);
    }

    const AddProduct = async() => {
        try
        {
            let productPayload = {
                productId: product.id,
                quantity: qte,
                ingredientIds: ingredientIds,
                supplementIds: supplementIds,
            };
            const res = await axios.post(
            `${API_HOST}/api/ProductCart/AddProductCart`,
            productPayload,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
            )
            setOpenOverlay(false)
            fetchcart()
        }
        catch(e)
        {
          console.error(e)
        }
    }

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
                }}
            >
                <CustomCloseIcon onClick={() => setOpenOverlay(false)} sx={{ position: 'absolute', top: 20, right: 20 }}/>
                {product?.supplements?.length == 0 && product?.ingredients?.length == 0  ? ""
                :
                    <Box sx={{ width: "500px" }}>
                    <div style={{ padding: 16 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }} >
                            Ingredients
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: "grey", marginBottom: "20px"}}>
                            Choose your ingredients
                        </Typography>
                        {product.ingredients?.map(ingredient => (
                            ingredientIds.includes(ingredient.id) ? (
                                <CustomElementSelected key={ingredient.id} onClick={() => {setIngredientIds(ingredientIds.filter(id => id !== ingredient.id));}}>
                                    <Typography sx={{ fontWeight: "bold" }} >{ingredient.name}</Typography>
                                    <CustomDoneIcon />
                                </CustomElementSelected>
                            ) : (
                                <CustomElement key={ingredient.id} onClick={() => {
                                    if (!ingredientIds.includes(ingredient.id)) {
                                    setIngredientIds([...ingredientIds, ingredient.id]);
                                    }
                                }}>
                                    <Typography sx={{ fontWeight: "bold" }}>{ingredient.name}</Typography>
                                    <CustomAddIcon />
                                </CustomElement>
                            )
                        ))}
                        <Typography variant="h6" sx={{ fontWeight: "bold" }} >
                            Supplements
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: "grey", marginBottom: "20px"}}>
                            Choose your supplements
                        </Typography>
                        {product.supplements?.map(supplement => (
                            supplementIds.includes(supplement.id) ? (
                                <CustomElementSelected key={supplement.id} onClick={() => {setSupplementIds(supplementIds.filter(id => id !== supplement.id));}}>
                                    <Typography sx={{ fontWeight: "bold" }} >
                                        {supplement.name} <span style={{ color : "#00a082 "}}>+{supplement.price} TND</span>
                                    </Typography>
                                    <CustomDoneIcon />
                                </CustomElementSelected>
                            ) : (
                                <CustomElement key={supplement.id} onClick={() => {
                                    if (!supplementIds.includes(supplement.id)) {
                                    setSupplementIds([...supplementIds, supplement.id]);
                                    }
                                }}>
                                    <Typography sx={{ fontWeight: "bold" }}>
                                        {supplement.name} <span>+{supplement.price} TND</span>
                                    </Typography>
                                    <CustomAddIcon />
                                </CustomElement>
                            )
                        ))}
                    </div>
                    </Box>
                }
                
                <Box sx={{ width: "400px" }}>
                    <ProductImageSlider images={product.images} />
                    {product.discountRate?
                    <Typography sx={{ mb: 2,  mt: 2}}>
                        <CustomDiscountContainer>-{product.discountRate}%</CustomDiscountContainer> <br />
                    </Typography>
                    : ""}

                    <Typography id="modal-title" variant="h6" sx={{ fontWeight: "bold" }}>
                        {product.name}
                    </Typography>

                    <Typography sx={{ fontWeight: "bold" }}>
                        {product.price} TND
                    </Typography>
                        
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2}}>
                        <CustomRemoveProductButton onClick={() => setQte(qte => qte - 1)} disabled={qte === 1}>
                            <RemoveIcon/>
                        </CustomRemoveProductButton>
                        <Typography sx={{ mx: 2 }}>{qte}</Typography>
                        <CustomAddProductButton onClick={() => setQte(qte => qte + 1)} >
                            <AddIcon />
                        </CustomAddProductButton>
                    </Box>
                    
                    <AddToCartButton 
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={() => AddProduct()}
                        disabled = {productExistsInCart(product.id) ? true : false}
                    >
                        Add {qte} {product.name}
                    </AddToCartButton>
                </Box>
            </Box>
        </Modal>
    );
}

export default ProductDetails;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_HOST from '../config';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F7F9FB",
    color: "#85878D",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function ListProducts() {

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  const fetchsproducts = async() => {
    try
    {
      const res = await axios.get(
        `${API_HOST}/api/Product/GetAllProducts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setProducts(res.data)
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

  useEffect(() => {
    fetchcategories();
    fetchsproducts();
  }, []);
  
  const handleDelete = async(id)=>{
    if(window.confirm("Sure ?")){
      await axios.delete(
        `${API_HOST}/api/Product/DeleteProduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(res=>{
        setProducts(products.filter(p=>p.id!==id))
      })
    }
  }

  return (
    <>
        <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
        >
            <Typography variant="h4">
                Products
            </Typography>

            <Link to="add-product">
            <Button variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} color="default" style={{ backgroundColor: '#2458E9', color: 'white' }}>
                Add Product
            </Button>
            </Link>
        </Box>

        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Images</StyledTableCell>
              <StyledTableCell >Name</StyledTableCell>
              <StyledTableCell >Description</StyledTableCell>
              <StyledTableCell >Price</StyledTableCell>
              <StyledTableCell >Discount Rate</StyledTableCell>
              <StyledTableCell >Prep Time</StyledTableCell>
              <StyledTableCell >Category</StyledTableCell>
              <StyledTableCell >Ingredients</StyledTableCell>
              <StyledTableCell >Supplements</StyledTableCell>
              <StyledTableCell >Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row) => (
              <StyledTableRow key={row.id}>
                {/* Images */}
                <StyledTableCell component="th" scope="row">
                  {row.images?.map((image) => (
                      <img 
                      key={image.id} 
                      src={`http://localhost:5015/${image.imagePath}`} 
                      alt={row.name} 
                      style={{ maxWidth: '50px', maxHeight: '50px' }} 
                    />
                  ))}
                </StyledTableCell>

                {/* Name */}
                <StyledTableCell >{row.name}</StyledTableCell>

                {/* Description */}
                <StyledTableCell >{row.description}</StyledTableCell>

                {/* Price */}
                <StyledTableCell >{row.price} TND</StyledTableCell>

                {/* Discount Rate */}
                <StyledTableCell >{row.discountRate}%</StyledTableCell>

                {/* Preparation Time */}
                <StyledTableCell >{row.prepTime} min</StyledTableCell>

                {/* Category */}
                <StyledTableCell >{categories.find(category => category.id === row.categoryId)?.name || "Category Not Found" }</StyledTableCell>

                {/* Ingredients */}
                <StyledTableCell >
                  {row.ingredients?.map((ingredient) => ingredient.name).join(', ')}
                </StyledTableCell>

                {/* Supplements */}
                <StyledTableCell >
                  {row.supplements?.map((supplement) => `${supplement.name} (${supplement.price}TND)`).join(', ')}
                </StyledTableCell>

              {/* Actions */}
              <StyledTableCell >
                <Link to={`edit-product/${row.id}/`}>
                  <ArrowOutwardIcon 
                    style={{ cursor: 'pointer', fontSize: '32px', color: 'grey' }} 
                  />
                </Link>
                <DeleteForeverTwoToneIcon 
                  onClick={() => handleDelete(row.id)} 
                  style={{ cursor: 'pointer', fontSize: '32px', color: 'red' }} 
                />
              </StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        </>
  );
}


export default ListProducts;
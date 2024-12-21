import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_HOST from '../config';
import { format } from 'date-fns';
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

function ListProductsOfTheDay() {
  const [products, setProducts] = useState([])
  const [productsoftheday, setProductsoftheday] = useState([])

  const fetchproductsoftheday = async() => {
    try
    {
      const res = await axios.get(
        `${API_HOST}/api/ProductOfTheDay/GetAllProductOfTheDays`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setProductsoftheday(res.data)
    }
    catch(e)
    {
      console.error(e)
    }
  }


  const fetchproducts = async() => {
    try
    {
      const res = await axios.get(
        `${API_HOST}/api/Product/GetAllProducts`
      )
      setProducts(res.data)
    }
    catch(e)
    {
      console.error(e)
    }
  }

  const handleDelete = async(id)=>{
    if(window.confirm("Sure ?")){
      await axios.delete(
        `${API_HOST}/api/ProductOfTheDay/DeleteProductOfTheDay/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(res=>{
        setProductsoftheday(productsoftheday.filter(p=>p.id!==id))
      })
    }
  }

  useEffect(() => {
    fetchproducts();
    fetchproductsoftheday();
  }, []);

  return (
    <>
        <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
        >
            <Typography variant="h4">
                Products Of The Day
            </Typography>

            <Link to="add-productoftheday">
            <Button variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} color="default" style={{ backgroundColor: '#2458E9', color: 'white' }}>
                Add Product Of The Day
            </Button>
            </Link>
        </Box>

        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>Product</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsoftheday.slice().reverse().map((row) => (
              <StyledTableRow key={row.id}>

                {/* Id */}
                <StyledTableCell>{row.id}</StyledTableCell>

                {/* Product */}
                <StyledTableCell>
                  {products.find((p) => p.id === row.productId)?.name || "N/A"} {/* Safe navigation */}
                </StyledTableCell>

                {/* Date */}
                <StyledTableCell>
                  {format(new Date(row.date), 'eeee, d MMMM yyyy hh:mm')}
                </StyledTableCell>

                {/* Actions */}
                <StyledTableCell>
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


export default ListProductsOfTheDay;
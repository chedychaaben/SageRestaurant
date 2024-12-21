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


function ListDrinks() {
  const [drinks, setDrinks] = useState([])

  const fetchDrinks = async() => {
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
    fetchDrinks();
  }, []);
  
  const handleDelete = async(id)=>{
    if(window.confirm("Sure ?")){
      await axios.delete(
        `${API_HOST}/api/Drink/DeleteDrink/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(res=>{
        setDrinks(drinks.filter(d=>d.id!==id))
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
                Drinks
            </Typography>

            <Link to="add-drink">
            <Button variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} color="default" style={{ backgroundColor: '#2458E9', color: 'white' }}>
                Add Drink
            </Button>
            </Link>
        </Box>

        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell >Name</StyledTableCell>
              <StyledTableCell >Price</StyledTableCell>
              <StyledTableCell >Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drinks.map((row) => (
              <StyledTableRow key={row.id}>
                {/* Image */}
                <StyledTableCell>
                  <img 
                    src={`http://localhost:5015/${row.imagePath}`} 
                    alt={row.name} 
                    style={{ maxWidth: '50px', maxHeight: '50px' }} 
                  />
                </StyledTableCell>

                {/* Name */}
                <StyledTableCell >{row.name}</StyledTableCell>

                {/* Price */}
                <StyledTableCell >{row.price} DT</StyledTableCell>

              {/* Actions */}
              <StyledTableCell >
                <Link to={`edit-drink/${row.id}/`}>
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


export default ListDrinks;
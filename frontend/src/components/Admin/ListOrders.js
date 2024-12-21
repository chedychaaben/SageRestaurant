import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_HOST from '../config';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { format } from 'date-fns';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';



const DeliverButton = styled(Button)({
  backgroundColor: '#FFC244', // Couleur verte
  color: 'black', // Texte blanc
  borderRadius: '30px', // Border radius pour un bouton plus arrondi
  fontSize: '10px',
  textTransform: 'none', // Pour garder le texte en majuscules exactes
});

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

function ListOrders() {

  const [orders, setOrders] = useState([])

  const fetchorders = async() => {
    try
    {
      const res = await axios.get(
        `${API_HOST}/api/Order/GetAllOrders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setOrders(res.data)
    }
    catch(e)
    {
      console.error(e)
    }
  }

  const handleDelete = async(id)=>{
    if(window.confirm("Sure ?")){
      await axios.delete(
        `${API_HOST}/api/Order/DeleteOrder/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(res=>{
        setOrders(orders.filter(o=>o.id!==id))
      })
    }
  }
  
  const handleDeliver = async (id) => {
    const confirm = window.confirm("Have you delivered this order to the client?");
    if (confirm) {
      try {
        const response = await axios.put(
          `${API_HOST}/api/Order/Deliver/${id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
  
        setOrders((prevOrders) => 
          (prevOrders || []).map(order =>
            order.id === id ? { ...order, delivered: true } : order
          )
        );
      } catch (error) {
        console.error("Error marking the order as delivered:", error);
      }
    }
  };
  
  useEffect(() => {
    fetchorders();
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
              Orders
          </Typography>
        </Box>

        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Message</StyledTableCell>
              <StyledTableCell>Total</StyledTableCell>
              <StyledTableCell>Delivered Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...orders].reverse().map((order) => (
              <StyledTableRow key={order.id}>

              
                {/* userId */}
                <StyledTableCell>{format(new Date(order.date), 'EEEE, MMMM d, yyyy hh:mm a')}</StyledTableCell>

                {/* Message */}
                <StyledTableCell>{order.message}</StyledTableCell>

                {/* Total */}
                <StyledTableCell>{order.total?.toFixed(2)} TND</StyledTableCell>

                {/* Delivered */}
                <StyledTableCell>
                  <Box>
                    {order.delivered ? <Chip label="Delivered" color="success" size="small" /> : <DeliverButton onClick={() => {handleDeliver(order.id)}}>Deliver</DeliverButton>}
                  </Box>
                </StyledTableCell>

                {/* Actions */}

                <StyledTableCell>
                  <Link to={`view-order/${order.id}/`} >
                    <ArrowOutwardIcon 
                      style={{ cursor: 'pointer', fontSize: '32px', color: 'grey'}} 
                    />
                  </Link>
                  <DeleteForeverTwoToneIcon 
                    onClick={() => handleDelete(order.id)} 
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


export default ListOrders;
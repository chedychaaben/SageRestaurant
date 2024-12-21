import React, { useState, useEffect} from 'react';
import axios from 'axios';
import API_HOST from './config';
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Container, Box, Paper, Typography, Button, Card, CardMedia, CardContent, Modal, Divider, Chip } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const ViewDetailsButton = styled(Button)({
  backgroundColor: '#FFF3DA', // Couleur verte
  color: 'black', // Texte blanc
  borderRadius: '30px', // Border radius pour un bouton plus arrondi
  mb: 3,
  width: '170px',
  fontSize: '1.0rem',
  fontWeight: 'bold',
  padding: '10px 20px', // Espacement interne
  textTransform: 'none', // Pour garder le texte en majuscules exactes
  '&:hover': {
      backgroundColor: '#FFC244', // Change la couleur lors du survol
  },
});

function OrderHistoryList() {
    const [orders, setOrders] = useState([])


    const fetchorders = async() => {
        try
        {
          const res = await axios.get(
            `${API_HOST}/api/Order/GetUserOrders`,
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

    useEffect(() => {
        fetchorders();
    }, []);

  return (
    <Container
    maxWidth={false}
  sx={{
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    pt: 10
  }}
>
  <Typography variant="h4" component="h2" gutterBottom>
    Order History
  </Typography>
  <TableContainer
    component={Paper}
    sx={{
      marginTop: "20px",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    }}
  >
    <Table
      sx={{
        minWidth: 750,
        '& thead th': {
          backgroundColor: "#f1f1f1", // Light gray for the header background
          color: "#000000", // Black text for contrast
          fontWeight: "bold",
        },
        '& tbody tr:nth-of-type(odd)': {
          backgroundColor: "#ffffff", // White for odd rows
        },
        '& tbody tr:nth-of-type(even)': {
          backgroundColor: "#ffffff", // White for odd rows
        },
        '& tbody tr:hover': {
          backgroundColor: "#FFF3DA", // Light blue for hover effect
        },
        '& td, & th': {
          padding: "12px 16px",
        },
      }}
      aria-label="order history table"
      >
      <TableHead>
        <TableRow>
          <StyledTableCell>Order ID</StyledTableCell>
          <StyledTableCell>Date</StyledTableCell>
          <StyledTableCell>Products</StyledTableCell>
          <StyledTableCell>Total Amount</StyledTableCell>
          <StyledTableCell >Delivered</StyledTableCell>
          <StyledTableCell >Actions</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...orders].reverse().map((order) => (
          <StyledTableRow key={order.id}>
            <StyledTableCell>{order.id}</StyledTableCell>
            <StyledTableCell >
              {format(new Date(order.date), 'EEEE, MMMM d, yyyy hh:mm a')}
            </StyledTableCell>
            <StyledTableCell >
              <Box
                sx={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  marginBottom: 2,
                  marginTop: 2
                }}
              >
                {order.cart.productCarts?.map((productcart) => (
                  <Box key={productcart.id} sx={{ marginBottom: 2 }}>
                    <Typography sx={{ fontWeight: "bold", alignSelf: 'flex-start' }}>
                      X{productcart.quantity}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      <Box
                        sx={{
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography>{productcart.name}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: "10px" }}>
                        {[
                          ...productcart.productCartIngredients?.map(i => i.name),
                          ...productcart.productCartSupplements?.map(s => s.name)
                        ].join(', ')}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {order.cart.drinkCarts?.map((drinkcart) => (
                  <Box key={drinkcart.id} sx={{ marginBottom: 2 }}>
                    <Typography sx={{ fontWeight: "bold", alignSelf: 'flex-start' }}>
                      X{drinkcart.quantity}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      <Box
                        sx={{
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography>{drinkcart.name}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </StyledTableCell>
            <StyledTableCell  sx={{ fontWeight: "bold" }}>
              {order.total.toFixed(2)} TND
            </StyledTableCell>
            <StyledTableCell align="center">
              <Chip
                label={order.delivered ? "Delivered" : "Pending"}
                color={order.delivered ? "success" : "warning"}
                size="small"
              />
            </StyledTableCell>
            <StyledTableCell align="center">
              <Link to={`/order-history/${order.id}`} style={{ textDecoration: "none" }}>
                <ViewDetailsButton>
                  View Details
                </ViewDetailsButton>
              </Link>
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Container>

  );
}


export default OrderHistoryList;
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

function ListUsers() {

  const [users, setUsers] = useState([])

  const fetchusers = async() => {
    try
    {
      const res = await axios.get(
        `${API_HOST}/api/Account/GetUsers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setUsers(res.data)
      console.log(res.data)
    }
    catch(e)
    {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchusers();
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
              Users
          </Typography>
        </Box>

        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Full Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Id</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.fullName}</StyledTableCell>
                <StyledTableCell>{row.email}</StyledTableCell>
                <StyledTableCell>{row.id}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        </>
  );
}


export default ListUsers;
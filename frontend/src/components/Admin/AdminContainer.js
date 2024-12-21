import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { Link } from "react-router-dom";

import {  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Divider, Drawer } from '@mui/material';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LogoutIcon from '@mui/icons-material/Logout';

import { makeStyles } from '@mui/styles';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import FoodBankOutlinedIcon from '@mui/icons-material/FoodBankOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import LiquorIcon from '@mui/icons-material/Liquor';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';

const useStyles = makeStyles({
  background: {
    background: 'linear-gradient(340deg,#1B358A 0%,#19A7A3 100%)',
  },
});


const NavWidth = 260;

const left_bar_links = [
  { to: "/admin/orders", label: "Orders", Icon: <LocalMallOutlinedIcon/> },
  { to: "/admin/categories", label: "Categories", Icon: <FoodBankOutlinedIcon/> },
  { to: "/admin/products", label: "Products", Icon: <LunchDiningOutlinedIcon/> },
  { to: "/admin/drinks", label: "Drinks", Icon: <LiquorIcon/> },
  { to: "/admin/users", label: "Users", Icon: <AccountCircleOutlinedIcon/> },
  { to: "/admin/productsoftheday", label: "Products Of The Day", Icon: <StarPurple500Icon/> },
];

function AdminContainer({ InnerComponent }) {
  const classes = useStyles();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Box className={classes.background}>
        <AppBar position="static" sx={{ backgroundColor: "transparent", position: "static" , boxShadow: "none" }}>
          <Container maxWidth="xl">
              <Toolbar disableGutters>
              <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                  }}
              >
                  ADMIN INTERFACE
              </Typography>

              <SupervisedUserCircleIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'white',
                  textDecoration: 'none',
                  }}
              >
                  LOGO
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar/>
                  </IconButton>
                  </Tooltip>
                  <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  >
                  <Link to="/admin/logout">
                    <MenuItem onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                    </MenuItem>
                  </Link>
                  </Menu>
              </Box>
              </Toolbar>
          </Container>
          </AppBar>
        
        
          <Box
            component="section"
            sx={{
              display: 'flex',
              justifyContent: 'flex-start', // Align children to the left horizontally
              alignItems: 'center',       // Center vertically if needed
              height: '200px',            // Adjust height as required
              margin: '0 100px',            // Add some padding
            }}
          >
            <Typography
              variant="h1" // You can also use h2, h3 or custom font size
              sx={{
                fontSize: '3rem',         // Adjust for custom size
                fontWeight: 'bold',       // Optional: bold text
                textAlign: 'left',        // Ensure text is left-aligned
                color: 'white',
              }}
            >
              Welcome
            </Typography>
          </Box>

          <Box sx={{
            background: "white", // Semi-transparent white background for content area
            borderRadius: 4, // Rounded corners for content area
            margin: "0px 50px",
            height: "200vh",
            backgroundBlendMode: "overlay", // Blend the semi-transparent white and gradient
          }}
          >
            
          <Box sx={{ display: "flex" }}>
              <Box
                  sx={{
                    width: NavWidth,
                    backgroundColor: "white", // Dark blue background for the drawer
                    Color: "black", // Dark blue background for the drawer
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    maxHeight: "200vh",
                    borderTopLeftRadius: 4, // Rounded top left corner
                    borderBottomLeftRadius: 4, // Rounded bottom left corner
                    borderRight: "1px solid #E6E6E6"
                  }}
                >
                  <List>
                    {left_bar_links.map((link) => (
                      <Link to={link.to} key={link.label} className="no-underline">
                        <ListItem button>
                          <ListItemIcon>
                            {link.Icon}
                          </ListItemIcon>
                          <ListItemText primary={link.label} />
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                  <Box sx={{ paddingBottom: 2 }}></Box> {/* Added space at the bottom for balance */}
                </Box>
                <div style={{width:"100%", padding: "0px 30px",}}>
                  <InnerComponent/>
                </div>
            </Box></Box>

    </Box>
  </>
  );
}
export default AdminContainer;
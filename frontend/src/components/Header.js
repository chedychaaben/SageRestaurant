import React, { useState } from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';
import SageLogo from "../assets/img/SageLogo.png"
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, Popover, Modal } from '@mui/material';
import { styled } from '@mui/system';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Icon from '@mui/material/Icon';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalMallOutlineIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Link } from "react-router-dom";
import LoginRegister from "../components/LoginRegister"
import ProductDetails from "../components/ProductDetails"
import { jwtDecode } from 'jwt-decode';


const CustomListButton = styled(Button)({
    backgroundColor: 'white',  // Set background color to white
    color: 'black',            // Set text color to black
    boxShadow: 'none',         // Remove box shadow
    border: 'none',            // Remove border
    width: '100%',             // Set the width to 100% of the parent container
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures arrow stays on the right
    textTransform: 'none',
    borderRadius: '30px', // Border radius pour un bouton plus arrondi
    '&:hover': {
      backgroundColor: '#F5F5F5',  // Light gray background on hover
      color: 'black',              // Keep text color black on hover
      boxShadow: 'none',           // Ensure no box shadow on hover
    },
  });

const ConnexionButton = styled(Button)({
    backgroundColor: '#00a082', // Couleur verte
    color: 'white', // Texte blanc
    borderRadius: '30px', // Border radius pour un bouton plus arrondi
    fontWeight: 'bold',
    padding: '10px 20px', // Espacement interne
    textTransform: 'none', // Pour garder le texte en majuscules exactes
    '&:hover': {
        backgroundColor: '#00846b', // Change la couleur lors du survol
    },
});


const LoggedInButton = styled(Button)({
    backgroundColor: '#f5f5f5',
    color: 'black', // Texte blanc
    borderRadius: '30px', // Border radius pour un bouton plus arrondi
    fontWeight: 'bold',
    padding: '10px 20px', // Espacement interne
    textTransform: 'none', // Pour garder le texte en majuscules exactes
    '&:hover': {
    backgroundColor: '#e4e4e4', // Change la couleur lors du survol
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures arrow stays on the right
    '& .arrow': {
      marginTop: '10px',
      transition: 'transform 0.3s ease', // Smooth flipping animation
    },
    '&.clicked .arrow': {
        transform: 'scaleY(-1)', // Flips the arrow horizontally
    },
});
const Overlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#00000099', // Adds a semi-transparent overlay
    zIndex: 1, // Ensures the overlay is below the button
  });


function Header() {
    const loggedIn = localStorage.getItem('token');
    const [loginBtnClicked, setLoginBtnClicked] = useState(false);
    const [connectBtnClicked, setConnectBtnClicked] = useState(false);

    const handleClickLoginBtn = (e) => {
        setLoginBtnClicked((prevState) => !prevState)
        setLoginBtnClicked(e.currentTarget)
    };

    const handleClickConnectBtn = (e) => {
        setConnectBtnClicked((prevState) => !prevState)
        setConnectBtnClicked(e.currentTarget)
    };

    let useremail = "Impossible to fetch"
    const token = localStorage.getItem('token');
    try {
        const decoded = jwtDecode(token);
        useremail = decoded.email;
    } catch (error) {
        console.error('Invalid token', error);
    }

    return (
        <>
            {loginBtnClicked && <Overlay onClick={() => setLoginBtnClicked(false)} />}
            <AppBar position="relative" sx={{ '--AppBar-background': '#FFC244' }} elevation={0}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'transparent !important' }}>
                    <Link to="/">
                        <div className="logo">
                            <img src={SageLogo} alt="Logo" style={{ height: '40px' }} />
                        </div>
                    </Link>
                    { loggedIn ? 
                    (
                    <div className="login">
                        <LoggedInButton
                            variant="contained"
                            startIcon={<PersonOutlineOutlinedIcon />} // Icône de l'utilisateur
                            className={loginBtnClicked ? 'clicked' : ''}
                            onClick={(e) => handleClickLoginBtn(e)}
                            sx = {{ zIndex: 1 }}
                        >
                            {useremail}
                        <span className="arrow"><KeyboardArrowDownIcon/></span>
                        </LoggedInButton>
                        <Popover
                            sx={{
                                backgroundColor: 'transparent',  // Remove or customize background color
                                boxShadow: 'none',               // Optional: remove the shadow if needed
                                borderRadius: '30px',            // Apply rounded corners to the Popover itself
                                '& .MuiPaper-root': {            // Target the internal Paper component
                                  backgroundColor: 'transparent',  // Remove the background color of Paper
                                  borderRadius: '30px',            // Apply rounded corners to Paper
                                  boxShadow: 'none',               // Optional: remove shadow from Paper
                                },
                              }}
                        open = {Boolean(loginBtnClicked)}
                        anchorEl={loginBtnClicked}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        onClose={ () => setLoginBtnClicked(false) }
                        >
                            <List
                                sx={{
                                    width: '100%',
                                    maxWidth: 360,
                                    bgcolor: 'white',
                                    borderRadius: '30px', // Border radius pour un bouton plus arrondi
                                }}
                                component="nav"
                                onClick={ () => setLoginBtnClicked(false) }
                                >
                                
                            <Link to="/order-history" >
                                <ListItem>
                                    <CustomListButton variant="contained" >
                                            <div>
                                                <LocalMallOutlineIcon />
                                                Commandes
                                            </div>
                                        <ArrowForwardIosOutlinedIcon />
                                    </CustomListButton>
                                </ListItem>
                            </Link>

                            <Link to="/profil" >
                                <ListItem>
                                    <CustomListButton variant="contained" >
                                        <div>
                                            <PersonOutlineIcon />
                                            Compte
                                        </div>
                                        <ArrowForwardIcon />
                                    </CustomListButton>
                                </ListItem>
                            </Link>
                            { /*
                            <ListItem>
                                <CustomListButton variant="contained" >
                                    <div>
                                        <LocalOfferOutlinedIcon />
                                        Code promo
                                    </div>
                                    <ArrowForwardIcon />
                                </CustomListButton>
                            </ListItem>
                            <ListItem>
                                <CustomListButton variant="contained" >
                                    <div>
                                        <TranslateOutlinedIcon />
                                        Langue
                                    </div>
                                    <ArrowForwardIosOutlinedIcon />
                                </CustomListButton>
                            </ListItem>
                            <ListItem>
                                <CustomListButton variant="contained" >
                                    <div>
                                        <HelpOutlineOutlinedIcon />
                                        FAQ
                                    </div>
                                    <ArrowForwardIosOutlinedIcon />
                                </CustomListButton>
                            </ListItem>
                            */}
                            <ListItem>
                                <Link to="/logout">
                                    <CustomListButton variant="contained" >
                                        <div>
                                            <LogoutOutlinedIcon />
                                            Confirmer la déconnexion
                                        </div>
                                        <ArrowForwardIosOutlinedIcon />
                                    </CustomListButton>
                                </Link>
                            </ListItem>      
                            </List>
                        </Popover>

                    </div>
                    ) : (
                    <>
                        {connectBtnClicked && 
                            <Modal
                                open={Boolean(connectBtnClicked)}
                                onClose={() => setConnectBtnClicked(false)}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100vh',
                                    margin: 0, // Remove any default margins or padding
                                }}
                            >
                                <LoginRegister/>
                            </Modal>
                        }
                        <div className="login">
                            <ConnexionButton
                                variant="contained"
                                startIcon={<PersonOutlineOutlinedIcon />}
                                onClick={(e) => handleClickConnectBtn(e)}
                            >
                                Connexion
                            </ConnexionButton>
                        </div>
                    </>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
}

export default Header;

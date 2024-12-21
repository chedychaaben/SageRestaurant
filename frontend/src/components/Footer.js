import React from 'react';
import { Container, Box, Typography, Link, Button, Divider } from '@mui/material';
import SageLogoWhite from "../assets/img/SageLogoWhite.png"
import AppStore from "../assets/svg/AppStore.svg"
import GooglePlay from "../assets/svg/GooglePlay.svg"

const categories = [
  "Pizza",
  "Sushi",
  "Fleurs",
  "Sandwichs",
  "Petit-déjeuner",
  "Libanais",
  "Fruits et légumes",
];


// Define styles as reusable objects
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    padding: 2,
  },
  section: {
    flex: { xs: '1 1 100%', sm: '1 1 48%', md: '1 1 23%' },
  },
  title: {
    fontWeight: 'bold',
    textAlign : "center"
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    mb: 1,
    textAlign : "center"
  },
};

// Footer data
const footerData = [
  {
    title: 'Opportunités',
    links: [
      { label: 'Emploi', href: '#' },
      { label: 'Sage pour les partenaires', href: '#' },
      { label: 'Coursiers', href: '#' },
      { label: 'Sage Business', href: '#' },
    ],
  },
  {
    title: 'Liens utiles',
    links: [
      { label: 'À propos', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Sage Prime', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Nous contacter', href: '#' },
    ],
  },
];

const FooterSection = ({ title, links }) => (
  <Box sx={styles.section}>
    <Typography variant="h5" gutterBottom sx={styles.title}>
      {title}
    </Typography>
    <Box>
      {links.map((link, index) => (
        <Link key={index} href={link.href} variant="body2" sx={styles.link}>
          {link.label}
        </Link>
      ))}
    </Box>
  </Box>
);

const Footer = () => {
  return (
    <>
    <Box sx={{ backgroundColor: '#1D1D1D', py: 4, color: "white", marginTop : "150px" }}>
      <Container>
      <div className="logo">
          <img src={SageLogoWhite} alt="Logo" style={{ height: '40px' }} />
      </div>
      <br/><br/>
    <Box sx={styles.container}>
      {footerData.map((section, index) => (
        <FooterSection key={index} title={section.title} links={section.links} />
      ))}
      <Box>
        <img src={AppStore} alt="AppStore" style={{ height: '40px' }} />
        <br/>
        <img src={GooglePlay} alt="GooglePlay" style={{ height: '40px' }} />
      </Box>
    </Box>
      </Container>
      <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
      <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Sage. Tous droits réservés.
        </Typography>
    </Box>
    </>
  );
};
export default Footer;

import React from "react";
import { Container, Typography, Box, Button, Divider } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const OrderPlaced = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Box>
        <CheckCircleOutlineIcon 
          color="success" 
          style={{ fontSize: 80, marginBottom: "20px" }} 
        />
        <Typography variant="h4" gutterBottom>
          Thank You for Your Order!
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Your order has been placed successfully.
        </Typography>
        <Divider style={{ margin: "20px 0" }} />
        <Button 
          variant="outlined" 
          color="secondary" 
          style={{ margin: "10px" }}
          href="/order-history"
        >
          View Order Details
        </Button>
      </Box>
    </Container>
  );
};

export default OrderPlaced;
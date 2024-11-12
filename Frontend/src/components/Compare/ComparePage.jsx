import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';

const ComparePage = () => {
  const location = useLocation();
  const { baseHouse, similarHouses } = location.state || {};

  if (!baseHouse || !similarHouses || similarHouses.length === 0) {
    return <Typography>No similar properties available for comparison.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Comparison</Typography>
      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Base House</Typography>
              <Typography variant="h5">{baseHouse.title}</Typography>
              <Typography>Price: ₹{baseHouse.price}</Typography>
              <Typography>Location: {baseHouse.location}</Typography>
              <Typography>Size: {baseHouse.size}</Typography>
              <Typography>Amenities: {baseHouse.amenities.join(', ')}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {similarHouses.map((house, index) => (
          <Grid xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">Similar Property</Typography>
                <Typography variant="h5">{house.title}</Typography>
                <Typography>Price: ₹{house.price}</Typography>
                <Typography>Location: {house.location}</Typography>
                <Typography>Size: {house.size}</Typography>
                <Typography>Amenities: {house.amenities.join(', ')}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ComparePage;

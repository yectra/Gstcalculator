import React, { useState } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, IconButton, Typography, TextField, Button, Box, Grid, Card, CardContent, MenuItem, Select, FormControl, InputLabel, Paper
} from '@mui/material';
import { Menu as MenuIcon, AttachMoney } from '@mui/icons-material';

const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('0');
  const [gstRate, setGstRate] = useState<string>("5");  // Default GST% is 5%
  const [taxType, setTaxType] = useState<'Exclusive' | 'Inclusive'>('Exclusive');
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [actualAmount, setActualAmount] = useState<number | null>(null);
  const [gstAmount, setGstAmount] = useState<number | null>(null);
  const [is_inclusive, setIsInclusive] = useState<string>('false');

  const handleCalculate = async () => {
    if (parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (taxType === 'Inclusive') {
      setIsInclusive('true');
    } else {
      setIsInclusive('false');
    }

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("gst_percentage", gstRate);
    formData.append("is_inclusive", is_inclusive);

    try {
      const response = await axios.post('https://gst-calculator.azure-api.net/gst-calculator/api/calculate_gst', formData);
      setTotalAmount(response.data.total_amount);
      setActualAmount(response.data.actual_amount);
      setGstAmount(response.data.gst_amount);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('There was an error calculating GST. Please try again later.');
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GST Calculator
          </Typography>
        </Toolbar>
      </AppBar>

      <Box p={4} bgcolor="#f5f5f5" minHeight="100vh">
        <Box maxWidth={800} mx="auto" mb={4} p={3} borderRadius={3} bgcolor="white" boxShadow={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  startAdornment: <AttachMoney color="action" />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>GST %</InputLabel>
                <Select
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value as string)}
                  label="GST %"
                >
                  <MenuItem value={5}>5%</MenuItem>
                  <MenuItem value={12}>12%</MenuItem>
                  <MenuItem value={18}>18%</MenuItem>
                  <MenuItem value={28}>28%</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tax Type</InputLabel>
                <Select
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value as 'Exclusive' | 'Inclusive')}
                  label="Tax Type"
                >
                  <MenuItem value="Exclusive">Exclusive</MenuItem>
                  <MenuItem value="Inclusive">Inclusive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box textAlign="center">
                <Button variant="contained" color="primary" onClick={handleCalculate}>
                  Calculate GST
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {totalAmount !== null && (
          <Box maxWidth={800} mx="auto" mb={4}>
            <Card >
              <CardContent sx={{display:"flex",justifyContent:"space-around"}}>

              <Typography variant="subtitle1" color="textSecondary">
                  Actual Amount (Before GST):
                </Typography>
                <Typography variant="h6" color="primary">₹{actualAmount?.toFixed(2)}</Typography>
               
                <Typography variant="subtitle1" color="textSecondary">
                  GST Amount:
                </Typography>
                <Typography variant="h6" color="primary">₹{gstAmount?.toFixed(2)}</Typography>

                <Typography variant="subtitle1" color="textSecondary">
                  Total Amount:
                </Typography>
                <Typography variant="h6" color="primary">₹{totalAmount.toFixed(2)}</Typography>

              </CardContent>
            </Card>
          </Box>
        )}

        <Box maxWidth={800} mx="auto" mt={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Understanding GST
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              GST, or Goods and Services Tax, is an indirect tax levied on the supply of goods and services in India. 
              It has replaced many indirect taxes that previously existed. GST is divided into three parts:
            </Typography>
            <ul style={{ textAlign: 'left' }}>
              <li>
                <Typography variant="body2" color="textPrimary">
                  <strong>CGST:</strong> Central Goods and Services Tax, levied by the central government.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="textPrimary">
                  <strong>SGST:</strong> State Goods and Services Tax, levied by the state government.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="textPrimary">
                  <strong>IGST:</strong> Integrated Goods and Services Tax, levied on inter-state transactions.
                </Typography>
              </li>
            </ul>
            <Typography variant="body1" color="textSecondary">
              This calculator helps you quickly determine the GST on your products and services based on the amount, GST%, 
              and tax type.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default GSTCalculator;

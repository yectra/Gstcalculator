import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AttachMoney,
  Calculate,
  Info,
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>("0");
  const [gstRate, setGstRate] = useState<string>("5");
  const [taxType, setTaxType] = useState<"Exclusive" | "Inclusive">(
    "Exclusive"
  );
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [actualAmount, setActualAmount] = useState<number | null>(null);
  const [gstAmount, setGstAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCalculate = async () => {
    if (parseFloat(amount) <= 0) {
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const amountNum = parseFloat(amount);
    const gstRateNum = parseFloat(gstRate);
    let calculatedTotal, calculatedActual, calculatedGst;

    if (taxType === "Inclusive") {
      calculatedActual = amountNum / (1 + gstRateNum / 100);
      calculatedGst = amountNum - calculatedActual;
      calculatedTotal = amountNum;
    } else {
      calculatedActual = amountNum;
      calculatedGst = amountNum * (gstRateNum / 100);
      calculatedTotal = amountNum + calculatedGst;
    }

    setTotalAmount(calculatedTotal);
    setActualAmount(calculatedActual);
    setGstAmount(calculatedGst);
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GST Calculator
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
                >
                  Calculate GST
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
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
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Tax Type</InputLabel>
                      <Select
                        value={taxType}
                        onChange={(e) =>
                          setTaxType(
                            e.target.value as "Exclusive" | "Inclusive"
                          )
                        }
                        label="Tax Type"
                      >
                        <MenuItem value="Exclusive">Exclusive</MenuItem>
                        <MenuItem value="Inclusive">Inclusive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={handleCalculate}
                      disabled={loading}
                      startIcon={
                        loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <Calculate />
                        )
                      }
                    >
                      {loading ? "Calculating..." : "Calculate GST"}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
                >
                  Results
                </Typography>
                <Box
                  sx={{
                    height: "300px", // Fixed height
                    overflowY: "auto", // Enable scroll if content exceeds height
                    paddingRight: 2, // Add padding for scroll visibility
                  }}
                >
                  {totalAmount !== null ? (
                    <Box>
                      <ResultCard
                        label="Actual Amount (Before GST)"
                        value={actualAmount}
                      />
                      <ResultCard label="GST Amount" value={gstAmount} />
                      <ResultCard
                        label="Total Amount"
                        value={totalAmount}
                        highlight
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Enter values and click Calculate to see results
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  color="primary"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Info /> Understanding GST
                </Typography>
                <Typography variant="body1" paragraph>
                  GST, or Goods and Services Tax, is a comprehensive indirect
                  tax levied on the supply of goods and services in India. It
                  has replaced multiple indirect taxes, simplifying the taxation
                  system. GST is divided into three main components:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          CGST
                        </Typography>
                        <Typography variant="body2">
                          Central Goods and Services Tax, levied by the central
                          government on intra-state transactions.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          SGST
                        </Typography>
                        <Typography variant="body2">
                          State Goods and Services Tax, levied by the state
                          government on intra-state transactions.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                          IGST
                        </Typography>
                        <Typography variant="body2">
                          Integrated Goods and Services Tax, levied on
                          inter-state transactions and imports.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Please enter a valid amount to calculate GST.
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

interface ResultCardProps {
  label: string;
  value: number | null;
  highlight?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ label, value, highlight }) => {
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        border: `1px solid ${highlight ? "primary.main" : "grey.300"}`,
        borderRadius: 2,
        backgroundColor: highlight ? "primary.light" : "transparent",
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{ fontWeight: highlight ? "bold" : "normal" }}
      >
        ₹{value?.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default GSTCalculator;

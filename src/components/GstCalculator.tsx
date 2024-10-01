import React, { useState, useCallback } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Autocomplete,
  InputAdornment,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Calculate,
  Search,
  Info,
  AccountBalance,
  Business,
  PublicOutlined,
} from "@mui/icons-material";
import debounce from "lodash/debounce";
import axios from "axios";
import { ResultCard } from "./ResultCard";

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

interface SearchResult {
  code: string;
  description: string;
  igst_rate: string;
  compensation_cess: string;
}

export default function GSTCalculator() {
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
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCalculate = async () => {
    if (parseFloat(amount) <= 0) {
      setSnackbarMessage(
        "Please enter a valid amount greater than 0 to calculate GST."
      );
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    const payload = {
      amount,
      gst_percentage: gstRate,
      is_inclusive: false,
    };

    const response = await axios.post(
      "https://gst-calculator.azure-api.net/gst-calculator/gst_calc",
      payload
    );

    const gstResult = response.data;

    setTotalAmount(gstResult.total_amount);
    setActualAmount(gstResult.actual_amount);
    setGstAmount(gstResult.gst_amount);
    setLoading(false);
  };

  const handleSearch = async (query: string) => {

    if(query=='')
    {
      setSearchResults([])
    }
    try {
      const response = await fetch(
        `https://gst-calculator.azure-api.net/gst-calculator/gst_search?search_value=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: SearchResult[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const debouncedHandleSearch = useCallback(
    debounce((query: string) => handleSearch(query), 300),
    []
  );

  const handleGstRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (value === "" || (numValue >= 0 && numValue <= 28)) {
      setGstRate(value);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    if (value === "" || numValue >= 0) {
      setAmount(value);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box m={2}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          color="primary.main"
          component="div"
          sx={{ flexGrow: 1, mb: 1 }}
        >
          GST Calculator
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Search products, calculate GST, and simplify your tax calculations
        </Typography>

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
                    <Autocomplete
                      freeSolo
                      options={searchResults}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.description
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Product"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => {
                            debouncedHandleSearch(e.target.value);
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton>
                                  <Search />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      onChange={(_event, newValue) => {
                        if (newValue && typeof newValue !== "string") {
                          setGstRate(newValue.igst_rate.replace("%", ""));
                        }
                      }}
                      renderOption={(props, option) => (
                        <li {...props}>
                          {option.description} (GST: {option.igst_rate})
                        </li>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Amount"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="GST %"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={gstRate}
                      onChange={handleGstRateChange}
                      inputProps={{
                        min: 0,
                        max: 28,
                        step: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Tax Type"
                      value={taxType}
                      onChange={(e) =>
                        setTaxType(e.target.value as "Exclusive" | "Inclusive")
                      }
                      fullWidth
                      variant="outlined"
                    >
                      <option value="Exclusive">Exclusive</option>
                      <option value="Inclusive">Inclusive</option>
                    </TextField>
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "primary.main", ml: 1 }}
                  >
                    Results
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: "280px",
                    overflowY: "auto",
                    paddingRight: 2,
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
              <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Info sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Understanding GST
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  GST, or Goods and Services Tax, is a comprehensive indirect
                  tax levied on the supply of goods and services in India. It
                  has replaced multiple indirect taxes, simplifying the taxation
                  system. GST is divided into three main components:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <AccountBalance
                            sx={{ color: "primary.main", mr: 1 }}
                          />
                          <Typography variant="h6" color="primary" gutterBottom>
                            CGST
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          Central Goods and Services Tax, levied by the central
                          government on intra-state transactions.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Business sx={{ color: "primary.main", mr: 1 }} />
                          <Typography variant="h6" color="primary" gutterBottom>
                            SGST
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          State Goods and Services Tax, levied by the state
                          government on intra-state transactions.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <PublicOutlined
                            sx={{ color: "primary.main", mr: 1 }}
                          />
                          <Typography variant="h6" color="primary" gutterBottom>
                            IGST
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
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
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

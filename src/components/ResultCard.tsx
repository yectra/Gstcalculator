import { Box, Typography } from "@mui/material"

interface ResultCardProps {
  label: string
  value: number | null
  highlight?: boolean
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, highlight }) => {
  return (
    <Box
      sx={{
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
  )
}
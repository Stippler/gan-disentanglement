import Typography from "@mui/material/Typography";

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © Kathi & Christian "}
      {/* <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "} */}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
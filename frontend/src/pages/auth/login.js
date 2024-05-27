import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getUserInfo, loginUser, registerUser } from "../../services/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://geekmukh.github.com/">
        Visit Me
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignInSide() {
  const location = useLocation();
  const currentRoute = location.pathname;
  const navigate = useNavigate();
  const wallpaperList = [
    "url(https://images.unsplash.com/photo-1508739773434-c26b3d09e071)",
    "url(https://images.unsplash.com/photo-1501696461415-6bd6660c6742)",
    "url(https://images.unsplash.com/photo-1493514789931-586cb221d7a7)",
    "url(https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39)",
    "url(https://images.unsplash.com/photo-1519681393784-d120267933ba)",
    "url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05)",
    "url(https://images.unsplash.com/photo-1502082553048-f009c37129b9)",
  ]
  const getRandomWallpaper = () => {
    const randomIndex = Math.floor(Math.random() * wallpaperList.length);
    return wallpaperList[randomIndex];
};

  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  
  React.useEffect(() => {
    getUserInfo()
      .then((res) => {
        // eslint-disable-next-line
        navigate("/tree");
      })
      .catch((err) => console.info(err));
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpenBackdrop(true);
    const data = new FormData(event.currentTarget);
    if(currentRoute === '/login') {
      loginUser(data.get("email"), data.get("password"))
      .then((res) => {
        setTimeout(() => {
          navigate("/tree");
        }, 1000);
      })
      .catch((err) => {
        alert(err);
        setOpenBackdrop(false);
      })
      .finally(() => setTimeout(() => setOpenBackdrop(false), 2000));
    } else {
      registerUser(data.get("email"), data.get("password"),data.get("confirmPassword"))
      .then((res) => {
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((err) => {
        alert(err.data.message);
        setOpenBackdrop(false);
      })
      .finally(() => setTimeout(() => setOpenBackdrop(false), 2000));
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        <Backdrop
          open={openBackdrop}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress />
        </Backdrop>
      </div>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: getRandomWallpaper(),
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover", 
            backgroundPosition: "center",
            minHeight: "100vh", 
            display: "flex",  
            alignItems: "center", 
            justifyContent: "center",
            textAlign: "center"
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {currentRoute === "/login" ? "Sign in" : "Register"}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {currentRoute !== "/login" && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="confirm-password"
                />
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    onClick={() =>
                      navigate(
                        currentRoute === "/login" ? "/register" : "/login"
                      )
                    }
                    variant="body2"
                    sx={{ cursor: "pointer" }}
                  >
                    {currentRoute === "/login"
                      ? "Don't have an account? Sign Up"
                      : "Have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Slide,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";

const LoginButton = styled(Button)({
  fontSize: "16px",
  borderRadius: "30px",
  padding: "12px 0",
});

const initialValues = {
  email: "",
  password: "",
};

const userSchema = yup.object().shape({
  email: yup
    .string()
    .email("Correo electronico invalido.")
    .required("Requerido."),
  password: yup.string().required("Requerido."),
});

const Login = ({ setUser, setIsAuthenticated }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://localhost:5000/auth/verifyToken", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          localStorage.removeItem("authToken");
        });
    }
  }, [navigate]);

  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    message: "",
  });

  const handleSnackbar = (message) => {
    setSnackbarState({
      open: true,
      message,
    });
  };

  const handleClose = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
  };

  const handleForgotPassword = () => {
    handleSnackbar("Contacta al 416 4223250");
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleLogin = async (values) => {
    const email = values.email;
    const password = values.password;
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      const { token } = response.data;

      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
      setUser({ email });
      navigate("/");
    } catch (err) {
      console.log(err);
      handleSnackbar("Credenciales invalidas");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      className="login-background"
    >
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={snackbarState.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
      />
      <Box alignSelf="flex-start" flexGrow="2" sx={{ mt: "30px", ml: "50px" }}>
        <img
          alt="logo"
          height="250px"
          width="auto"
          src={`../../assets/full_logo.png`}
          style={{ cursor: "pointer" }}
        />
      </Box>

      <Box
        display="flex"
        flexGrow="1"
        flexDirection="column"
        alignSelf="center"
        backgroundColor="#FAF9F9"
        borderRadius="6px"
        margin="150px"
        padding="30px 30px"
        boxShadow="0px 3px 5px 3px rgba(184,184,184,0.75)"
        minWidth="500px"
        maxWidth="550px"
      >
        <Typography variant="h1" fontWeight="bold" marginTop="10px">
          Iniciar Sesión
        </Typography>
        <Typography variant="h4" marginTop="10px" marginBottom="30px">
          Accede a tu cuenta para gestionar el gimnasio.
        </Typography>

        <Formik
          onSubmit={handleLogin}
          initialValues={initialValues}
          validationSchema={userSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              {" "}
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  name="email"
                  label="Correo electronico"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  name="password"
                  label="Contraseña"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <Button
                  sx={{ width: "200px" }}
                  variant="text"
                  onClick={handleForgotPassword}
                >
                  ¿Olvidaste la contraseña?
                </Button>
                <LoginButton
                  type="submit"
                  color="secondary"
                  variant="contained"
                  sx={{ gridColumn: "span 4", mt: "20px", mb: "20px" }}
                >
                  Iniciar Sesión
                </LoginButton>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      <Box
        alignSelf="flex-start"
        sx={{ mt: "30px", ml: "50px" }}
        flexGrow="5"
      ></Box>
    </Box>
  );
};

export default Login;

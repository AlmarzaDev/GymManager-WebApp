import * as React from "react";
import {
  Box,
  Button,
  TextField,
  useTheme,
  Snackbar,
  Slide,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const profileSchema = yup.object().shape({
  name: yup.string().required("Requerido."),
  email: yup
    .string()
    .email("Correo electrónico inválido.")
    .required("Requerido."),
  password: yup.string().required("Requerido."),
});

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [userData, setUserData] = React.useState({});

  const getUserProfile = () => {
    axios
      .get("http://localhost:5000/user/get_profile", {})
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    getUserProfile();
  }, []);

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

  const handleFormSubmit = (values, onSubmitProps) => {
    axios
      .put(
        "http://localhost:5000/user/update_profile",
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        handleSnackbar("Perfil actualizado exitosamente");
        onSubmitProps.resetForm();
        getUserProfile();
      })
      .catch((err) => {
        console.error(err);
        onSubmitProps.resetForm();
        handleSnackbar("Algo salió mal.");
      });
  };

  if (!userData) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box m="30px">
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={snackbarState.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
      />

      <Header
        title="PERFIL DE USUARIO"
        subtitle="Actualiza tus datos personales"
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          name: userData.Usuario || "",
          email: userData.Email || "",
          password: userData.Contrasena || "",
        }}
        validationSchema={profileSchema}
        enableReinitialize={true}
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
            <Box
              maxWidth="600px"
              backgroundColor={colors.primary[400]}
              margin="10px"
              padding="35px 30px"
              borderRadius="6px"
            >
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  name="name"
                  label="Usuario"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  name="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  name="password"
                  label="Contraseña"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="30px">
                <Button type="submit" color="secondary" variant="contained">
                  Guardar cambios
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Profile;

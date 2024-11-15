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

const generalSchema = yup.object().shape({
  registrationFee: yup.number().required("Requerido."),
  membershipFee: yup.number().required("Requerido."),
});

const GeneralSettings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [generalData, setGeneralData] = React.useState({});

  const getGeneralSettings = () => {
    axios
      .get("http://localhost:5000/general/get_settings")
      .then((res) => {
        setGeneralData(res.data);
      })
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    getGeneralSettings();
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
      .put("http://localhost:5000/general/update_settings", values)
      .then((res) => {
        console.log(res);
        handleSnackbar("Configuraciones actualizadas exitosamente");
        onSubmitProps.resetForm();
        getGeneralSettings();
      })
      .catch((err) => {
        console.log(err);
        onSubmitProps.resetForm();
        handleSnackbar("Algo salio mal.");
      });
  };

  if (!generalData) {
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
        title="CONFIGURACIÓN GENERAL"
        subtitle="Ajusta las configuraciones generales"
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          registrationFee: generalData.CuotaRegistro || "",
          membershipFee: generalData.CuotaMensual || "",
        }}
        validationSchema={generalSchema}
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
                  type="number"
                  name="registrationFee"
                  label="Cuota de Registro"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.registrationFee}
                  error={!!touched.registrationFee && !!errors.registrationFee}
                  helperText={touched.registrationFee && errors.registrationFee}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  name="membershipFee"
                  label="Cuota Mensual"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.membershipFee}
                  error={!!touched.membershipFee && !!errors.membershipFee}
                  helperText={touched.membershipFee && errors.membershipFee}
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

export default GeneralSettings;

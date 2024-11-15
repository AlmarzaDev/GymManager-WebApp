import * as React from "react";
import {
  Box,
  Button,
  TextField,
  useTheme,
  Snackbar,
  Slide,
  Slider,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const initialValues = {
  firstName: "",
  lastName: "",
  cedula: "",
  age: "",
  email: "",
  contact: "",
  address: "",
  date: dayjs(),
  abono: "",
  paidMonths: 1,
  preexisting: false,
  lastPaymentDate: undefined,
};

const phoneRegEx = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const clientSchema = yup.object().shape({
  firstName: yup.string().required("Requerido."),
  lastName: yup.string().required("Requerido."),
  cedula: yup.string().required("Requerido."),
  age: yup.number().required("Requerido."),
  email: yup
    .string()
    .email("Correo electronico invalido.")
    .required("Requerido."),
  contact: yup
    .string()
    .matches(phoneRegEx, "Numero de telefono invalido.")
    .required("Requerido."),
  address: yup.string().required("Requerido."),
  date: yup.mixed().required("Requerido."),
  abono: yup.number().required("Requerido."),
  paidMonths: yup.number().required("Requerido."),
  lastPaymentDate: yup.mixed(),
});

const monthMarks = [
  { value: 1, label: "1" },
  { value: 3, label: "3" },
  { value: 6, label: "6" },
  { value: 12, label: "12" },
];

const ClientForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values, onSubmitProps) => {
    console.log(values);
    axios
      .post("http://localhost:5000/add_client", values)
      .then((res) => {
        console.log(res);
        onSubmitProps.resetForm();
        handleSnackbar("Cliente creado exitosamente!");
      })
      .catch((err) => {
        console.log(err);
        handleSnackbar("Algo salio mal.");
      });
  };

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
        title="AÑADIR CLIENTE"
        subtitle="Crea el perfil de un nuevo cliente"
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={clientSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              maxWidth="1100px"
              backgroundColor={colors.primary[400]}
              margin="10px"
              padding="35px 30px"
              borderRadius="6px"
            >
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  name="firstName"
                  label="Nombre"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  name="lastName"
                  label="Apellido"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  name="cedula"
                  label="Cédula"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cedula}
                  error={!!touched.cedula && !!errors.cedula}
                  helperText={touched.cedula && errors.cedula}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  name="contact"
                  label="Número de telefono"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact}
                  error={!!touched.contact && !!errors.contact}
                  helperText={touched.contact && errors.contact}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  name="age"
                  label="Edad"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.age}
                  error={!!touched.age && !!errors.age}
                  helperText={touched.age && errors.age}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  name="email"
                  label="Correo electrónico"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  name="address"
                  label="Dirreción"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.address}
                  error={!!touched.address && !!errors.address}
                  helperText={touched.address && errors.address}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  name="abono"
                  label="Abono"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.abono}
                  error={!!touched.abono && !!errors.abono}
                  helperText={touched.abono && errors.abono}
                  sx={{ gridColumn: "span 2" }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    fullWidth
                    type="date"
                    name="date"
                    label="Fecha"
                    value={values.date}
                    onChange={(newValue) => {
                      setFieldValue("date", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!touched.date && !!errors.date}
                        helperText={touched.date && errors.date}
                      />
                    )}
                    sx={{ gridColumn: "span 2" }}
                  />
                </LocalizationProvider>

                {values.preexisting ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      fullWidth
                      type="date"
                      name="lastPaymentDate"
                      label="Última fecha de pago"
                      value={values.lastPaymentDate}
                      onChange={(newValue) => {
                        setFieldValue("lastPaymentDate", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={
                            !!touched.lastPaymentDate &&
                            !!errors.lastPaymentDate
                          }
                          helperText={
                            touched.lastPaymentDate && errors.lastPaymentDate
                          }
                        />
                      )}
                      sx={{ gridColumn: "span 2" }}
                    />
                  </LocalizationProvider>
                ) : (
                  <>
                    <Box sx={{ gridColumn: "span 2", margin: "-10px 10px" }}>
                      <Typography variant="subtitle1">Meses Pagados</Typography>
                      <Slider
                        name="paidMonths"
                        value={values.paidMonths}
                        onChange={(e, newValue) =>
                          setFieldValue("paidMonths", newValue)
                        }
                        step={1}
                        marks={monthMarks}
                        min={1}
                        max={12}
                        valueLabelDisplay="auto"
                        color="secondary"
                        sx={{ gridColumn: "span 2" }}
                      />
                    </Box>
                  </>
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      name="preexisting"
                      checked={values.preexisting}
                      onChange={handleChange}
                      sx={{
                        "&.Mui-checked": { color: colors.greenAccent[500] },
                      }}
                    />
                  }
                  label="Preexistente"
                />
              </Box>
              <Box display="flex" justifyContent="end" mt="30px">
                <Button type="submit" color="secondary" variant="contained">
                  Añadir nuevo cliente
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ClientForm;

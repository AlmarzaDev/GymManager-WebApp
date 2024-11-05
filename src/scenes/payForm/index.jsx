import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  TextField,
  useTheme,
  Snackbar,
  Slide,
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
  clientID: "",
  amount: "",
  date: dayjs(),
};

const userSchema = yup.object().shape({
  clientID: yup.string().required("Requerido."),
  amount: yup.number().required("Requerido."),
  date: yup.mixed().required("Requerido."),
});

const Pay = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    axios
      .get("http://localhost:5000/get_clients")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
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
    console.log(values);
    axios
      .post("http://localhost:5000/add_payment", values)
      .then((res) => {
        console.log("Everything went well!");
        console.log(res);
        onSubmitProps.resetForm();
        handleSnackbar("Pago procesado exitosamente!");
      })
      .catch((err) => {
        console.log(err);
        onSubmitProps.resetForm();
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

      <Header title="HACER UN PAGO" subtitle="Procesa el pago de un cliente" />
      <Formik
        onSubmit={handleFormSubmit}
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
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <Autocomplete
                    options={data}
                    getOptionLabel={(client) =>
                      `${client.Nombre} ${client.Apellido}`
                    }
                    onChange={(event, newValue) => {
                      handleChange({
                        target: {
                          name: "clientID",
                          value: newValue ? newValue.ClienteID : "",
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        name="clientID"
                        label="Nombre del cliente"
                        onBlur={handleBlur}
                        error={!!touched.clientID && !!errors.clientID}
                        helperText={touched.clientID && errors.clientID}
                      />
                    )}
                  />
                </FormControl>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  name="amount"
                  label="Monto"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.amount}
                  error={!!touched.amount && !!errors.amount}
                  helperText={touched.amount && errors.amount}
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
                      handleChange({
                        target: { name: "date", value: newValue },
                      });
                    }}
                    sx={{ gridColumn: "span 2" }}
                  />
                </LocalizationProvider>
              </Box>
              <Box display="flex" justifyContent="end" mt="30px">
                <Button type="submit" color="secondary" variant="contained">
                  Procesar pago
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Pay;

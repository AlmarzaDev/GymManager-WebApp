import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  Autocomplete,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Slide,
  Slider,
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
  cedula: "",
  debt: "",
  lastPaymentDate: "",
  membershipEndDate: "",
  amount: "",
  date: dayjs(),
  paidMonths: 0,
};

const userSchema = yup.object().shape({
  clientID: yup.string().required("Requerido."),
  amount: yup.number().required("Requerido."),
  date: yup.mixed().required("Requerido."),
  paidMonths: yup.number().required("Requerido."),
});

const monthMarks = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 3, label: "3" },
  { value: 6, label: "6" },
  { value: 12, label: "12" },
];

const PayForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [clientData, setClientData] = React.useState([]);

  const getClients = () => {
    axios
      .get("http://localhost:5000/get_clients")
      .then((res) => {
        const formattedData = res.data.map((item) => ({
          ...item,
          UltimaFechaPago: dayjs(item.UltimaFechaPago).format("MM/DD/YYYY"),
          FechaFinMembresia: dayjs(item.FechaFinMembresia).format("MM/DD/YYYY"),
        }));
        setClientData(formattedData);
        console.log(formattedData);
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getClients();
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
    const { clientID, amount, date, paidMonths } = values;

    axios
      .post("http://localhost:5000/add_payment", {
        clientID,
        amount,
        date: dayjs(date).format("YYYY-MM-DD"),
        paidMonths,
      })
      .then((res) => {
        console.log(res);
        onSubmitProps.resetForm();
        onSubmitProps.setFieldValue("clientID", "");
        handleSnackbar("Pago procesado exitosamente!");
        getClients();
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

      <Header title="PROCESAR PAGO" subtitle="Produce el pago de un cliente" />
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
                <FormControl sx={{ gridColumn: "span 2" }}>
                  <Autocomplete
                    options={clientData}
                    getOptionLabel={(client) =>
                      `${client.Nombre} ${client.Apellido}`
                    }
                    value={
                      values.clientID
                        ? clientData.find(
                            (client) => client.ClienteID === values.clientID
                          )
                        : null
                    }
                    onChange={(event, newValue) => {
                      setFieldValue(
                        "clientID",
                        newValue ? newValue.ClienteID : ""
                      );
                      setFieldValue("cedula", newValue ? newValue.Cedula : "");
                      setFieldValue("debt", newValue ? newValue.Deuda : "");
                      setFieldValue(
                        "lastPaymentDate",
                        newValue ? newValue.UltimaFechaPago : ""
                      );
                      setFieldValue(
                        "membershipEndDate",
                        newValue ? newValue.FechaFinMembresia : ""
                      );
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
                  disabled
                  type="text"
                  name="cedula"
                  label="Cédula"
                  value={values.cedula}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  disabled
                  type="text"
                  name="debt"
                  label="Deuda"
                  value={values.debt}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  disabled
                  type="text"
                  name="lastPaymentDate"
                  label="Última fecha de pago"
                  value={values.lastPaymentDate}
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  disabled
                  type="text"
                  name="membershipEndDate"
                  label="Finalización de la membresía"
                  value={values.membershipEndDate}
                  sx={{ gridColumn: "span 1" }}
                />
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
                      setFieldValue("date", newValue);
                    }}
                    sx={{ gridColumn: "span 2" }}
                  />
                </LocalizationProvider>
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
                    min={0}
                    max={12}
                    valueLabelDisplay="auto"
                    color="secondary"
                    sx={{ gridColumn: "span 2" }}
                  />
                </Box>
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

export default PayForm;

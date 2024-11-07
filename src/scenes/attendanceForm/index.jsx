import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  Autocomplete,
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

const initialValues = { clientID: "" };
const userSchema = yup
  .object()
  .shape({ clientID: yup.string().required("Requerido.") });

const AttendanceForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [data, setData] = React.useState([]);
  const [clientStatus, setClientStatus] = React.useState({});
  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    message: "",
  });

  React.useEffect(() => {
    axios
      .get("http://localhost:5000/get_clients")
      .then((res) => {
        setData(res.data);
        const statusMap = {};
        res.data.forEach((client) => {
          statusMap[client.ClienteID] = client.Registrado === 1;
        });
        setClientStatus(statusMap);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSnackbar = (message) => setSnackbarState({ open: true, message });
  const handleClose = () => setSnackbarState({ ...snackbarState, open: false });

  const handleCheckIn = (clientID) => {
    axios
      .post("http://localhost:5000/attendance/checkin", { clientID })
      .then(() => {
        setClientStatus({ ...clientStatus, [clientID]: true });
        handleSnackbar("Entrada registrada exitosamente!");
      })
      .catch(() => handleSnackbar("Error al registrar entrada."));
  };

  const handleCheckOut = (clientID) => {
    axios
      .post("http://localhost:5000/attendance/checkout", { clientID })
      .then(() => {
        setClientStatus({ ...clientStatus, [clientID]: false });
        handleSnackbar("Salida registrada exitosamente!");
      })
      .catch(() => handleSnackbar("Error al registrar salida."));
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
        title="REGISTRAR ASISTENCIA"
        subtitle="Registrar entrada o salida de un cliente"
      />
      <Formik initialValues={initialValues} validationSchema={userSchema}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={(e) => e.preventDefault()}>
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
              </Box>
              <Box display="flex" justifyContent="flex-end" mt="20px">
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  sx={{ mr: "30px" }}
                  disabled={clientStatus[values.clientID]}
                  onClick={() => handleCheckIn(values.clientID)}
                >
                  Registrar Entrada
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  disabled={!clientStatus[values.clientID]}
                  onClick={() => handleCheckOut(values.clientID)}
                >
                  Registrar Salida
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AttendanceForm;

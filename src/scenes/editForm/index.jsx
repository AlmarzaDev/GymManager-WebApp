import * as React from "react";
import { Box, Button, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const phoneRegEx = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

const userSchema = yup.object().shape({
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
  debt: yup.number().required("Requerido."),
});

const EditForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const { client } = location.state;

  const initialValues = {
    firstName: client.Nombre,
    lastName: client.Apellido,
    cedula: client.Cedula,
    age: client.Edad,
    email: client.Email,
    contact: client.Telefono,
    address: client.Direccion,
    date: dayjs(client.FechaRegistro),
    debt: client.Deuda,
    ClienteID: client.ClienteID,
  };

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values, onSubmitProps) => {
    axios
      .put("http://localhost:5000/edit_client", values)
      .then((res) => {
        console.log(res);
        navigate("/clients");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box m="30px">
      <Header
        title="EDITAR CLIENTE"
        subtitle="Edita el perfil de un cliente existente"
      />
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
                <TextField
                  disabled
                  type="text"
                  name="ClienteID"
                  label="ClienteID"
                  value={values.ClienteID}
                  sx={{ gridColumn: "span 4" }}
                />
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
                  label="Cedula"
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
                  name="debt"
                  label="Deuda"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.debt}
                  error={!!touched.debt && !!errors.debt}
                  helperText={touched.debt && errors.debt}
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
              </Box>
              <Box display="flex" justifyContent="end" mt="30px">
                <Button type="submit" color="secondary" variant="contained">
                  Editar cliente
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditForm;

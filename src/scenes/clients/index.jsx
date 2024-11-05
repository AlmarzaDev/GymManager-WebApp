import React, { useEffect, useState } from "react";
import { Box, Button, useTheme, Snackbar, Slide } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { esES } from "@mui/x-data-grid/locales";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchClients();
  }, []);
  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    message: "",
  });

  const fetchClients = () => {
    axios
      .get("http://localhost:5000/get_clients")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (clientData) => {
    navigate("/edit", { state: { client: clientData } });
  };

  const handleDelete = (ClienteID) => {
    axios
      .post("http://localhost:5000/delete_client", { ClienteID })
      .then((res) => {
        console.log(res);
        handleSnackbar("Cliente eliminado exitosamente.");
        fetchClients();
      })
      .catch((err) => {
        console.log(err);
        handleSnackbar("Algo salio mal.");
      });
  };

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

  const columns = [
    { field: "Cedula", headerName: "Cedula" },
    {
      field: "Nombre",
      headerName: "Nombre",
      flex: 1,
    },
    {
      field: "Apellido",
      headerName: "Apellido",
      flex: 1,
    },
    {
      field: "Edad",
      headerName: "Edad",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Telefono",
      headerName: "Numero de telefono",
      flex: 1,
    },
    {
      field: "Email",
      headerName: "Correo electronico",
      flex: 1,
    },
    {
      field: "Direccion",
      headerName: "Direccion",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box width="60%" m="8px auto" display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="success"
              sx={{ mr: "15px" }}
              onClick={() => handleEdit(row)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(row.ClienteID)}
            >
              Eliminar
            </Button>
          </Box>
        );
      },
    },
  ];

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
        title="CLIENTES"
        subtitle="Gestiona a los clientes del gimnasio"
      />
      <Box
        m="30px 0 0 0"
        height="72vh"
        width="169vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none", fontSize: "14px" },
          "& .MuiDataGrid-columnHeader": {
            borderBottom: "none",
            backgroundColor: colors.greenAccent[600],
            fontSize: "14px",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            backgroundColor: colors.greenAccent[600],
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.ClienteID}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </Box>
  );
};

export default Clients;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useTheme,
  Snackbar,
  Slide,
  Typography,
} from "@mui/material";
import { Delete, Edit, Warning, CheckCircle } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { esES } from "@mui/x-data-grid/locales";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";
import dayjs from "dayjs";

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
        const formattedData = res.data.map((item) => ({
          ...item,
          FechaFinMembresia: dayjs(item.FechaFinMembresia).format("MM/DD/YYYY"),
        }));
        setData(formattedData);
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
    { field: "Cedula", headerName: "Cedula", flex: 0.6 },
    {
      field: "Nombre",
      headerName: "Nombre",
      headerClassName: "table-headers",
      flex: 0.6,
    },
    {
      field: "Apellido",
      headerName: "Apellido",
      flex: 0.6,
    },
    {
      field: "Telefono",
      headerName: "Numero de telefono",
      flex: 0.8,
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
      field: "Deuda",
      headerName: "Deuda",
      flex: 0.5,
    },
    {
      field: "FechaFinMembresia",
      headerName: "Finalizacion de membresia",
      flex: 1,
      renderCell: ({ row }) => {
        const today = dayjs();
        const currentEndDate = dayjs(row.FechaFinMembresia);
        const isActiveOrNearEnd =
          currentEndDate.isSame(today) ||
          currentEndDate.isAfter(today) ||
          !currentEndDate.diff(today, "week");

        const textColor = isActiveOrNearEnd ? "green" : "red";
        const IconComponent = isActiveOrNearEnd ? CheckCircle : Warning;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifySelf: "center",
              backgroundColor: isActiveOrNearEnd ? "#e8f5e9" : "#ffebee",
              borderRadius: "12px",
              padding: "4px 12px",
              marginTop: "10px",
            }}
          >
            <IconComponent
              sx={{
                color: textColor,
                marginRight: "8px",
              }}
            />
            <Typography variant="body2" sx={{ color: textColor }}>
              {currentEndDate.format("YYYY-MM-DD")}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1.2,
      renderCell: ({ row }) => {
        return (
          <Box width="100%" m="8px auto" display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="success"
              sx={{ mr: "15px" }}
              endIcon={<Edit />}
              onClick={() => handleEdit(row)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              endIcon={<Delete />}
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
          "& .MuiDataGrid-cell": { fontSize: "14px" },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: colors.greenAccent[600],
            fontSize: "14px",
          },

          "& .MuiDataGrid-footerContainer": {
            borderRadius: "0 0 6px 6px",
            backgroundColor: colors.greenAccent[600],
          },

          "& .MuiDataGrid-scrollbarFiller--header": {
            backgroundColor: colors.greenAccent[600],
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.ClienteID}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Clients;

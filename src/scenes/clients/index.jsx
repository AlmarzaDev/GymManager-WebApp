import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme.js";
import Header from "../../components/Header.jsx";

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("/get_clients")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

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
      field: "access",
      headerName: "Acciones",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box width="60%" m="8px auto" display="flex" justifyContent="center">
            <Button variant="outlined" color="success" sx={{ mr: "15px" }}>
              Editar
            </Button>
            <Button variant="outlined" color="error">
              Eliminar
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="30px">
      <Header
        title="CLIENTES"
        subtitle="Gestiona a los clientes del gimnasio"
      />
      <Box
        m="30px 0 0 0"
        height="72vh"
        width="162vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeader": {
            borderBottom: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.ClienteID}
        />
      </Box>
    </Box>
  );
};

export default Clients;

import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { esES } from "@mui/x-data-grid/locales";
import { tokens } from "../../theme";
import Header from "../../components/Header.jsx";
import dayjs from "dayjs";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/get_payments")
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          ...item,
          FechaPago: dayjs(item.FechaPago).format("MM/DD/YYYY"),
        }));
        setData(formattedData);
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
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
      field: "Monto",
      headerName: "Monto",
      flex: 1,
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
      field: "FechaPago",
      headerName: "Fecha de pago",
      flex: 1,
    },
  ];

  return (
    <Box m="30px">
      <Header title="FACTURAS" subtitle="Lista de saldos de facturas" />
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[300]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.PagoID}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Invoices;

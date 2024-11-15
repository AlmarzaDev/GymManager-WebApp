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
      field: "Cedula",
      headerName: "Cedula",
      flex: 0.8,
    },
    {
      field: "Monto",
      headerName: "Monto",
      flex: 0.8,
    },
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
      field: "MesesPagados",
      headerName: "Meses Pagados",
      flex: 0.7,
    },
    {
      field: "Telefono",
      headerName: "Numero de telefono",
      flex: 1,
    },
    {
      field: "Email",
      headerName: "Correo electronico",
      flex: 1.2,
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
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Invoices;

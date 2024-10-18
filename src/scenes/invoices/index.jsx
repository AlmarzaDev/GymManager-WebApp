import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header.jsx";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("/get_payments")
      .then((res) => {
        setData(res.data);
        console.log("got the payments!");
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    {
      field: "firstName",
      headerName: "Nombre",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Nombre",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Cantidad",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Numero de telefono",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Correo electronico",
      flex: 1,
    },

    {
      field: "date",
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
        width="162vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeader": {
            borderBottom: "none",
            backgroundColor: colors.blueAccent[800],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            backgroundColor: colors.blueAccent[800],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.ClienteID}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Invoices;

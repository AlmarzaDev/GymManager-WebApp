import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { esES } from "@mui/x-data-grid/locales";
import { tokens } from "../../theme";
import Header from "../../components/Header.jsx";
import dayjs from "dayjs";

const AttendanceHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get_attendance")
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          ...item,
          FechaAsistencia: dayjs(item.FechaAsistencia).format("MM/DD/YYYY"),
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
      field: "HoraLlegada",
      headerName: "Hora de Llegada",
      flex: 1,
    },
    {
      field: "HoraSalida",
      headerName: "Hora de Salida",
      flex: 1,
    },
    {
      field: "FechaAsistencia",
      headerName: "Fecha de Asistencia",
      flex: 1,
    },
  ];

  return (
    <Box m="30px">
      <Header
        title="HISTORIAL DE ASISTENCIA"
        subtitle="Lista de asistencia de los clientes"
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[300]} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.AsistenciaID}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default AttendanceHistory;

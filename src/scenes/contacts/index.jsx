import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header.jsx";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "ID Registrar" },
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Edad",
      type: "number",
      headerAlign: "left",
      align: "left",
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
      field: "address",
      headerName: "Direccion",
      flex: 1,
    },
    {
      field: "city",
      headerName: "Ciudad",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "Codigo Postal",
      flex: 1,
    },
  ];

  return (
    <Box m="30px">
      <Header
        title="CONTACTOS"
        subtitle="Lista de contactos para futura refencia"
      />
      <Box
        m="30px 0 0 0"
        height="72vh"
        width="162vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid rows={mockDataContacts} columns={columns} />
      </Box>
    </Box>
  );
};

export default Contacts;

import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  Autocomplete,
  TextField,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Settings,
  Logout,
  AccountCircle,
} from "@mui/icons-material";

const pages = [
  { label: "Inicio", path: "/" },
  { label: "Configuraciones", path: "/settings" },
  { label: "Perfil", path: "/profile" },
  { label: "Clientes", path: "/clients" },
  { label: "Asistencias", path: "/attendance" },
  { label: "Facturas", path: "/invoices" },
  { label: "Historial", path: "/history" },
  { label: "Añadir Clientes", path: "/form" },
  { label: "Pagos", path: "/pay" },
  { label: "Calendario", path: "/calendar" },
  { label: "Gráfico de Barras", path: "/bar" },
  { label: "Gráfico de Pastel", path: "/pie" },
  { label: "Gráfico de Línea", path: "/line" },
];

const Topbar = ({ user, onLogout }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSearchNavigate = (event, newValue) => {
    if (newValue?.path) {
      navigate(newValue.path);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="4px"
        alignItems="center"
        sx={{ m: "10px 0 0 15px" }}
      >
        <Autocomplete
          options={pages}
          getOptionLabel={(option) => option.label}
          onChange={handleSearchNavigate}
          renderInput={(params) => (
            <TextField {...params} placeholder="Buscar" />
          )}
          sx={{ width: 250 }}
        />
      </Box>

      <Box display="flex" alignItems="center" textAlign="center">
        <Tooltip title="Cambiar tema">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined />
            ) : (
              <LightModeOutlined />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Ajustes de la cuenta">
          <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
            <AccountCircle sx={{ width: "35px", height: "35px" }} />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              navigate("/profile");
            }}
          >
            <Avatar /> Perfil
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              navigate("/settings");
            }}
          >
            <Settings sx={{ mr: "7px" }} />
            Configuración
          </MenuItem>
          <MenuItem
            onClick={() => {
              onLogout();
            }}
          >
            <Logout sx={{ mr: "7px" }} />
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;

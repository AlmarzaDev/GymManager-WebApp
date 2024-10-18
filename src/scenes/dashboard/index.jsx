import { Box } from "@mui/material";
import Header from "../../components/Header";

const Dashboard = () => {
  return (
    <Box m="30px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="PANEL DE CONTROL"
          subtitle="Bienvenido al panel de control"
        />
      </Box>
    </Box>
  );
};

export default Dashboard;

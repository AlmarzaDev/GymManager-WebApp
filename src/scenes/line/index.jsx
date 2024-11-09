import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";

const Line = () => {
  return (
    <Box m="30px">
      <Header
        title="GRAFICO DE LINEAS"
        subtitle="Visualiza las ganancias mensuales"
      />
      <Box height="72vh" width="169vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;

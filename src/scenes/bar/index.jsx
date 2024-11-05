import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const Bar = () => {
  return (
    <Box m="30px">
      <Header title="GRAFICO DE BARRAS" subtitle="Humilde grafico de barras" />
      <Box height="72vh" width="169vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;

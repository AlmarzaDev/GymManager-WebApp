import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";

const Pie = () => {
  return (
    <Box m="30px">
      <Header
        title="GRAFICO CIRCULAR"
        subtitle="Otra manera de digerir la informacion"
      />
      <Box height="75vh" width="150vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;

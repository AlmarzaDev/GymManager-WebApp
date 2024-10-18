import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";

const Line = () => {
  return (
    <Box m="30px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="72vh" width="162vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;

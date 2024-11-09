import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import axios from "axios";
import dayjs from "dayjs";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get_attendance/barData")
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          ...item,
          date: dayjs(item.date).format("MM/DD"),
        }));
        setData(formattedData);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(data);

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 2 },
            text: { fill: colors.grey[100] },
          },
        },
        legends: { text: { fill: colors.grey[100] } },
      }}
      keys={["Asistencias"]}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "set2" }}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      borderRadius={3}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Fechas",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Asistencias",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 120,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemOpacity: 0.85,
          symbolSize: 20,
        },
      ]}
      isInteractive={false}
      enableLabel={false}
      enableTotals={true}
      role="application"
      ariaLabel="Grafico de barras"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} on ${e.indexValue}`}
    />
  );
};

export default BarChart;

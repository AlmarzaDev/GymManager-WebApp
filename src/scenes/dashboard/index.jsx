import { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import dayjs from "dayjs";
import {
  DownloadOutlined,
  AttachMoney,
  Person,
  PersonAdd,
  MoneyOff,
} from "@mui/icons-material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboardData")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/recentPayments")
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          ...item,
          PagoID: item.PagoID.substring(0, 18),
          FechaPago: dayjs(item.FechaPago).format("DD/MM"),
        }));
        setPaymentData(formattedData);
      })
      .catch((err) => console.log(err));
  }, []);

  let MonthlyPaymentsPercentage;
  if (data.YearlyPaymentsCount > 0) {
    MonthlyPaymentsPercentage = (
      (data.MonthlyPaymentsCount / data.YearlyPaymentsCount) *
      100
    ).toFixed(0);
  }

  let NewClientPercentage;
  if (data.TotalClientsCount > 0) {
    NewClientPercentage = (
      (data.NewClientsCount / data.TotalClientsCount) *
      100
    ).toFixed(0);
  }

  let PendingPaymentsPercentage;
  if (data.MonthlyPaymentsCount > 0) {
    PendingPaymentsPercentage = (
      (data.PendingPaymentsCount / data.MonthlyPaymentsCount) *
      100
    ).toFixed(0);
  }

  let ActiveUserPercentage;
  if (data.TotalClientsCount > 0) {
    ActiveUserPercentage = (
      (data.ActiveClients / data.TotalClientsCount) *
      100
    ).toFixed(0);
  }

  return (
    <Box m="30px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="PANEL DE CONTROL"
          subtitle="ㅤBienvenid@ a tu panel de control"
        />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Descargar Reportes
          </Button>
        </Box>
      </Box>

      {/* grid y graficos */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="130px"
        gap="15px"
      >
        {/* fila 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="4px"
        >
          <StatBox
            title={data.TotalClientsCount}
            subtitle="Clientes Totales"
            extra={false}
            icon={
              <Person
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="4px"
        >
          <StatBox
            title={data.MonthlyPaymentsCount}
            subtitle="Pagos Mensuales"
            extra={true}
            progress={`0.${MonthlyPaymentsPercentage}`}
            increase={`+${MonthlyPaymentsPercentage}%`}
            icon={
              <AttachMoney
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="4px"
        >
          <StatBox
            title={data.NewClientsCount}
            subtitle="Nuevos Clientes"
            extra={true}
            progress={`0.${NewClientPercentage}`}
            increase={`+${NewClientPercentage}%`}
            icon={
              <PersonAdd
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="4px"
        >
          <StatBox
            title={data.PendingPaymentsCount}
            subtitle="Pagos Pendientes"
            extra={true}
            progress={`0.${PendingPaymentsPercentage}`}
            increase={`+${PendingPaymentsPercentage}%`}
            icon={
              <MoneyOff
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* fila 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="4px"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Ganancias Obtenidas
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                ${data.YearlyPaymentsAmount}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlined
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          borderRadius="4px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[400]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Pagos Recientes
            </Typography>
          </Box>
          {paymentData.map((payment, i) => (
            <Box
              key={`${payment.PagoID}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[400]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                  maxWidth="150px"
                >
                  {payment.Nombre} {payment.Apellido}{" "}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {payment.PagoID}
                </Typography>
              </Box>
              <Box color={colors.grey[100]} fontWeight="600">
                {payment.FechaPago}
              </Box>{" "}
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${payment.Monto}
              </Box>
            </Box>
          ))}
        </Box>

        {/* fila 3 */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="4px"
        >
          <Typography variant="h5" fontWeight="600">
            Usuarios Activos
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle progress={"0." + ActiveUserPercentage} size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {ActiveUserPercentage}% de los clientes registrados siguen activos
            </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="4px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Estadisticas de las asistencias
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

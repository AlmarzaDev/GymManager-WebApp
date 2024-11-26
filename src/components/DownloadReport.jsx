import React from "react";
import { Button, useTheme } from "@mui/material";
import { DownloadOutlined } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { tokens } from "../theme";
import dayjs from "dayjs";

const DownloadReport = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const fetchLatestPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/payments/latest");
      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  };

  const generatePDF = async () => {
    const payments = await fetchLatestPayments();

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Ultimos Pagos", 14, 20);

    const tableColumn = [
      "ID de Pago",
      "Cliente",
      "Monto",
      "Meses Pagados",
      "Fecha de Pago",
    ];
    const tableRows = payments.map((payment) => [
      payment.PagoID.substring(0, 18),
      `${payment.ClienteNombre} ${payment.ClienteApellido}`,
      `$${payment.Monto}`,
      payment.MesesPagados,
      dayjs(payment.FechaPago).format("MM/DD/YYYY"),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("reporte_pagos.pdf");
  };

  return (
    <Button
      onClick={generatePDF}
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
  );
};

export default DownloadReport;

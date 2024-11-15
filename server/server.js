const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");
const { v4: uuid4v } = require("uuid");
const dayjs = require("dayjs");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gym_logistics",
});

const users = [{ email: "admin@gmail.com", password: "contraseña123" }];

app.post("/login", (req, res) => {
  const user = users.find(
    (u) => u.email === req.body.email && u.password === req.body.password
  );

  if (user) {
    return res.json({ token: "your-auth-token" });
  } else {
    return res.status(401).json({ message: "Credenciales invalidas" });
  }
});

app.post("/add_client", (req, res) => {
  const clientID = uuid4v();
  const {
    firstName,
    lastName,
    cedula,
    age,
    email,
    contact,
    address,
    date,
    abono,
    paidMonths,
    preexisting,
  } = req.body;

  let lastPaymentDate = req.body.lastPaymentDate;
  lastPaymentDate = undefined
    ? dayjs(date).format("YYYY-MM-DD")
    : dayjs(lastPaymentDate).format("YYYY-MM-DD");

  const registrationDate = dayjs(date).format("YYYY-MM-DD");
  const monthlyFee = 15;
  const registrationFee = 5;
  let initialDebt = paidMonths * monthlyFee - abono;

  if (!preexisting) {
    initialDebt += registrationFee;
  }

  initialDebt = Math.max(0, initialDebt);

  const clientValues = [
    clientID,
    firstName,
    lastName,
    cedula,
    age,
    email,
    contact,
    address,
    registrationDate,
    initialDebt,
  ];

  const clientSql = `
    INSERT INTO clientes (ClienteID, Nombre, Apellido, Cedula, Edad, Email, Telefono, Direccion, FechaRegistro, Deuda)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(clientSql, clientValues, (err, result) => {
    if (err) {
      return res.json({
        message: "Error al agregar el cliente: " + err,
      });
    }

    const initialPaymentDate = preexisting ? lastPaymentDate : registrationDate;

    const membershipEndDate = dayjs(initialPaymentDate)
      .add(paidMonths, "month")
      .format("YYYY-MM-DD");

    const paymentId = uuid4v();
    const paymentValues = [
      paymentId,
      clientID,
      abono,
      initialPaymentDate,
      paidMonths,
    ];

    const paymentSql = `
      INSERT INTO pagos (PagoID, ClienteID, Monto, FechaPago, MesesPagados)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(paymentSql, paymentValues, (err, result) => {
      if (err) {
        return res.json({
          message: "Error al agregar el pago: " + err,
        });
      }

      const updateClientSql = `
        UPDATE clientes
        SET UltimaFechaPago = ?,
            FechaFinMembresia = ?
        WHERE ClienteID = ?
      `;
      db.query(
        updateClientSql,
        [initialPaymentDate, membershipEndDate, clientID],
        (err, result) => {
          if (err) {
            return res.json({
              message: "Error al actualizar el cliente: " + err,
            });
          }

          return res.json({
            success: "Cliente y pago añadidos exitosamente!",
          });
        }
      );
    });
  });
});

app.put("/edit_client", (req, res) => {
  const sql = `
    UPDATE clientes
    SET Nombre = ?, Apellido = ?, Cedula = ?, Edad = ?, Email = ?, Telefono = ?, Direccion = ?, FechaRegistro = ?, Deuda = ?
    WHERE ClienteID = ?
  `;
  const values = [
    req.body.firstName,
    req.body.lastName,
    req.body.cedula,
    req.body.age,
    req.body.email,
    req.body.contact,
    req.body.address,
    req.body.date,
    req.body.debt,
    req.body.ClienteID,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.json({
        message: "Algo salió mal editando el cliente: " + err,
      });
    }
    return res.json({ success: "Cliente editado exitosamente!" });
  });
});

app.post("/delete_client", (req, res) => {
  const sql = "DELETE FROM clientes WHERE ClienteID = ?;";
  const values = [req.body.ClienteID];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({
        message: "Algo salio mal eliminando el cliente: " + err,
      });
    return res.json({ success: "Cliente eliminado exitosamente!" });
  });
});

app.post("/add_payment", (req, res) => {
  const paymentId = uuid4v();
  const { clientID, amount, date, paidMonths = 1 } = req.body;
  const monthlyFee = 15;
  const totalCost = paidMonths * monthlyFee;
  const remainingDebt = totalCost - amount;

  const paymentSql = `
    INSERT INTO pagos (PagoID, ClienteID, Monto, FechaPago, MesesPagados)
    VALUES (?, ?, ?, ?, ?)
  `;
  const paymentValues = [paymentId, clientID, amount, date, paidMonths];

  db.query(paymentSql, paymentValues, (err, paymentResult) => {
    if (err) {
      return res.json({
        message: "Algo salió mal procesando el pago: " + err,
      });
    }

    const getClientSql = `SELECT FechaFinMembresia FROM clientes WHERE ClienteID = ?`;
    db.query(getClientSql, [clientID], (clientErr, clientResult) => {
      if (clientErr) {
        return res.json({
          message:
            "Error al obtener la fecha de fin de membresía: " + clientErr,
        });
      }

      const currentEndDate = clientResult[0].FechaFinMembresia;

      const today = dayjs();
      const endDateCondition =
        dayjs(currentEndDate).isSame(today) ||
        dayjs(currentEndDate).isAfter(today) ||
        !dayjs(currentEndDate).diff(today, "month");

      const newEndDate = endDateCondition
        ? dayjs(currentEndDate).add(paidMonths, "month").format("YYYY-MM-DD")
        : dayjs(date).add(paidMonths, "month").format("YYYY-MM-DD");

      const updateClientSql = `
        UPDATE clientes
        SET 
          FechaFinMembresia = ?, 
          UltimaFechaPago = ?,
          Deuda = CASE
            WHEN ? > 0 THEN Deuda + ?
            ELSE GREATEST(Deuda + ?, 0)
          END
        WHERE ClienteID = ?
      `;
      const updateValues = [
        newEndDate,
        date,
        remainingDebt,
        remainingDebt,
        remainingDebt,
        clientID,
      ];

      db.query(updateClientSql, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          return res.json({
            message:
              "Error actualizando la información del cliente: " + updateErr,
          });
        }

        res.json({
          success: "Pago procesado exitosamente, deuda actualizada",
        });
      });
    });
  });
});

app.post("/attendance/checkin", (req, res) => {
  const updateClienteStatus =
    "UPDATE clientes SET Registrado = 1 WHERE ClienteID = ?";
  const addAsistenciaRecord =
    "INSERT INTO asistencias (`AsistenciaID`, `ClienteID`, `FechaAsistencia`, `HoraLlegada`) VALUES (?, ?, ?, ?)";
  const id = uuid4v();
  const date = dayjs().format("YYYY-MM-DD");
  const checkInTime = dayjs().format("HH:mm:ss");

  db.query(updateClienteStatus, [req.body.clientID], (err) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Algo salio mal actualizando el cliente: " + err });
    db.query(
      addAsistenciaRecord,
      [id, req.body.clientID, date, checkInTime],
      (err) => {
        if (err)
          return res.status(500).json({
            message: "Algo salio mal agregando la asistencia: " + err,
          });
        res.json({ success: "Entrada registrada exitosamente!" });
      }
    );
  });
});

app.post("/attendance/checkout", (req, res) => {
  const updateClienteStatus =
    "UPDATE clientes SET Registrado = 0 WHERE ClienteID = ?";
  const updateAsistenciaRecord =
    "UPDATE asistencias SET HoraSalida = ? WHERE ClienteID = ? AND FechaAsistencia = ? AND HoraSalida IS NULL";

  const date = dayjs().format("YYYY-MM-DD");
  const checkOutTime = dayjs().format("HH:mm:ss");

  db.query(
    updateAsistenciaRecord,
    [checkOutTime, req.body.clientID, date],
    (err) => {
      if (err)
        return res.status(500).json({
          message: "Algo salio mal actualizando la asistencia: " + err,
        });
      db.query(updateClienteStatus, [req.body.clientID], (err) => {
        if (err)
          return res.status(500).json({
            message: "Algo salio mal actualizando el cliente: " + err,
          });
        res.json({ success: "Salida registrada exitosamente!" });
      });
    }
  );
});

app.get("/get_clients", (req, res) => {
  const sql = "SELECT * FROM clientes";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Error del servidor" + err });
    return res.json(result);
  });
});

app.get("/get_payments", (req, res) => {
  const sql =
    "SELECT * FROM clientes JOIN pagos ON clientes.ClienteID = pagos.ClienteID";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Error del servidor" + err });
    return res.json(result);
  });
});

app.get("/get_payments/lineData", (req, res) => {
  const sql = `
      SELECT DATE_FORMAT(FechaPago, '%m-%Y') AS month,
        SUM(Monto) AS total_revenue
      FROM pagos
      GROUP BY month
      ORDER BY month;
    `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: "Error del servidor" + err });
    return res.json(result);
  });
});

app.get("/get_attendance", (req, res) => {
  const sql =
    "SELECT * FROM clientes JOIN asistencias ON clientes.ClienteID = asistencias.ClienteID";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Error del servidor" + err });
    return res.json(result);
  });
});

app.get("/get_attendance/status", (req, res) => {
  const sql =
    "SELECT ClienteID, Registrado FROM asistencias WHERE FechaAsistencia = ?";
  const values = [dayjs().format("YYYY-MM-DD")];

  db.query(sql, values, (err, result) => {
    if (err) return res.json({ message: "Error del servidor" + err });
    return res.json(result);
  });
});

app.get("/get_attendance/barData", (req, res) => {
  const sql = `
      SELECT DATE(FechaAsistencia) AS date,
        COUNT(*) AS "Asistencias"
      FROM asistencias
      WHERE FechaAsistencia >= CURDATE() - INTERVAL 7 DAY
      GROUP BY date
      ORDER BY date;
    `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: "Error del servidor" + err });
    return res.json(result);
  });
});

app.get("/dashboardData", (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(ClienteID) FROM clientes) AS TotalClientsCount,
      (SELECT COUNT(ClienteID) FROM clientes WHERE FechaRegistro >= CURDATE() - INTERVAL 30 DAY) AS NewClientsCount,
      (SELECT COUNT(PagoID) FROM pagos WHERE FechaPago >= CURDATE() - INTERVAL 30 DAY) AS MonthlyPaymentsCount,
      (SELECT COUNT(PagoID) FROM pagos WHERE FechaPago >= CURDATE() - INTERVAL 1 YEAR) AS YearlyPaymentsCount,
      (SELECT SUM(Monto) FROM pagos WHERE FechaPago >= CURDATE() - INTERVAL 1 YEAR) AS YearlyPaymentsAmount,
      (SELECT COUNT(*) FROM (
        SELECT c.ClienteID
        FROM clientes c
        LEFT JOIN pagos p ON c.ClienteID = p.ClienteID 
        GROUP BY c.ClienteID
        HAVING MAX(p.FechaPago) < CURDATE() - INTERVAL 30 DAY OR MAX(p.FechaPago) IS NULL
      ) AS PendingPayments) AS PendingPaymentsCount,
      (SELECT COUNT(DISTINCT ClienteID) FROM asistencias WHERE FechaAsistencia >= CURDATE() - INTERVAL 14 DAY) AS ActiveClients;
    `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: "Error del servidor" + err });
    return res.json(result[0]);
  });
});

app.get("/recentPayments", (req, res) => {
  const sql = `
    SELECT 
      p.PagoID,
      p.ClienteID,
      p.Monto,
      p.FechaPago,
      c.Nombre,
      c.Apellido
    FROM pagos p
    JOIN clientes c ON p.ClienteID = c.ClienteID
    WHERE p.FechaPago >= CURDATE() - INTERVAL 7 DAY
    ORDER BY p.FechaPago DESC;
  `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ message: "Error del servidor" + err });
    return res.json(result);
  });
});

app.get("/events", (req, res) => {
  const sql = "SELECT * FROM eventos";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Error del servidor" });
    res.json(result);
  });
});

app.post("/events", (req, res) => {
  const { title, start, end, allDay } = req.body;
  const sql =
    "INSERT INTO eventos (title, start, end, allDay) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, start, end, allDay], (err, result) => {
    if (err) return res.status(500).json({ error: "Error agregando evento" });
    res.json({ id: result.insertId, title, start, end, allDay });
  });
});

app.delete("/events/:id", (req, res) => {
  const sql = "DELETE FROM eventos WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error eliminando evento" });
    res.json({ message: "Event deleted successfully" });
  });
});

app.listen(port, () => {
  console.log("RUNNING");
});

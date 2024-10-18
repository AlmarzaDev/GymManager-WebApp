const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");
const { v4: uuid4v } = require("uuid");

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

app.post("/add_client", (req, res) => {
  const id = uuid4v();
  sql =
    "INSERT INTO clientes (`ClienteID`, `Nombre`, `Apellido`, `Cedula`, `Edad`, `Email`, `Telefono`, `Direccion`, `FechaRegistro`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    id,
    req.body.firstName,
    req.body.lastName,
    req.body.cedula,
    req.body.age,
    req.body.email,
    req.body.contact,
    req.body.address,
    req.body.date,
  ];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({
        message: "Algo salio horriblemente mal. Fijate: " + err,
      });
    return res.json({ success: "Cliente añadido exitosamente!" });
  });
});

app.post("/add_payment", (req, res) => {
  const id = uuid4v();
  const sql =
    "INSERT INTO pagos (`PagoID`, `ClienteID`, `Monto`, `FechaPago`) VALUES (?, ?, ?, ?)";
  const values = [id, req.body.clientID, req.body.amount, req.body.date];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({
        message: "Algo salio horriblemente mal. Fijate: " + err,
      });
    return res.json({ success: "Pago procesado exitosamente!" });
  });
});

app.get("/get_clients", (req, res) => {
  const sql = "SELECT * FROM clientes";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Error del servidor" });
    return res.json(result);
  });
});

app.get("/get_payments", (req, res) => {
  const sql =
    "SELECT c.ClienteID, c.Nombre AS firstName, c.Apellido AS lastName, p.Monto AS amount, p.FechaPago AS date, c.Telefono AS phone, c.Email AS email FROM clientes c JOIN pagos p ON c.ClienteID = p.ClienteID WHERE p.FechaPago = (SELECT MAX(p2.FechaPago) FROM pagos p2 WHERE p2.ClienteID = c.ClienteID);";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Error del servidor" });
    return res.json(result);
  });
});

app.listen(port, () => {
  console.log("PREPULISTO");
});

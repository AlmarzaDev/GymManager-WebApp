import { useEffect, useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./scenes/login";
import Profile from "./scenes/profile";
import Settings from "./scenes/settings";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Clients from "./scenes/clients";
import Invoices from "./scenes/invoices";
import AttendanceHistory from "./scenes/history";
import ClientForm from "./scenes/clientForm";
import EditForm from "./scenes/editForm";
import AttendanceForm from "./scenes/attendanceForm";
import PayForm from "./scenes/payForm";
import Calendar from "./scenes/calendar";
import Bar from "./scenes/bar";
import Pie from "./scenes/pie";
import Line from "./scenes/line";
import axios from "axios";

function App() {
  const [theme, colorMode] = useMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://localhost:5000/auth/verifyToken", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setIsAuthenticated(true);
          setUser(response.data.user);
        })
        .catch(() => {
          setIsAuthenticated(false);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuthenticated && <Sidebar />}
          <main className="content">
            {isAuthenticated && <Topbar user={user} onLogout={handleLogout} />}
            <Routes>
              <Route
                path="/login"
                element={
                  <Login
                    setUser={setUser}
                    setIsAuthenticated={setIsAuthenticated}
                  />
                }
              />
              <Route
                path="/"
                element={isAuthenticated ? <Dashboard /> : <Login />}
              />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/settings" element={<Settings user={user} />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/attendance" element={<AttendanceForm />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/history" element={<AttendanceHistory />} />
              <Route path="/form" element={<ClientForm />} />
              <Route path="/edit" element={<EditForm />} />
              <Route path="/pay" element={<PayForm />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

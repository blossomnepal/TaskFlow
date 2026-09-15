import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
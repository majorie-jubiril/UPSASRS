import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./pages/Layout";

import Dashboard from "./pages/Dashboard";
import RequestSelector from "./RequestSelector";
import FormRenderer from "./FormRenderer";
import PaymentPage from "./pages/PaymentPage";
import ReviewPage from "./pages/ReviewPage";
import RequestDetails from "./pages/RequestDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDetails from "./pages/AdminDetails";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/select-type" element={<RequestSelector />} />
        <Route path="/form" element={<FormRenderer />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/request/:id" element={<RequestDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:id" element={<AdminDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
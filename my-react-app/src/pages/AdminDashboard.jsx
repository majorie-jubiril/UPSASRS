import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TYPE_LABELS = {
  transcript: "Transcript Request",
  englishProficiency: "English Proficiency Letter",
  introLetter: "Introductory Letter",
  idCard: "ID Card Replacement",
  remarking: "Remarking of Scripts",
  refund: "Refund Request"
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(stored);
  }, []);

  const [activeFilter, setActiveFilter] = useState("All");
  const filtered =
  activeFilter === "All"
    ? requests
    : requests.filter(r => r.status === activeFilter);

  return (
    <div className="container">
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Manage and process student requests</p>
      </div>

      {/* FILTERS */}
      <div className="admin-filters">
        {["All", "Pending", "In Progress", "Completed"].map((status) => (
          <button
            key={status}
            className={`filter-btn ${activeFilter === status ? "active" : ""}`}
            onClick={() => setActiveFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* REQUEST LIST */}
      <div className="admin-request-list">
        {filtered.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          filtered.map(req => (
            <div className="admin-card" key={req.id}>
              <div className="admin-card-header">
                <h3>{TYPE_LABELS[req.type] || req.type}</h3>
                <span className={`status-badge ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </div>

              <div className="admin-card-body">
                <p><strong>ID:</strong> {req.id}</p>
                <p><strong>Date:</strong> {req.date}</p>
              </div>

              <div className="admin-card-actions">
                <button
                  className="primary-btn"
                  onClick={() => navigate(`/admin/${req.id}`)}
                >
                  Manage Request
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatType(type) {
  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
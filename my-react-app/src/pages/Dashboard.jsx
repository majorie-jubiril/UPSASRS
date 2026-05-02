import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const STATUS_STEPS = [
  "Submitted",
  "Pending",
  "In Progress",
  "Completed",
  "Fulfilled",
];

const TYPE_LABELS = {
  transcript: "Transcript Request",
  attestation: "Attestation Letter",
  englishProficiency: "English Proficiency Letter",
  introLetter: "Introduction Letter",
  idCard: "ID Card Replacement",
  remarking: "Remarking of Scripts",
  refund: "Refund Request",
};

function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(stored);
  }, []);

  return (
    <>
      <div className="dashboard-header">
        <h3>My Requests</h3>

        <button
          className="primary-btn"
          onClick={() => navigate("/select-type")}
        >
          New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <p>No requests yet</p>
      ) : (
        <div className="dashboard-grid">
          {requests.map((req) => (
            <div key={req.id} className="dashboard-card">

              <h3 className="request-title">
                {TYPE_LABELS[req.type] || req.type}
              </h3>

              <span className="status-badge">
                {req.status}
              </span>

              <div className="progress-bar">
                {STATUS_STEPS.map((step, index) => {
                  const currentIndex = STATUS_STEPS.indexOf(req.status);

                  return (
                    <div
                      key={step}
                      className={`progress-step ${
                        index <= currentIndex ? "active" : ""
                      }`}
                    />
                  );
                })}
              </div>

              {/* ✅ INSERT HERE */}
              <div className="card-meta">
                <p>📄 {req.details?.requestSpeed || "Regular"}</p>
                <p>📦 {req.details?.deliveryMethod || "Not specified"}</p>
                <p>📅 {req.date || "—"}</p>
              </div>

              <button
                className="secondary-btn"
                onClick={() => navigate(`/request/${req.id}`)}
              >
                View Details
              </button>

            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Dashboard;
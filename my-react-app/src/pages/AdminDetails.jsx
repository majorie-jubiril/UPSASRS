import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const FIELD_LABELS = {
  requestSpeed: "Service Type",
  deliveryMethod: "Delivery Method"
};

export default function AdminDetails() {
  const [isValidated, setIsValidated] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);

  useEffect(() => {
    const requests = JSON.parse(localStorage.getItem("requests")) || [];
    const found = requests.find(r => String(r.id) === id);


    if (!found) {
      alert("Request not found");
      navigate("/admin");
      return;
    }

    setRequest(found);
    setIsValidated(found?.paymentValidated || false);
  }, [id]);

  if (!request) return null;

  const updateStorage = (updated) => {
    const all = JSON.parse(localStorage.getItem("requests")) || [];
    const newList = all.map(r => r.id === updated.id ? updated : r);
    localStorage.setItem("requests", JSON.stringify(newList));
    setRequest(updated);
  };

  // ===== VALIDATE PAYMENT =====
  const validatePayment = () => {
    const updated = { ...request };
    updated.payment.validated = true;

    updated.audit = updated.audit || [];
    updated.audit.push({
      action: "Payment validated",
      timestamp: new Date().toLocaleString()
    });

    updateStorage(updated);
  };

  // ===== STATUS UPDATE =====
  const updateStatus = (newStatus) => {
    const flow = ["Submitted", "Pending", "In Progress", "Completed"];

    const currentIndex = flow.indexOf(request.status);
    const newIndex = flow.indexOf(newStatus);

    if (newIndex > currentIndex + 1) {
      alert("Cannot skip steps");
      return;
    }

    if (
      (newStatus === "In Progress" || newStatus === "Completed") &&
      !request.payment?.validated
    ) {
      alert("Validate payment first");
      return;
    }

    const updated = { ...request, status: newStatus };

    updated.audit = updated.audit || [];
    updated.audit.push({
      action: `Status updated to ${newStatus}`,
      timestamp: new Date().toLocaleString()
    });

    updateStorage(updated);
  };

  return (
    <div className="container">

      <span className="back-arrow" onClick={() => navigate("/admin")}>
        ← Back
      </span>

      <div className="page-header">
        <h2>{formatType(request.type)}</h2>
        <p>{request.id}</p>
      </div>

      <div className="admin-details-grid">

        {/* REQUEST INFO */}
        <div className="details-card">
          <h3>Request Information</h3>
          <p><strong>Status:</strong> {request.status}</p>
          <p><strong>Date:</strong> {request.date}</p>
        </div>

        {/* STUDENT */}
        <div className="details-card">
          <h3>Student Details</h3>
          <p>
            <strong>{FIELD_LABELS.requestSpeed}:</strong>{" "}
            {request.details?.requestSpeed || "-"}
          </p>

          <p>
            <strong>{FIELD_LABELS.deliveryMethod}:</strong>{" "}
            {request.details?.deliveryMethod || "-"}
          </p>
        </div>

        {/* PAYMENT */}
        <div className="details-card">
          <h3>Payment Validation</h3>
          <p>Proof: {request.payment?.proofUploaded ? "Uploaded" : "Missing"}</p>
          <p>Validated: {request.payment?.validated ? "Yes" : "No"}</p>

          <button
            className="primary-btn"
            disabled={isValidated}
            onClick={() => {
              if (isValidated) return;

              // 1. Create updated request object
              const updatedRequest = {
                ...request,
                payment: {
                  ...request.payment,
                  validated: true
                }
              };

              // 2. Save to localStorage
              updateStorage(updatedRequest);

              // 3. Update React state
              setRequest(updatedRequest);
              setIsValidated(true);
            }}
          >
            {isValidated ? "Payment Validated" : "Validate Payment"}
          </button>
        </div>

        {/* STATUS */}
        <div className="details-card">
          <h3>Update Status</h3>

          <select
            value={request.status}
            onChange={(e) => updateStatus(e.target.value)}
          >
            <option>Submitted</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* AUDIT */}
        <div className="details-card">
          <h3>Audit Trail</h3>

          {(request.audit || []).length === 0 ? (
            <p>No activity yet</p>
          ) : (
            request.audit.map((a, i) => (
              <div key={i}>
                <p><strong>{a.action}</strong></p>
                <small>{a.timestamp}</small>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

function formatType(type) {
  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
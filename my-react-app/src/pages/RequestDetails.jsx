import { useParams, useNavigate } from "react-router-dom";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const requests = JSON.parse(localStorage.getItem("requests")) || [];
  const req = requests.find(r => String(r.id) === id);

  const TYPE_LABELS = {
    transcript: "Transcript Request",
    englishProficiency: "English Proficiency Letter",
    introLetter: "Introductory Letter",
    idCard: "ID Card Replacement",
    remarking: "Remarking of Scripts",
    refund: "Refund Request"
  };

  if (!req) return <p>Request not found</p>;

  const steps = ["Submitted", "Pending", "In Progress", "Completed"];
  const currentIndex = Math.max(steps.indexOf(req.status), 0);

  return (
    <div className="container details-page">

      {/* HEADER */}
      <div className="page-header">
        <span className="back-arrow" onClick={() => navigate("/")}>←</span>
        <div className="title-group">
          <p className="page-label">Request Details</p>
          <h2>{TYPE_LABELS[req.type] || req.type}</h2>
          <p>Request #{req.id}</p>
        </div>
      </div>

      {/* STATUS */}
      <div className="status-card">
        <h3>Status</h3>

        <div className="status-tracker">

          <div className="tracker-line"></div>

          <div
            className="tracker-progress"
            style={{
              width: `${(currentIndex / (steps.length - 1)) * 100}%`
            }}
          ></div>

          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <div className="tracker-step" key={step}>
                <div className={`node ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}>
                  {isCompleted ? "✔" : ""}
                </div>
                <p>{step}</p>
              </div>
            );
          })}

        </div>
      </div>

      {/* PAYMENT */}
      <div className="info-card">
        <h3>Payment</h3>

        <div className="info-row">
            <div className="info-icon">📤</div>
            <div>
            <p>
                <strong>Proof of Payment:</strong>{" "}
                {req.payment?.proofUploaded ? "Uploaded" : "Pending"}
            </p>
            </div>
        </div>

        <div className={`status-pill ${req.payment?.validated ? "success" : "pending"}`}>
            {req.payment?.validated ? "Validated ✓" : "Not Validated"}
        </div>
        </div>

      {/* PROCESSING */}
      <div className="info-card">
        <h3>Processing</h3>

        <div className="info-row">
            <div className="info-icon">⏳</div>
            <div>
            <p><strong>Status:</strong> {req.status}</p>
            <p><strong>Service Type:</strong> {req.details?.requestSpeed}</p>
            <p><strong>Submitted:</strong> {req.date}</p>
            </div>
        </div>
        </div>

      {/* DELIVERY */}
      <div className="info-card">
        <h3>Delivery</h3>

        <div className="info-row">
            <div className="info-icon"></div>
            <div>
            <p><strong>Delivery Method</strong></p>

            {req.details?.deliveryMethod?.includes("Email") && (
                <p><strong>📧 Email:</strong> {req.details.deliveryMethod.replace("Email to ", "")}</p>
            )}

            {req.details?.deliveryMethod === "Pick up" && (
                <p><strong>📦 Pickup</strong></p>
            )}
            </div>
        </div>
        </div>

    </div>
  );
}
import { useLocation, useNavigate } from "react-router-dom";

export default function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state?.formData || {};
  const file = location.state?.file;

  const TYPE_LABELS = {
  transcript: "Transcript Request",
  attestation: "Attestation Letter",
  englishProficiency: "English Proficiency Letter",
  introLetter: "Introductory Letter",
  idCard: "ID Card Replacement",
  remarking: "Remarking of Scripts",
  refund: "Refund Request"
};

const formattedTitle =
  TYPE_LABELS[formData.requestType] || "N/A";

  if (!formData) {
    return <p>No data to review</p>;
  }

  return (
    <div className="container">

      {/* TOP BAR */}
      <div className="top-bar">
        <span className="back-arrow">←</span>
        <div className="top-text">
          <h3>Review & Submit</h3>
          <p>Step 4 of 5</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="progress-bar">
        <div className="step active"></div>
        <div className="step active"></div>
        <div className="step active"></div>
        <div className="step active"></div>
        <div className="step"></div>
      </div>

      <h2>Review Your Request</h2>

      <div className="summary-card">
        <div className="review-grid">

          {/* LEFT */}
          <div className="review-col">

            <div className="summary-section">
              <h3>Request Information</h3>
              <p><strong>Type:</strong> {formattedTitle}</p>
              <p><strong>Service:</strong> {formData.service}</p>
            </div>

            <div className="summary-section">
              <h3>Student Details</h3>
              <p><strong>Name:</strong> {formData.fullName}</p>
              <p><strong>ID:</strong> {formData.studentId}</p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="review-col">

            <div className="summary-section">
              <h3>Delivery Method</h3>
              <p>
                {formData.sendToInstitution && formData.institutionEmail
                  ? `Email to: ${formData.institutionEmail}`
                  : "Pick up"}
              </p>
            </div>

            <div className="summary-section">
              <h3>Payment Details</h3>
              <p>Paid via UFIS</p>
            </div>

            <div className="summary-section">
              <h3>Proof of Payment</h3>
              <p>{file?.name || "No file uploaded"}</p>
            </div>

          </div>

        </div>
      </div>

      <br />

      <div className="submit-row">
        <button
          className="primary-btn"
          onClick={() => {
            const existing = JSON.parse(localStorage.getItem("requests")) || [];

            const newRequest = {
              id: Date.now(),
              type: formData.requestType,
              status: "Submitted",
              date: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }),

              details: {
                requestSpeed: formData.service,
                deliveryMethod: formData.sendToInstitution
                  ? `Email to ${formData.institutionEmail}`
                  : "Pick up"
              },

              payment: {
                proofUploaded: !!file
              },

              student: {
                name: formData.fullName,
                id: formData.studentId
              }
            };

            localStorage.setItem("requests", JSON.stringify([...existing, newRequest]));

            alert("Request Submitted");
            navigate("/");
          }}
        >
          Submit Request
        </button>
      </div>

    </div>
  );
}
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const formattedTitle = formData?.requestType
    ? formData.requestType
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "N/A";

  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;
    setFileUploaded(true);
  };

  if (!formData) {
    return <p>No form data received</p>;
  }

  return (
    <div className="container">

      {/* TOP BAR */}
      <div className="top-bar">
        <span className="back-arrow">←</span>
        <div className="top-text">
          <h3>Payment Upload</h3>
          <p>Step 3 of 5</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="progress-bar">
        <div className="step active"></div>
        <div className="step active"></div>
        <div className="step active"></div>
        <div className="step"></div>
        <div className="step"></div>
      </div>

      {/* HEADER */}
      <div className="section-header">
        <h2>Payment & Upload</h2>
        <p>Complete your payment, then upload your proof to proceed.</p>
      </div>

      {/* PAYMENT CARD */}
      <div className="payment-card">
        <div className="card-header">
          <h3>1. Make Payment</h3>
          <span className="badge">External</span>
        </div>

        <div className="card-body">
          <p><strong>Pay for:</strong> {formattedTitle}</p>
          <p><strong>Service Type:</strong> {formData.service}</p>

          <div className="button-row">
            <a
              href="https://student.upsa-ufis.com/#/auth/login"
              target="_blank"
              className="primary-btn"
            >
              Pay via UFIS
            </a>
          </div>

          <p className="note">
            You will be redirected to the official UPSA payment platform.
          </p>
        </div>
      </div>

      {/* UPLOAD SECTION */}
      <div className="upload-section">

        <div className="card-header">
          <h3>2. Upload Disbursement Slip</h3>
          <span className={`badge ${file ? "success" : "pendssing"}`}>
            {file ? "Uploaded" : "Pending"}
          </span>
        </div>

        <div
          className={`upload-box ${file ? "uploaded" : ""}`}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <input
            type="file"
            id="fileInput"
            hidden
            onChange={(e) => {
              const selected = e.target.files[0];
              if (selected) {
                setFile(selected);
              }
            }}
          />

          <div className="upload-content">
            <div className="upload-icon">
              {file ? "✔️" : "⬆️"}
            </div>

            <p>
              <strong>
                {file
                  ? "File Uploaded Successfully"
                  : "Click to upload disbursement slip"}
              </strong>
            </p>

            <p>
              {file ? file.name : "JPG, PNG or PDF"}
            </p>
          </div>
        </div>

        <div className="info-box">
          Your payment will be reviewed and validated by staff before processing begins.
        </div>

      </div>

      {/* CONTINUE BUTTON */}
      <div className="button-row">
        <button
          className="primary-btn"
          disabled={!file}
          onClick={() =>
            navigate("/review", {
              state: {
                formData,
                file
              }
            })
          }
        >
          Upload & Continue
        </button>
      </div>

    </div>
  );
}
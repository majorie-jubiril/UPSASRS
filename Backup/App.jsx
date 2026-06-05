import { useState, useEffect } from "react";
import RequestSelector from "./RequestSelector";
import FormRenderer from "./FormRenderer";
import "./App.css";
import { useNavigate } from "react-router-dom";


const FORM_STEPS = [
  "Request Type",
  "Request Details",
  "Payment Upload",
  "Review"
];

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
  refund: "Refund Request"
};

function App() {
  // ✅ ALL HOOKS INSIDE COMPONENT
  const [requests, setRequests] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [requestType, setRequestType] = useState("");
  const [view, setView] = useState("dashboard");
  const [tempRequest, setTempRequest] = useState({}); 
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(stored);
  }, []);

  function handleNewRequest(newRequest) {
    const updated = [...requests, newRequest];
    setRequests(updated);
    localStorage.setItem("requests", JSON.stringify(updated));
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>UPSA Request System</h2>

      {/* ================= DASHBOARD ================= */}
      {view === "dashboard" && (
        <>
          <div className="dashboard-header">
            <h3>My Requests</h3>

            <button
              className="primary-btn"
              onClick={() => {
                setCurrentStep(0);
                setView("select-type");
              }}
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

                  {/* TITLE + STATUS */}
                  <h3 className="request-title">
                    {TYPE_LABELS[req.type] || req.type}
                  </h3>

                  <span className="status-badge">
                    {req.status}
                  </span>

                  {/* PROGRESS BAR */}
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

                  {/* META INFO */}
                  <div className="request-meta">
                    <p>📄 {req.processingType}</p>

                    <p>
                      📦{" "}
                      {req.delivery?.method === "email"
                        ? req.delivery.value
                        : req.delivery?.location
                          ? `Pick up – ${req.delivery.location}`
                          : "Pick up"}
                    </p>

                    <p>
                      📅 {new Date(req.createdAt).toLocaleString("en-GB")}
                    </p>
                  </div>

                  {/* CTA */}
                  <button
                    className="details-btn"
                    onClick={() => navigate(`/request/${req.id}`)}
                  >
                    View Details
                  </button>

                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ================= STEP 1: SELECT TYPE ================= */}
      {view === "select-type" && (
        <>
          {/* 🔵 PROGRESS BAR */}
          <div className="form-progress">
            <div className="form-progress-header">
              <h3>{FORM_STEPS[0]}</h3>
              <span>Step 1 of {FORM_STEPS.length}</span>
            </div>

            <div className="form-progress-bar">
              {FORM_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`form-step ${
                    index <= 0 ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ✅ CLICKABLE CARDS FIXED HERE */}
          <RequestSelector
            onSelect={(type) => {
              setRequestType(type);
              setCurrentStep(1);
              setView("form"); // 🔥 immediate navigation
            }}
          />
        </>
      )}

      {/* ================= FORM FLOW ================= */}
      {view === "form" && (
        <>
          <div className="form-progress">
            <div className="form-progress-header">
              <h3>{FORM_STEPS[currentStep]}</h3>
              <span>
                Step {currentStep + 1} of {FORM_STEPS.length}
              </span>
            </div>

            <div className="form-progress-bar">
              {FORM_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`form-step ${
                    index <= currentStep ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 2: DETAILS */}
          {currentStep === 1 && (
            <FormRenderer
              type={requestType}
              onSubmitRequest={(formData) => {
                console.log("FORM DATA:", formData);
                
                setTempRequest({
                  ...formData,
                  type: requestType,
                  processingType: formData.processingType || "Regular"
                });
                setCurrentStep(2);
              }}
            />
          )}

          {/* STEP 3: PAYMENT */}
         {currentStep === 2 && (
          <div className="payment-page">

            <h2>Payment & Upload</h2>
            <p className="payment-subtext">
              Complete your payment, then upload your proof to proceed.
            </p>

            {/* ================= 1. UFIS PAYMENT ================= */}
            <div className="payment-card">
              <h3>1. Make Payment</h3>
              <span className="badge external">External</span>

              <p className="payment-title">
                  Pay for: {TYPE_LABELS[requestType] || requestType}
              </p>

              <button
                className="ufis-btn"
                onClick={() => {
                  window.open("https://upsasrs.netlify.app", "_blank");
                }}
              >
                Pay via UFIS
              </button>

              <p className="payment-note">
                You will be redirected to the official UPSA payment platform.
              </p>
            </div>

            {/* ================= 2. UPLOAD ================= */}
            <div className="payment-card">

              <h3>2. Upload Disbursement Slip</h3>
              <span className={`badge ${file ? "success" : "pending"}`}>
                {file ? "Uploaded" : "Pending"}
              </span>

              <div
                className={`upload-box ${file ? "active" : ""}`}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <div className="upload-icon">
                  {file ? "✔️" : "⬆️"}
                </div>

                <p className="upload-text">
                  {file
                    ? "File Uploaded Successfully"
                    : "Click to upload disbursement slip"}
                </p>

                <small className="upload-subtext">
                  {file ? file.name : "JPG, PNG or PDF"}
                </small>
              </div>

              <input
                id="fileInput"
                type="file"
                hidden
                onChange={(e) => {
                  const selected = e.target.files[0];
                  if (selected) {
                    setFile(selected);
                  }
                }}
              />

              <p className="upload-note">
                Your payment will be reviewed and validated by staff before processing begins.
              </p>
            </div>

            {/* ================= CONTINUE BUTTON ================= */}
            <button
              className="primary-btn"
              disabled={!file}
              onClick={() => setCurrentStep(3)}
            >
              Upload & Continue
            </button>

          </div>
        )}

          {currentStep === 3 && (
            <div className="review-page">

              <h2>Review Your Request</h2>

              <div className="review-grid">

                {/* Request Info */}
                <div className="review-card">
                  <h3>Request Information</h3>
                  <p><strong>Type:</strong> {TYPE_LABELS[requestType] || requestType}</p>
                </div>

                {/* Delivery */}
                <div className="review-card">
                  <h3>Delivery Method</h3>
                  <p><strong>Method:</strong> {tempRequest.deliveryMethod || "Not specified"}</p>
                </div>

                {/* Student */}
                <div className="review-card">
                  <h3>Student Details</h3>
                  <p><strong>Full Name:</strong> {tempRequest.fullName}</p>
                  <p><strong>Student ID:</strong> {tempRequest.studentId}</p>
                  <p><strong>Reason:</strong> {tempRequest.reason || "-"}</p>
                </div>

                {/* Payment */}
                <div className="review-card">
                  <h3>Payment Details</h3>
                  <p>Status: Document Uploaded</p>
                </div>

                {/* Proof */}
                <div className="review-card">
                  <h3>Proof of Payment</h3>
                  <p><strong>File:</strong> {file?.name}</p>
                </div>

              </div>

              <button
                className="primary-btn submit-btn"
                onClick={() => {
                  const isEmail = tempRequest.sendToInstitution === "on";

                  const finalRequest = {
                    ...tempRequest,

                    // ✅ Single source of truth for processing
                    processingType:
                      tempRequest.service || tempRequest.processingType || "Regular",

                    // ✅ Delivery normalized
                    delivery: {
                      method: isEmail ? "email" : "pickup",
                      value: isEmail ? tempRequest.institutionEmail : null,
                    },

                    fileName: file?.name,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                    status: "Submitted",
                  };

                  console.log("FINAL REQUEST:", finalRequest);
                  handleNewRequest(finalRequest);

                  // ✅ Show success feedback
                  setShowModal(true);

                  // ✅ Reset state
                  setView("dashboard");
                  setCurrentStep(0);
                  setFile(null);
                  setTempRequest({});
                  setRequestType("");
                }}
              >
                Submit Request
              </button>

            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Request submitted successfully!</h3>

            <button
              className="modal-btn"
              onClick={() => {
                setShowModal(false);

                // reset + redirect
                setView("dashboard");
                setCurrentStep(0);
                setFile(null);
                setTempRequest({});
                setRequestType("");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
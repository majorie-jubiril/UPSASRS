import { useState } from "react";

export default function TranscriptForm() {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [requestSpeed, setRequestSpeed] = useState("");
  const [sendToInstitution, setSendToInstitution] = useState(false);
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    const requestData = {
      id: Date.now(),

      type: "transcript",

      student: {
        fullName,
        studentId,
      },

      requestDetails: {
        quantity,
        serviceType: requestSpeed,
      },

      delivery: {
        sendToInstitution,
        email: sendToInstitution ? email : null,
      },

      status: "Submitted",
      date: new Date().toISOString(),
    };

    // 👉 Save to localStorage
    const existing =
      JSON.parse(localStorage.getItem("requests")) || [];

    const updated = [...existing, requestData];

    localStorage.setItem("requests", JSON.stringify(updated));

    console.log("Saved:", requestData);
  }

  return (

      <form className="form-wrapper" onSubmit={handleSubmit}>

  <h3>Transcript Request</h3>

    {/* Student Information */}
    <div className="form-section">
      <h4 className="section-title">Student Information</h4>

      <div className="form-row">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Student ID</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* Request Details */}
    <div className="form-section">
      <h4 className="section-title">Request Details</h4>

      <div className="form-row">
        <div className="form-group">
          <label>Number of Copies</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Service Type</label>
          <select
            value={requestSpeed}
            onChange={(e) => setRequestSpeed(e.target.value)}
          >
            <option value="">Select service type</option>
            <option value="regular">Regular</option>
            <option value="express">Express</option>
          </select>
        </div>
      </div>
    </div>

    {/* Delivery */}
    <div className="form-section">
      <h4 className="section-title">Delivery Instructions</h4>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={sendToInstitution}
            onChange={(e) => setSendToInstitution(e.target.checked)}
          />
          Send to institution
        </label>
      </div>

      {sendToInstitution && (
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}
    </div>
        
      <button type="submit">Submit</button>

</form>
  );
}
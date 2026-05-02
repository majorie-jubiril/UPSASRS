import { useState } from "react";

export default function IDCardForm({ onSubmitRequest }) {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [reason, setReason] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const newRequest = {
      id: Date.now(),
      type: "id-card",
      student: {
        fullName,
        studentId,
      },
      requestDetails: {
        reason,
      },
      status: "Submitted",
    };

    onSubmitRequest(newRequest);

    // Reset form
    setFullName("");
    setStudentId("");
    setReason("");
  }

    return (
        <div className="form-wrapper">
            <h2>ID Card Replacement</h2>

            <form onSubmit={handleSubmit}>

            <div className="form-section">
                <div className="section-title">Student Information</div>

                <div className="form-row">
                <div className="form-group">
                    <input
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <input
                    placeholder="Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    />
                </div>
                </div>
            </div>

            <div className="form-section">
                <div className="section-title">Request Details</div>

                <div className="form-row">
                <div className="form-group">
                    <input
                    placeholder="Reason for replacement (lost, damaged, etc.)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                </div>
            </div>

            <button type="submit">Submit</button>

            </form>
        </div>
    );
}
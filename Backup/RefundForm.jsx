export default function RefundForm({ onSubmitRequest }) {
  function handleSubmit(e) {
    e.preventDefault();

    const newRequest = {
      type: "refund",
      name: e.target.name.value,
      studentId: e.target.studentId.value,
      date: e.target.date.value,
      currency: e.target.currency.value,
      amount: e.target.amount.value,
      reason: e.target.reason.value,
      status: "Submitted"
    };

    onSubmitRequest(newRequest);
  }

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <h2>Request for Refund</h2>

      {/* Student Info */}
      <div className="form-section">
        <p className="section-title">STUDENT INFORMATION</p>

        <div className="form-row">
          <div className="form-group">
            <input name="name" placeholder="Full Name" required />
          </div>

          <div className="form-group">
            <input name="studentId" placeholder="Student ID" required />
          </div>
        </div>
      </div>

      {/* Request Details */}
      <div className="form-section">
        <p className="section-title">REQUEST DETAILS</p>

        {/* Row 1 */}
        <div className="form-row">
          <div className="form-group">
            <input type="date" name="date" required />
          </div>

          <div className="form-group">
            <select name="currency" required>
              <option value="">Select currency</option>
              <option value="GHS">GHS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="form-row">
          <div className="form-group">
            <input name="amount" type="number" min="0" placeholder="Amount Paid" required />
          </div>
        </div>

        {/* Row 3 */}
        <div className="form-row">
          <div className="form-group">
            <input name="reason" placeholder="Reason for refund" required />
          </div>
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
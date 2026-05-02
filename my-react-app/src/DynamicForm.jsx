import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DynamicForm({ config, requestType }) {

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  // ✅ FIXED: now globally available inside component
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();

    const formDataObj = new FormData(e.target);
    const data = {
      ...Object.fromEntries(formDataObj.entries()),
      requestType
    };

    // ✅ DELIVERY VALIDATION
    const newErrors = {};

    if (data.sendToInstitution === "on" && !data.institutionEmail) {
    newErrors.institutionEmail = "Email is required";
    }

    if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
    }

    navigate("/payment", { state: { formData: data } });
  }

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <h2>{config.title}</h2>

      {config.sections.map((section, i) => {
        if (section.type === "delivery") {
            return (
            <div key={i} className="form-section">
                <h4 className="section-title">{section.title}</h4>

                <div className="form-group checkbox-group">
                <label>
                    <input
                    type="checkbox"
                    name="sendToInstitution"
                    onChange={handleChange}
                    />
                    Send to institution
                </label>
                </div>

                {formData.sendToInstitution && (
                    <div className="form-group">
                        <input
                        type="email"
                        name="institutionEmail"
                        placeholder="Institution Email Address"
                        onChange={handleChange}
                        />

                        {errors.institutionEmail && (
                        <p className="error-text">{errors.institutionEmail}</p>
                        )}
                    </div>
                    )}
            </div>
            );
        }

        return (
            <div key={i} className="form-section">
            <p className="section-title">{section.title}</p>

            {section.rows.map((row, j) => (
                <div key={j} className="form-row">
                {row.map((field, k) => (
                    <div key={k} className="form-group">
                    {field.type === "select" ? (
                        <select name={field.name} onChange={handleChange} required>
                        <option value="">{field.placeholder}</option>
                        {field.options.map((opt, idx) => (
                            <option key={idx} value={opt}>
                            {opt}
                            </option>
                        ))}
                        </select>
                    ) : (
                        <input
                        type={field.type || "text"}
                        name={field.name}
                        placeholder={field.placeholder}
                        onChange={handleChange}
                        required
                        />
                    )}
                    </div>
                ))}
                </div>
            ))}
            </div>
        );
        })}

      <button type="submit" className="primary-btn">
        Continue
      </button>
    </form>
  );
}
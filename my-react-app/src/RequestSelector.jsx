import { useNavigate } from "react-router-dom";
export default function RequestSelector({ onSelect }) {
  const navigate = useNavigate();
  const requestTypes = [
    {
      type: "transcript",
      title: "Transcript Request",
      description: "Official academic transcript",
      icon: "📄",
    },
    {
      type: "introLetter",
      title: "Introductory Letter",
      description: "Letter of introduction",
      icon: "📘",
    },
    {
      type: "attestation",
      title: "Attestation Letter",
      description: "Letter of attestation",
      icon: "🎓",
    },
    {
      type: "idCard",
      title: "ID Card Replacement",
      description: "Student ID replacement",
      icon: "🪪",
    },
    {
      type: "englishProficiency",
      title: "English Proficiency Letter",
      description: "Proof of English proficiency",
      icon: "🌍",
    },
    {
      type: "remarking",
      title: "Remarking of Scripts",
      description: "Request for script review",
      icon: "✏️",
    },
    {
      type: "refund",
      title: "Request for Refund",
      description: "Fee refund request",
      icon: "💰",
    },
  ];

  return (
    <div className="request-grid">
      {requestTypes.map((req) => (
        <div
          key={req.type}
          className="request-card"
         onClick={() => navigate("/form", { state: { type: req.type } })}
        >
          <div className="icon">{req.icon}</div>
          <h3>{req.title}</h3>
          <p>{req.description}</p>
        </div>
      ))}
    </div>
  );
}
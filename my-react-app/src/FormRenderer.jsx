import DynamicForm from "./DynamicForm";
import FORM_CONFIG from "./formConfig";
import { useLocation } from "react-router-dom";

export default function FormRenderer() {
  const location = useLocation();
  const type = location.state?.type;

  if (!type) {
    return <p>Please select a request type</p>;
  }

  const config = FORM_CONFIG[type];

  if (!config) return <p>Form not found</p>;

  return (
    <DynamicForm
      config={config}
      requestType={type}
    />
  );
}
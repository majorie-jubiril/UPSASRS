import DynamicForm from "./DynamicForm";
import FORM_CONFIG from "./formConfig";

export default function FormRenderer({ type, onSubmitRequest }) {
  if (!type) return <p>Please select a request type</p>;

  const config = FORM_CONFIG[type];

  if (!config) return <p>Form not found</p>;

  return (
    <DynamicForm
      config={config}
      onSubmitRequest={onSubmitRequest}
    />
  );
}
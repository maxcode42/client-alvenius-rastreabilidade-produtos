const { COMPONENT_VARIABLES } = require("types/component-variables");

export function validateFieldsComponent(obj) {
  const requiredFields = COMPONENT_VARIABLES;
  const missing = requiredFields.filter(
    (field) => !(field in obj) || !obj[field],
  );

  return {
    valid: missing.length === 0,
    missingFields: missing,
  };
}

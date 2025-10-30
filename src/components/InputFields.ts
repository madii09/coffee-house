
export function createInputField(id: string, placeholder: string, type = "text") {
  const wrapper = document.createElement("div");
  wrapper.className = "input-group";
  wrapper.innerHTML = `
    <input id="${id}" type="${type}" placeholder="${placeholder}" />
    <span class="icon error-icon">❌</span>
    <span class="icon success-icon">✔️</span>
    <div class="validation-msg"></div>
  `;
  return wrapper;
}

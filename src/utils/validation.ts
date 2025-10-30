export function $(sel: string): HTMLElement {
  const el = document.querySelector<HTMLElement>(sel);
  if (!el) throw new Error(`Element not found for selector: ${sel}`);
  return el;
}

export function showError(input: HTMLInputElement, msg: string) {
  const group = input.parentElement;
  if (!group) return;

  group.classList.add("error");
  group.classList.remove("success");

  const msgDiv = group.querySelector<HTMLElement>(".validation-msg");
  if (msgDiv) msgDiv.textContent = msg;
}

export function showSuccess(input: HTMLInputElement) {
  const group = input.parentElement;
  if (!group) return;

  group.classList.add("success");
  group.classList.remove("error");

  const msgDiv = group.querySelector<HTMLElement>(".validation-msg");
  if (msgDiv) msgDiv.textContent = "";
}

export function validateLogin(val: string): boolean {
  return /^[A-Za-z][A-Za-z]{2,}$/.test(val);
}

export function validatePassword(val: string): boolean {
  return /^(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/.test(val);
}

export function validateHouseNumber(val: string): boolean {
  return Number(val) > 1;
}

export function enableButtonIfValid(form: HTMLElement, btn: HTMLButtonElement) {
  const inputs = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select"));

  let allValid = true;

  for (const input of inputs) {
    if (input.type === "radio") {
      const groupName = input.name;
      const checked = form.querySelector<HTMLInputElement>(`input[name="${groupName}"]:checked`);
      if (!checked) {
        allValid = false;
        break;
      }
    } else if (input.tagName === "SELECT") {
      if (!input.value) {
        allValid = false;
        break;
      }
    } else {
      if (!input.parentElement?.classList.contains("success")) {
        allValid = false;
        break;
      }
    }
  }

  btn.disabled = !allValid;
}


import { $, showError, showSuccess, validateLogin, validatePassword, validateHouseNumber, enableButtonIfValid } from "../utils/validation";

const form = $("#register-form") as HTMLFormElement;
const submitBtn = $("#register-btn") as HTMLButtonElement;
const citySelect = $("#city") as HTMLSelectElement;
const streetSelect = $("#street") as HTMLSelectElement;
const formError = $("#form-error") as HTMLDivElement;

const streets: Record<string, string[]> = {
  City1: ["Street 1", "Street 2", "Street 3", "Street 4", "Street 5", "Street 6", "Street 7", "Street 8", "Street 9", "Street 10"],
  City2: ["Street 11", "Street 12", "Street 13", "Street 14", "Street 15", "Street 16", "Street 17", "Street 18", "Street 19", "Street 20"],
  City3: ["Street 21", "Street 22", "Street 23", "Street 24", "Street 25", "Street 26", "Street 27", "Street 28", "Street 29", "Street 30"],
};

citySelect.addEventListener("change", () => {
  const city = citySelect.value;
  streetSelect.innerHTML = "<option value=\"\">Select street</option>";
  if (streets[city]) {
    streets[city].forEach(street => {
      const option = document.createElement("option");
      option.value = street;
      option.textContent = street;
      streetSelect.appendChild(option);
    });
  }
  validateField(citySelect);
  validateField(streetSelect);
  enableButtonIfValid(form, submitBtn);
});

function validateField(input: HTMLInputElement | HTMLSelectElement): boolean {
  const val = input.value.trim();

  if (!val) {
    showError(input as HTMLInputElement, "Field cannot be empty");
    return false;
  }

  if (input.id === "login" && !validateLogin(val)) {
    showError(input as HTMLInputElement, "Login must start with a letter, min 3 letters, only English letters");
    return false;
  }

  if ((input.id === "password" || input.id === "confirm-password") && !validatePassword(val)) {
    showError(input as HTMLInputElement, "Password min 6 chars with 1 special char");
    return false;
  }

  if (input.id === "confirm-password" &&
    val !== (form.querySelector("#password") as HTMLInputElement).value) {
    showError(input as HTMLInputElement, "Passwords do not match");
    return false;
  }

  if (input.id === "house-number" && !validateHouseNumber(val)) {
    showError(input as HTMLInputElement, "House number must be > 1");
    return false;
  }

  if (input.name === "payment-method") {
    const checked = form.querySelector<HTMLInputElement>("input[name=\"payment-method\"]:checked");
    if (!checked) {
      showError(input as HTMLInputElement, "Please select payment method");
      return false;
    }
    const radios = form.querySelectorAll<HTMLInputElement>("input[name=\"payment-method\"]");
    radios.forEach(r => showSuccess(r));
    return true;
  }

  showSuccess(input as HTMLInputElement);
  return true;
}

const inputs = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select"));
inputs.forEach(input => {
  input.addEventListener("blur", () => { validateField(input); enableButtonIfValid(form, submitBtn); });
  input.addEventListener("input", () => { validateField(input); enableButtonIfValid(form, submitBtn); });
  input.addEventListener("change", () => { validateField(input); enableButtonIfValid(form, submitBtn); });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formError.textContent = "";

  try {
    const payload = {
      login: (form.querySelector("#login") as HTMLInputElement).value.trim(),
      password: (form.querySelector("#password") as HTMLInputElement).value.trim(),
      confirmPassword: (form.querySelector("#confirm-password") as HTMLInputElement).value.trim(),
      city: citySelect.value,
      street: streetSelect.value,
      houseNumber: Number((form.querySelector("#house-number") as HTMLInputElement).value),
      paymentMethod: (form.querySelector<HTMLInputElement>("input[name=\"payment-method\"]:checked")!).value.toLowerCase()
    };

    const res = await fetch("https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        showError(form.querySelector("#login") as HTMLInputElement, "This login already exists. Please choose another.");
      } else {
        formError.textContent = data.message || "Registration failed";
      }
      submitBtn.disabled = false;
      return;
    }

    const address = `${payload.city}, ${payload.street}, ${payload.houseNumber}`;
    localStorage.setItem("delivery_address", address);
    localStorage.setItem("access_token", data.data.access_token);

    formError.style.color = "#2e7d32";
    formError.textContent = "Successfully registered! Redirecting...";

    setTimeout(() => {
      location.href = "/menu.html";
    }, 2000);

  } catch (err) {
    formError.style.color = "#c62828";
    formError.textContent = "Registration failed: " + (err as Error).message;
    submitBtn.disabled = false;
  }
});



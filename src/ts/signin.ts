import { $, showError, showSuccess, validateLogin, validatePassword, enableButtonIfValid } from "../utils/validation";

const form = $("#signin-form") as HTMLFormElement;
const loginInput = $("#login") as HTMLInputElement;
const passwordInput = $("#password") as HTMLInputElement;
const submitBtn = $("#signin-btn") as HTMLButtonElement;
const formError = $("#form-error") as HTMLDivElement | null;

function validateField(input: HTMLInputElement): boolean {
  const val = input.value.trim();

  if (!val) {
    showError(input, "Field cannot be empty");
    return false;
  }

  if (input.id === "login" && !validateLogin(val)) {
    showError(input, "Login must start with a letter and be at least 3 letters");
    return false;
  }

  if (input.id === "password" && !validatePassword(val)) {
    showError(input, "Password must be at least 6 chars with 1 special char");
    return false;
  }

  showSuccess(input);
  return true;
}

[loginInput, passwordInput].forEach((input) => {
  const validateAndToggle = () => {
    validateField(input);
    enableButtonIfValid(form, submitBtn);
  };

  input.addEventListener("input", validateAndToggle);
  input.addEventListener("blur", validateAndToggle);

  input.addEventListener("focus", () => {
    const group = input.parentElement!;
    group.classList.remove("error", "success");
    group.querySelector(".validation-msg")!.textContent = "";
  });
});

submitBtn.disabled = true;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formError && (formError.textContent = "");

  const login = loginInput.value.trim();
  const password = passwordInput.value.trim();

  if (!validateField(loginInput) || !validateField(passwordInput)) {
    submitBtn.disabled = false;
    return;
  }

  try {
    const res = await fetch("https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(loginInput, "Incorrect login or password");
      showError(passwordInput, "");
      formError && (formError.textContent = data.message || "Sign in failed");
      submitBtn.disabled = false;
      return;
    }

    localStorage.setItem("access_token", data.data.access_token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    location.href = "/menu.html";
  } catch (err) {
    console.error("Sign in error:", err);
    formError && (formError.textContent = "Sign in failed. Please try again.");
    submitBtn.disabled = false;
  }
});

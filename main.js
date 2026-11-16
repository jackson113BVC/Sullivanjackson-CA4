const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=51.0447&longitude=-114.0719&current=temperature_2m";

const temperature = document.querySelector("#temperature");
const weatherStatus = document.querySelector("#weather-status");
const refreshButton = document.querySelector("#refresh-weather");
const contactForm = document.querySelector("#contact-form");

async function loadWeather() {
  refreshButton.disabled = true;
  weatherStatus.textContent = "Getting the latest conditions…";

  try {
    const response = await fetch(weatherUrl, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);

    const data = await response.json();
    const currentTemp = data.current?.temperature_2m;

    if (typeof currentTemp !== "number") throw new Error("Weather data was incomplete");

    temperature.textContent = `${Math.round(currentTemp)}°C`;
    weatherStatus.textContent = "Latest available reading for Calgary.";
  } catch (error) {
    temperature.textContent = "--°C";
    weatherStatus.textContent = "Weather is unavailable right now. Try again later.";
    console.error("Weather error:", error);
  } finally {
    refreshButton.disabled = false;
  }
}

function showFieldError(fieldId, message) {
  document.querySelector(`#${fieldId}-error`).textContent = message;
}

function validateForm() {
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  showFieldError("name", name.length >= 2 ? "" : "Enter a name with at least 2 characters.");
  showFieldError("email", emailIsValid ? "" : "Enter a valid email address.");

  return name.length >= 2 && emailIsValid;
}

refreshButton.addEventListener("click", loadWeather);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#form-message");

  if (!validateForm()) {
    message.textContent = "Please correct the highlighted fields.";
    return;
  }

  if (window.isSecureContext) {
    document.cookie = "contactSubmitted=1; Secure; SameSite=Lax; Path=/; Max-Age=86400";
  }

  message.textContent = "Your details passed validation. This demonstration does not send the form.";
  contactForm.reset();
});

loadWeather();

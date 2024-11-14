document.getElementById("signupForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  console.log("Form submitted with values:", { username, password, confirmPassword }); // Debugging form data

  // Check if passwords match
  if (password !== confirmPassword) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "Passwords do not match.";
    errorMessage.style.display = "block";
    errorMessage.classList.add("show");

    // Hide the error message after 3 seconds
    setTimeout(() => {
      errorMessage.style.display = "none";
      errorMessage.classList.remove("show");
    }, 3000);
    return;
  }

  try {
    console.log("Sending request to server...");
    const response = await fetch("https://clement-website-ruangbahasa123.vercel.app/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    console.log("Response status:", response.status); // Log response status

    if (response.ok) {
      const data = await response.json(); // Parse response data
      console.log("Response data:", data);

      // Display success message
      const successMessage = document.getElementById("successMessage");
      successMessage.textContent = "Signup successful! Redirecting to login...";
      successMessage.style.display = "block";
      successMessage.classList.add("show");

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);
    } else {
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.textContent = "Signup failed. Please try again.";
      errorMessage.style.display = "block";
      errorMessage.classList.add("show");

      // Hide the error message after 3 seconds
      setTimeout(() => {
        errorMessage.style.display = "none";
        errorMessage.classList.remove("show");
      }, 3000);
    }
  } catch (error) {
    console.error("Error in fetch request:", error); // Log fetch error
  }
});

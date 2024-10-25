document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    loginButton.addEventListener("click", handleLogin);
});

function handleLogin() {
    // Get values from the input fields
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const apiKey = document.getElementById("apikey").value;

    // Perform any desired action with the input values
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("API Key:", apiKey);

    // Add additional logic here, like validation or storing credentials
}
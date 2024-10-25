document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    loginButton.addEventListener("click", handleLogin);
});



function handleLogin() {
    // Get values from the input fields
    const apiKey = document.getElementById("apikey").value;

    // Perform any desired action with the input values
    console.log("API Key:", apiKey);
    const url = 'https://api.real-debrid.com/rest/1.0/user';

    // Bearer token
    fetch(url, {
        method: 'GET',
        mode: 'cors', 
        headers: {
            'Authorization': `Bearer ${apiKey}`, 
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        // Check if the response is ok (status code in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        console.log(data); // Handle the data from the response
        // format data

        // store apikey
        storeapiKey(apiKey)
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    // Add additional logic here, like validation or storing credentials
}

function storeapiKey(apiKey){
    browser.storage.local.set({"apiKey": apiKey})
}
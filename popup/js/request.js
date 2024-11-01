function RQ(apiKey, url) {
    console.log("RQ apiKey: " + apiKey)
    console.log("RQ url: " + url)
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
        // console.log(data); // Handle the data from the response
        // format data

        // store apikey
        setValue("apiKey", apiKey)
        setValue("validKey", true)
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    // Add additional logic here, like validation or storing credentials
}

function storeapiKey(apiKey){
    let validKey = false
    browser.storage.local.get("apiKey").then((result) => {
        validKey = result.validKey
    }).catch((error) => {
        validKey = false
        browser.storage.local.set({"validKey": validKey})
    })

    browser.storage.local.get("apiKey").then((result) => {
        if ((result == "" || result == undefined) || (!validKey || validKey == "" || validKey == undefined)){
            browser.storage.local.set({"apiKey": apiKey})
        }
    }).catch((error) => {
        browser.storage.local.set({"validKey": validKey})
    });

}

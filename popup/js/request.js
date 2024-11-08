function RQ(apiKey, url, rqType) {
    console.log("RQ apiKey: " + apiKey)
    console.log("RQ url: " + url)
    console.log("rqType: " + rqType)
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
            console.log(response); // Handle the data from the response

            if (!response.ok) {
                setValue("apiKey", "")
                setValue("validKey", false)
            }
            if (rqType === "LOGIN") {
                setValue("apiKey", apiKey)
                setValue("validKey", true)
            }
            return response.json(); // Parse the response JSON
        })
        .then(data => {
            console.log(data); // Handle the data from the response
            // format data
            if (rqType === "GET_DOWNLOADS") {
                return format_downloads_list(data)
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    // Add additional logic here, like validation or storing credentials
}

function format_downloads_list(data) {
    map_dl = {}
    data.forEach(o => {
        map_dl.set(filename, download)
        // console.log(o.filename + o.download)
    });
}

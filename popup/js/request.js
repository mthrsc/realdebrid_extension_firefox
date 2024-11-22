async function RQ(apiKey, rqType) {
    let url = ""
    if(rqType === "LOGIN"){
        url = "https://api.real-debrid.com/rest/1.0/user"
    } else if(rqType === "GET_DOWNLOADS"){
        url = "https://api.real-debrid.com/rest/1.0/downloads"
    } else if(rqType === "GET_TORRENTS"){
        url = "https://api.real-debrid.com/rest/1.0/torrents"
    }


    console.log("RQ apiKey: " + apiKey)
    console.log("RQ url: " + url)
    console.log("rqType: " + rqType)
    // Bearer token
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    })
    // Check if the response is ok (status code in the range 200-299)
    console.log(response); // Handle the data from the response

    if (!response.ok) {
        setValue("apiKey", "")
        setValue("validKey", false)
        return null;
    }
    const data = await response.json();
    // console.log("raw data: " + data);

    if (rqType === "LOGIN") {
        setValue("apiKey", apiKey)
        setValue("validKey", true)
        return data;
    }  

    if (rqType === "GET_DOWNLOADS") {
        return return_objects_array(data)
    }
    if (rqType === "GET_TORRENTS") {
        return return_objects_array(data)
    }
}


function return_objects_array(data) {
    const arr = []; 
    data.forEach(o => {
        arr.push(o)    
    });
    return arr;
}

let apiKey = ""
let results = browser.storage.local.get("apiKey")
results.then(onGot, onError)

function onGot(item){
    console.log(item)
    apiKey = item.apiKey
}

function onError(error) {
    console.log(`Error: ${error}`);
}


if (!apiKey == ""){
    
}

console.log("Extension starting")

// Function to run independently
function runIndependently() {
    console.log("Running independent code...");
    // Your code here, e.g., fetch data, set intervals, etc.
}

// Call the function when the extension is loaded
runIndependently();

// Optional: Set an interval to run the function periodically
// setInterval(runIndependently, 10000); // Runs every minute

// Listen for events, if necessary
browser.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
    // You can also run your independent code here if needed
});


browser.contextMenus.create({
    id: "unrestrict-link",
    parentId: "realdebrid-submenu",
    title: "Unrestrict Link",
    contexts: ["link"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.linkUrl && info.linkUrl.startsWith("magnet:?")) {
        if (info.menuItemId === "unrestrict-link") {
            // Handle unrestrict action, e.g. send message to content script or popup
            console.log("Unrestrict link:", info.linkUrl);
            console.log("Magnet link detected:", info.linkUrl);
            // You can call your API logic here
            RQ(apiKey, "ADD_MAGNET", info.linkUrl);
        }
    }
});



























async function RQ(apiKey, rqType, rqBodyParam1){
    let url = "";
    let rqMethod = "GET";
    let body = null;
    let rqBodyParam1_name = "";

    if(rqType === "LOGIN"){
        url = "https://api.real-debrid.com/rest/1.0/user"
    } else if(rqType === "GET_DOWNLOADS"){
        url = "https://api.real-debrid.com/rest/1.0/downloads"
    } else if(rqType === "GET_TORRENTS"){
        url = "https://api.real-debrid.com/rest/1.0/torrents"
    } else if(rqType === "ADD_MAGNET"){
        url = "https://api.real-debrid.com/rest/1.0/torrents/addMagnet"
        rqMethod = "POST"
        rqBodyParam1_name = "magnet"
        if (rqBodyParam1) {
            body = JSON.stringify({ magnet: rqBodyParam1 });
        }
    }

    console.log("RQ apiKey: " + apiKey)
    console.log("RQ url: " + url)
    console.log("rqType: " + rqType)
    // Bearer token
    const response = await fetch(url, {
        method: rqMethod,
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
    if (rqType === "ADD_MAGNET") {
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

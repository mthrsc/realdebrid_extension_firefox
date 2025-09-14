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
            RQ(apiKey, "ADD_MAGNET", info.linkUrl, "");
        }
    }
});



























async function RQ(apiKey, rqType, rqBodyParam1, file_id){
    let url = "";
    let rqMethod = "GET";
    let body = null;
    
    if(rqType === "ADD_MAGNET"){
        url = "https://api.real-debrid.com/rest/1.0/torrents/addMagnet"
        rqMethod = "POST"
        if (rqBodyParam1) {
            body = "magnet=" + encodeURIComponent(rqBodyParam1);
        }
    }else if(rqType === "SELECT_ALL_FILES"){
        url = "https://api.real-debrid.com/rest/1.0/torrents/selectFiles" + "/" + file_id
        rqMethod = "POST"
        if (rqBodyParam1) {
            body = "files=" + encodeURIComponent(rqBodyParam1);
        }
    }else if(rqType === "UNRESTRICT_FILE"){
        url = "https://api.real-debrid.com/rest/1.0/unrestrict/link"
        rqMethod = "POST"
        if (rqBodyParam1) {
            body = "link=" + encodeURIComponent(rqBodyParam1);
        }
    }

    // Bearer token
    const response = await fetch(url, {
        method: rqMethod,
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
    console.log("Here")
    let data = null;
    try {   
        data = await response.json();
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
    console.log("raw data: " + JSON.stringify(data));

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
    if (rqType === "ADD_MAGNET" && response.ok) {
        file_id = data.id
        RQ( apiKey, "SELECT_ALL_FILES", "all", file_id)
    }
    if (rqType === "SELECT_ALL_FILES" && response.ok) {
        rqBodyParam1 = data.download
        RQ( apiKey, "UNRESTRICT_FILE", rqBodyParam1, "")
    }
    if (rqType === "UNRESTRICT_FILE" && response.ok) {
        console.log("File unrestricted successfully:", data);
    }

}


function return_objects_array(data) {
    const arr = []; 
    data.forEach(o => {
        arr.push(o)    
    });
    return arr;
}

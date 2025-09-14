let validKey = false
let apiKey = ""
const urlLogin = "https://api.real-debrid.com/rest/1.0/user"
const urlGetDownloads = "https://api.real-debrid.com/rest/1.0/downloads"


function setValue(name, value) {
    return browser.storage.local.set({ [name]: value });
}

async function getValue(name, callback) {
    console.log("[name]: " + [name])
    return await browser.storage.local.get(name).then((result) => {
        ret = result[name] !== undefined ? result[name] : "";
        // console.log("ret for "+ name + " : " + ret)
        // return ret
        callback(ret)
    }).catch((error) => {
        // console.error("Error retrieving value for", name, ":", error);
        // return ""; // Return an empty string in case of error
        callback("")
    });
}


async function generateDownloadList() {


    // TODO:
    // Get Download List ()
    // Get torrent List
    // Compare the two to find if any torrent needs to be unrestricted
    // If yes call https://api.real-debrid.com/rest/1.0/unrestrict/link&link="https://real-debrid.com/d/HL23LLQQZWHL65DF"





    let download_arr = await RQ(apiKey, "GET_DOWNLOADS")

    let torrent_array = await RQ(apiKey, "GET_TORRENTS")

    // console.log("torrent_array: " + torrent_array)

    const container = document.getElementById("download_list");
    container.innerHTML = "";

    for (const entry of torrent_array.entries()) {

        let fileName = entry[1].filename;
        let restrictedLink = entry[1].links[0];

        // console.log(fileName);
        // console.log(restrictedLink);


        let listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.textContent = fileName;

        container.appendChild(listItem);

        // Is file unrestricted ?
        let isFileUnrestrictedBool = isFileUnrestricted(fileName, download_arr)

        if (isFileUnrestrictedBool[0]){
            let downloadButton = document.createElement("button");
            downloadButton.textContent = "Download";
            
            downloadButton.addEventListener("click", () => {downloadFileFunc(isFileUnrestrictedBool[1])});
            
            container.appendChild(downloadButton);
        } else {
            let unrestrictButton = document.createElement("button");
            unrestrictButton.textContent = "Unrestrict";
            unrestrictButton.addEventListener("click", () => {
                RQ(apiKey, "UNRESTRICT", entry[1].links[0]);
            });
            container.appendChild(unrestrictButton);
        }
    }
}

function isFileUnrestricted(fileName, download_arr){
    for (const entry of download_arr.entries()) {
        let downloadFileName = entry[1].filename;
        if (fileName == downloadFileName) {
            // console.log("Download link found:");
            let downloadLink = entry[1].download
            // console.log(downloadLink);
            // console.log(" ");

            return [true, downloadLink]
        }
    }

    return [false, null]
}

function downloadFileFunc(link){
    // console.log("link: " + link)
    window.open(link, '_blank'); // Open the link in a new tab
}

function updatePopup(screen){
    document.querySelectorAll('div[class^="container_"]').forEach(div => {
        div.style.display = 'none';
    });

    if(screen==="LOADING"){
        document.querySelector('div.container_loading').style.display = 'block';
    }
    if(screen==="TORRENTS"){
        document.querySelector('div.container_torrent_list').style.display = 'block';
    }
    if(screen==="LOGIN"){
        document.querySelector('div.container_login').style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    validKeyPromise = await getValue("validKey", (validKeyCallback) => {
        validKey = validKeyCallback
        // console.log("validKey :", validKey)
    })

    apiKeyPromise = await getValue("apiKey",(apiKeyCallback) => {
        apiKey = apiKeyCallback
        // console.log("API Key:", apiKey);
    });

    
    if (validKey && apiKey) {
        // SHOW LOADING
        updatePopup("LOADING")
        // console.log("validKey is true")
        await generateDownloadList()

        //SHOW TORRENT
        updatePopup("TORRENTS")

        //Implement and call updatePopupWithLatestDownloads()
        // RQ


        // browser.storage.local.get("apiKey").then((result) => {
        //     apiKey = result.apiKey
        //     document.getElementById("apikey").value = result.apiKey || ""; // Set to empty string if undefined
        // }).catch((error) => {
        //     console.error("Error retrieving apiKey:", error);
        // });



    } 
    if (!validKey || !apiKey) {
        //SHOW LOGIN SCREEN
        updatePopup("LOGIN")

        // console.log("validKey is false")
        const loginButton = document.getElementById("loginButton");
        // loginButton.addEventListener("click", RQ(apiKey, urlLogin));
        loginButton.addEventListener("click", () => {
            apiKey = document.getElementById("apikey").value,
            // console.log("apikey textbox: " + apiKey),
            RQ(apiKey, "LOGIN"); // This will now only be called on button click
        });
    }
});




























async function RQ(apiKey, rqType, rqBodyParam1){
    let url = "";
    let rqMethod = "GET";
    let body = null;

    if(rqType === "LOGIN"){
        url = "https://api.real-debrid.com/rest/1.0/user"
    } else if(rqType === "GET_DOWNLOADS"){
        url = "https://api.real-debrid.com/rest/1.0/downloads"
    } else if(rqType === "GET_TORRENTS"){
        url = "https://api.real-debrid.com/rest/1.0/torrents"
    } else if(rqType === "ADD_MAGNET"){
        url = "https://api.real-debrid.com/rest/1.0/torrents/addMagnet"
        rqMethod = "POST"
        if (rqBodyParam1) {
            body = "magnet=" + encodeURIComponent(rqBodyParam1);
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
            // 'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })
    // Check if the response is ok (status code in the range 200-299)
    console.log(response); // Handle the data from the response

    // if (!response.ok) {
    //     setValue("apiKey", "")
    //     setValue("validKey", false)
    //     return null;
    // }
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
        // return return_objects_array(data)
    }

}


function return_objects_array(data) {
    const arr = []; 
    data.forEach(o => {
        arr.push(o)    
    });
    return arr;
}

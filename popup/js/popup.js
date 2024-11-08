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


function updatePopupWithLatestDownloads() {


    // TODO:
    // Get Download List ()
    // Get torrent List
    // Compare the two to find if any torrent needs to be unrestricted
    // If yes call https://api.real-debrid.com/rest/1.0/unrestrict/link&link="https://real-debrid.com/d/HL23LLQQZWHL65DF"





    let download_map = RQ(apiKey, urlGetDownloads, "GET_DOWNLOADS")
    console.log("download_map: " + download_map)
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
        console.log("validKey is true")
        updatePopupWithLatestTorrent()

        //Implement and call updatePopupWithLatestTorrent()
        // RQ


        // browser.storage.local.get("apiKey").then((result) => {
        //     apiKey = result.apiKey
        //     document.getElementById("apikey").value = result.apiKey || ""; // Set to empty string if undefined
        // }).catch((error) => {
        //     console.error("Error retrieving apiKey:", error);
        // });



    } else {
        console.log("validKey is false")
        const loginButton = document.getElementById("loginButton");
        // loginButton.addEventListener("click", RQ(apiKey, urlLogin));
        loginButton.addEventListener("click", () => {
            apiKey = document.getElementById("apikey").value,
            console.log("apikey textbox: " + apiKey),
            RQ(apiKey, urlLogin, "LOGIN"); // This will now only be called on button click
        });
    }
});

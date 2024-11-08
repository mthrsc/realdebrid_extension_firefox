let validKey = false
let apiKey = ""
let urlLogin = "https://api.real-debrid.com/rest/1.0/user"

function setValue(name, value) {
    return browser.storage.local.set({ [name]: value });
}

async function getValue(name, callback) {
    console.log("[name]: " + [name])
    return await browser.storage.local.get(name).then((result) => {
        ret = result[name] !== undefined ? result[name] : "";
        console.log("ret for "+ name + " : " + ret)
        // return ret
        callback(ret)
    }).catch((error) => {
        console.error("Error retrieving value for", name, ":", error);
        // return ""; // Return an empty string in case of error
        callback("")
    });
}


function updatePopupWithLatestTorrent(apiKey) {

}


document.addEventListener("DOMContentLoaded", () => {

    validKeyPromise = getValue("validKey", (validKeyCallback) => {
        validKey = validKeyCallback
        console.log("validKey :", validKey)
    })

    apiKeyPromise = getValue("apiKey",(apiKeyCallback) => {
        apiKey = apiKeyCallback
        console.log("API Key:", apiKey);});

    if (validKey) {
        console.log("validKey is true")

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
                RQ(apiKey, urlLogin); // This will now only be called on button click
        });
    }
});

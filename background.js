
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
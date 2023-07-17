
const timeLineGenerator = {
    "id": "timeLineGenerator",
    "title": "Generate Timeline",
    "contexts":["editable"]
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create(timeLineGenerator);
});

let triggerTimeline;

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse){
    
    var updated = false;
    setTimeout(() => {
        if(!updated)
        {
            chrome.contextMenus.onClicked.removeListener(triggerTimeline);
            triggerTimeline = void 0;
            sendResponse("TIMEOUT");
        }
    }, 5000);
    
    if(!triggerTimeline)
    {
        triggerTimeline = function()
        {
            sendResponse("UPDATED");
        }
    }
    if(request === "UPDATE")
    {
        chrome.contextMenus.onClicked.removeListener(triggerTimeline);
        console.log("contextMenu listener removed reason: " + request);
        
        chrome.contextMenus.onClicked.addListener(triggerTimeline);
    }
    if(request === "FINISHED")
    {
        chrome.contextMenus.onClicked.removeListener(triggerTimeline);
        triggerTimeline = void 0;
        console.log("contextMenu listener removed reason: " + request);
        sendResponse("REMOVED");
    }
});
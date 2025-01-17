chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension Started");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.url) {
    console.log('URL of current website', message.url)
  }
})
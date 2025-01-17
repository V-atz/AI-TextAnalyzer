chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension Started");
});
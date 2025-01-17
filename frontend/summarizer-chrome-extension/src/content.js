console.log("Hello this is content script");

chrome.runtime.sendMessage({ url: window.location.href });

// This will capture the selected text from the webpage
document.addEventListener("selectionchange", () => {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    // Send the selected text to the popup (App.jsx) through the background script
    chrome.runtime.sendMessage({ selectedText: selectedText });
  }
});
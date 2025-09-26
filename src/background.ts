chrome.runtime.onInstalled.addListener(() => {
    console.log('Service worker installed.');
});
  
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === 'PING') {
        sendResponse({ pong: 'PONG from service worker' });
        return true; // ok to return true even if synchronous
    }
});
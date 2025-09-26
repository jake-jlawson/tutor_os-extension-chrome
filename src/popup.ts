const $ = (id: string) => document.getElementById(id)!;

function set(id: string, text: string) {
  $(id).textContent = text;
}

chrome.runtime.getPlatformInfo((info) => {
  set('platform', `${info.os} ${info.arch} ${info.nacl_arch}`);
});

chrome.runtime.sendMessage({ type: 'PING' }, (resp) => {
  set('ping', resp?.pong || 'No response');
});

chrome.storage.local.set({ ts_ok: 'yes' }, () => {
  chrome.storage.local.get(['ts_ok'], (v) => {
    set('storage', v.ts_ok === 'yes' ? 'OK' : 'FAILED');
  });
});
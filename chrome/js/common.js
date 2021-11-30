export function getYTVideoId(url) {
  return url.match(/\?v=([\w-]+)/)[1];
}

export function getLangListUrl(timedtextUrl) {
  // remove '&fmt=json3&xorb=2&xobt=3&xovt=3' and add '&type=list'
  return timedtextUrl.substr(0, timedtextUrl.length - 31) + '&type=list';
}

// Get current tab id
export function getTabId(callback) {
  const intervalId = setInterval(() => {
    chrome.tabs.query({ currentWindow: true }, tabs => {
      if (tabs) {
        callback(tabs[0].id);
        clearInterval(intervalId);
      }
    });
  }, 1);
}

export function requestAysnc(method, url, msg = null) {
  return new Promise(resolve => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == this.DONE) {
        if (this.status == 200) {
          resolve(this.responseText);
        }
      }
    };

    xhr.open(method, url);
    console.log(method, url, msg);
    xhr.send(msg);
  });
}
const replacer = `
const MAX_ATTEMPTS = 5;
const TIMEOUT = 200;

function replaceAfterFirstAppearance(text, original, replacement) {
  const firstStart = text.indexOf(original);
  const firstEnd = firstStart + original.length;
  const before = text.substring(0, firstEnd);
  const after = text.substring(firstEnd);
  return before + after.replaceAll(original, replacement);
}

function handleMessage(message, attempt) {
 if (!document.innerText && attempt < MAX_ATTEMPTS) {
    setTimeout(() => handleMessage(message, attempt + 1), TIMEOUT);
    return;
  }
  
  const postBody = document.getElementById('post-content-body');
  if (!postBody) {
    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'no-post'}));
    return;
  }
  
  try {
    switch (message.type) {
      case 'getContent': {
        const payload = postBody.innerText;        
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'content', payload: payload}));
        break;
      }
      case 'replaceWords': {        
        const {tokens, translation} = message.payload;
        const translationsHtml = translation.map((t) => '<b style="color: #19267e;">' + t + '</b>');
        let html = postBody.innerHTML;
        for (let i = 0; i < tokens.length; i++) {
          html = replaceAfterFirstAppearance(html, tokens[i], translationsHtml[i]);
        }
        postBody.innerHTML = html
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'translated'}));
        break;
      }
    }
  } catch(err) {
    alert('error: ' + (JSON.stringify(err) || err));
    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', payload: JSON.stringify(err)}));
  }
}

let ready = false;
window.addEventListener('load', () => {
  ready = true;
  window.ReactNativeWebView.postMessage(JSON.stringify({type: 'ready'}));
});

window.addEventListener("message", function (event) {
  if (!ready) return;  
      
  let message = undefined;
  try {
    message = JSON.parse(event.data);
  } catch (err) {
    // ignore other messages
    return;
  }
  
  handleMessage(message, 1);
});
true;
`;

export default replacer;

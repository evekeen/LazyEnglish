const replacer = `
const MAX_ATTEMPTS = 10;
const TIMEOUT = 500;

function replaceAfterFirstAppearance(text, lowerCase, original, replacement) {
  const regexp = new RegExp('([ .,!?;:-]+)' + original + '([ .,!?;:-]+)', 'ig');
  const substitution = '$1' + replacement + '$2';
  try {
    const firstStart = lowerCase.indexOf(original);
    const firstEnd = firstStart + original.length;
    const before = text.substring(0, firstEnd);
    const after = text.substring(firstEnd);
    const beforeLC = lowerCase.substring(0, firstEnd);
    const afterLC = lowerCase.substring(firstEnd);    
    const newText = before + after.replace(regexp, '$1' + replacement + '$2');
    const newLC = beforeLC + afterLC.replace(regexp, '$1' + replacement + '$2');
    return [newText, newLC];
  } catch (err) {
    alert('Failed to substitute translation ' + regexp + ' - ' + JSON.stringify(err));
  }
}

function handleMessage(message, attempt) {
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
        let lowerCase = html.toLowerCase('ru'); 
        for (let i = 0; i < tokens.length; i++) {
          [html, lowerCase] = replaceAfterFirstAppearance(html, lowerCase, tokens[i], translationsHtml[i]);
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

window.ReactNativeWebView.postMessage(JSON.stringify({type: 'injected'}));

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

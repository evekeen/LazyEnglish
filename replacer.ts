const replacer = `
function replaceAfterFirstAppearance(text, original, replacement) {
  const firstStart = text.indexOf(original);
  const firstEnd = firstStart + original.length;
  const before = text.substring(0, firstEnd);
  const after = text.substring(firstEnd);
  return before + after.replaceAll(original, replacement);
}

let ready = false;
window.addEventListener('load', () => {
  ready = true;
});

window.addEventListener("message", function (event) {
  if (!ready) return;
  try {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case 'getContent':
        const payload = document.body.innerText;
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'content', payload: payload}));
        break;
      case 'replaceWords':
        const {tokens, translation} = message.payload;
        const translationsHtml = translation.map((t) => '<b style="color: #537;">' + t + '</b>');
        let result = document.body.innerHTML;
        for (let i = 0; i < tokens.length; i++) {
          result = replaceAfterFirstAppearance(result, tokens[i], translationsHtml[i]);
        }
        document.body.innerHTML = result;
        ready = false;
        break;
    }
  } catch(err) {
    alert('error: ' + (JSON.stringify(err) || err));
    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', payload: JSON.stringify(err)}));
  }
});
true;
`;

export default replacer;

import {Settings} from './SettingsPage';
import React, {useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {getTokens} from './Tokenizer';
import {translate} from './Translator';
import replacer from './replacer';
import {View, Text} from 'react-native';
import {WebViewMessageEvent} from 'react-native-webview/lib/WebViewTypes';

export const Browser = (props: BrowserProps) => {
  const webView = useRef<WebView>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  function onMessage(event: WebViewMessageEvent): void {
    const message = JSON.parse(event.nativeEvent.data);
    switch (message.type) {
      case 'content':
        const tokens = getTokens(message.payload);
        console.log(tokens);
        if (tokens.length > 0) {
          translate(tokens)
            .then((translation) => {
              webView.current?.postMessage(
                JSON.stringify({
                  type: 'replaceWords',
                  payload: {tokens, translation},
                }),
              );
            })
            .catch((err) => {
              setError('Error: ' + JSON.stringify(err));
            });
        }
        break;
      case 'error':
        setError(message.payload);
        break;
    }
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{uri: 'https://habr.com/ru'}}
      injectedJavaScript={replacer}
      ref={webView}
      onMessage={onMessage}
      onError={(error) => console.log(error)}
      javaScriptEnabled={true}
      onNavigationStateChange={(nav) => {
        if (!nav.loading) {
          webView.current?.postMessage(JSON.stringify({type: 'getContent'}));
        }
      }}
    />
  );
};

interface BrowserProps {
  settings: Settings;
}

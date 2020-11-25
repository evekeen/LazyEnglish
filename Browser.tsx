import {Settings} from './SettingsPage';
import React, {useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {getTokens} from './Tokenizer';
import {translate} from './Translator';
import replacer from './replacer';
import {View, Text, ActivityIndicator} from 'react-native';
import {WebViewMessageEvent} from 'react-native-webview/lib/WebViewTypes';

export const Browser = (props: BrowserProps) => {
  const webView = useRef<WebView>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  function onMessage(event: WebViewMessageEvent): void {
    const message = JSON.parse(event.nativeEvent.data);
    switch (message.type) {
      case 'content':
        const tokens = getTokens(message.payload, props.settings.level);
        if (tokens.length > 0) {
          setLoading(true);
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
      case 'ready':
        console.log('ready');
        setReady(true);
        break;
      case 'translated':
        console.log('translated');
        setLoading(false);
        break;
      case 'no-post':
        console.log('no post found');
        setLoading(false);
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
    <View style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        source={{uri: 'https://habr.com/ru'}}
        injectedJavaScript={replacer}
        ref={webView}
        onMessage={onMessage}
        onError={(error) => console.log(error)}
        onLoadStart={() => setLoading(true)}
        javaScriptEnabled={true}
        onNavigationStateChange={(nav) => {
          if (nav.loading) {
            setLoading(true);
          } else if (ready) {
            setTimeout(() => {
              webView.current?.postMessage(JSON.stringify({type: 'getContent'}));
            }, 1000);
          }
        }}
      />
      {loading && <Overlay/>}
    </View>
  );
};

const Overlay = () => {
  return (
    <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: '#000'}}>
      <ActivityIndicator size="large"  style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0}}/>
    </View>
  );
}

interface BrowserProps {
  settings: Settings;
}

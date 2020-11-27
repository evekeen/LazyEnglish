import {EnglishLevel, Settings} from './SettingsPage';
import React, {useEffect, useRef, useState} from 'react';
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
  const [scheduled] = useState<BooleanWrapper>(new BooleanWrapper(false));
  const [translated, setTranslated] = useState<boolean>(false);
  console.log('Browser', props, props.settings.level, translated);
  useEffect(() => {
    console.log('effect', props.settings.level, translated);
    webView.current?.reload();
  }, [props.settings.level]);

  function onMessage(event: WebViewMessageEvent): void {
    const message = JSON.parse(event.nativeEvent.data);
    console.log(message.type);
    switch (message.type) {
      case 'content':
        setTranslated(false);
        const tokens = getTokens(message.payload, props.settings.level);
        if (tokens.length > 0) {
          setLoading(true);
          console.log('Translating...');
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
        setReady(true);
        setLoading(false);
        setTranslated(false);
        break;
      case 'translated':
        setLoading(false);
        setTranslated(true);
        break;
      case 'no-post':
        setLoading(false);
        setTranslated(false);
        break;
      case 'error':
        setError(message.payload);
        setTranslated(false);
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

  function requestContent() {
    webView.current?.postMessage(JSON.stringify({type: 'getContent'}));
  }

  return (
    <View style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        source={{uri: 'https://m.habr.com/ru/all/'}}
        injectedJavaScript={replacer}
        ref={webView}
        onMessage={onMessage}
        onError={(error) => console.log(error)}
        onLoadStart={() => {
          console.log('>> onLoadStart');
          setLoading(true);
        }}
        onLoad={() => {
          console.log('>> onLoad');
          setLoading(true);
          if (scheduled.value) {
            console.log('already scheduled');
            return;
          }
          scheduled.value = true;
          console.log('scheduling...');
          setTimeout(() => {
            if (scheduled.value) {
              console.log('executing!');
              scheduled.value = false;
              requestContent();
            } else {
              console.log('not scheduled');
            }
          }, 2000);
        }}
        javaScriptEnabled={true}
      />
      {loading && <Overlay/>}
    </View>
  );
};

const Overlay = () => {
  return (
    <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: '#fff'}}>
      <ActivityIndicator size="large" color='#30f' style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0}}/>
    </View>
  );
};

interface BrowserProps {
  settings: Settings;
  setTitle?: (title: string) => void;
}

class BooleanWrapper {
  constructor(public value: boolean) {}
}

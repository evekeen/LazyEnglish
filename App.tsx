import React, {useState} from 'react';
import 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import SettingsPage, {EnglishLevel, Settings} from './SettingsPage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Browser} from './Browser';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Settings'}}
        />
        <Stack.Screen name="Browser" component={BrowserScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const SettingsScreen = (props: { navigation: any }) => {
  const [settings, setSettings] = useState<Settings>({
    level: EnglishLevel.ELEMENTARY,
  });
  return (
    <SettingsPage
      settings={settings}
      setSettings={(settings) => {
        setSettings(settings);
        props.navigation.navigate('Browser', {settings});
      }}
    />
  );
};

const BrowserScreen = (props: { settings: Settings }) => {
  return <Browser settings={props.settings}/>;
};
StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

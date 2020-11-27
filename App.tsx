import React from 'react';
import 'react-native-gesture-handler';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import SettingsPage, {EnglishLevel, Settings} from './SettingsPage';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Browser} from './Browser';

const Tab = createBottomTabNavigator();

const defaultSettings: Settings = {
  level: EnglishLevel.ELEMENTARY
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: 16,
          },
          tabStyle: {
            justifyContent: 'center',
            backgroundColor: '#fef',
          },
        }}>
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Settings'}}
          initialParams={{settings: defaultSettings}}
        />
        <Tab.Screen key='Browser' name="Browser" component={BrowserScreen} initialParams={{settings: defaultSettings}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const SettingsScreen = (props: { navigation: any, route: any}) => {
  return (
    <SafeAreaView>
      <SettingsPage
        settings={props.route.params.settings}
        setSettings={(settings) => {
          props.navigation.navigate('Browser', {settings});
        }}
      />
    </SafeAreaView>
  );
};

const BrowserScreen = (props: { route: any; navigation: any }) => {
  return <Browser settings={props.route.params.settings}/>;
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

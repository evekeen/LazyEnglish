import {
  Button,
  StyleSheet,
  Text,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useState} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ItemValue} from '@react-native-picker/picker/typings/Picker';

const SettingsPage = (props: SettingsPageProps) => {
  const [level, setLevel] = useState<EnglishLevel>(props.settings.level);
  return (
    <>
      <Text style={styles.sectionTitle}>English Level</Text>
      <Picker
        selectedValue={level}
        style={{height: 50, width: 150}}
        onValueChange={(l: ItemValue) => setLevel(l as EnglishLevel)}>
        <Picker.Item label="Elementary" value={EnglishLevel.ELEMENTARY}/>
        <Picker.Item label="Intermediate" value={EnglishLevel.INTERMEDIATE}/>
        <Picker.Item label="Advanced" value={EnglishLevel.ADVANCED}/>
      </Picker>
      <Button
        title="Apply"
        onPress={() => props.setSettings({level: level})}
      />
    </>
  );
};

interface SettingsPageProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export interface Settings {
  level: EnglishLevel;
}

export enum EnglishLevel {
  ELEMENTARY,
  INTERMEDIATE,
  ADVANCED,
}

const styles = StyleSheet.create({
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

export default SettingsPage;

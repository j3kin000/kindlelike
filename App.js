import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import {BookList} from './src/Data/books';
import {dimensions} from './src/utiility/utils';

const App = () => {
  const [books, setBooks] = useState(BookList);
  const [content, setContent] = useState();

  function readFile(book) {
    if (book == '0') {
      return;
    }
    if (Platform.OS == 'ios') {
      RNFS.readFile(`${RNFS.MainBundlePath}/assets/${book}.txt`)
        .then(res => {
          setContent(res);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
    } else if (Platform.OS == 'android') {
      RNFS.readFileAssets(`${book}.txt`)
        .then(res => {
          setContent(res);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
    }
    // console.log(content);
  }
  const renderContent = ({item}) => (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        width: dimensions.windowWidth * 0.3,
        height: dimensions.windowHeight * 0.3,
        marginBottom: 10,
        marginTop: 10,
      }}
      onPress={() => readFile(item.BookUrl)}>
      <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>
        {item.BookName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, padding: 30}}>
      {content === '' ? (
        <FlatList
          data={books}
          renderItem={renderContent}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          numColumns={2}
        />
      ) : (
        <ScrollView>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-start',
            }}
            onPress={() => setContent('')}>
            <Text
              style={{
                padding: 10,
                margin: 10,
                borderWidth: 1,
                fontWeight: 'bold',
              }}>
              Return
            </Text>
          </TouchableOpacity>
          <Text>{content}</Text>
        </ScrollView>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});

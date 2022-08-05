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
import Carousel from 'react-native-snap-carousel';

const ITEM_WIDTH = Math.round(dimensions.windowHeight * 0.7);
const App = () => {
  const [books, setBooks] = useState(BookList);
  const [content, setContent] = useState();
  const [index, setIndex] = useState();
  const isCarousel = React.useRef();
  function readFile(book) {
    setIndex(0);
    if (Platform.OS == 'ios') {
      RNFS.readFile(`${RNFS.MainBundlePath}/assets/${book}.txt`)
        .then(res => {
          setContent(res.match(/.{1,100000}/g));
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
    } else if (Platform.OS == 'android') {
      RNFS.readFileAssets(`${book}.txt`)
        .then(res => {
          setContent(res.match(/.{1,100000}/g));
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
  const renderItem = ({item}) => {
    return (
      <ScrollView style={styles.itemContainer}>
        <Text style={styles.content}>{item}</Text>
      </ScrollView>
    );
  };
  return (
    <View style={{flex: 1, padding: 30}}>
      {content === '' ? (
        <View>
          <Text
            style={{
              padding: 10,
              margin: 10,
              fontSize: 18,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            Kindle Like Application
          </Text>
          <FlatList
            data={books}
            renderItem={renderContent}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            numColumns={2}
          />
        </View>
      ) : (
        <View>
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
          <Carousel
            ref={isCarousel}
            data={content}
            renderItem={renderItem}
            sliderWidth={dimensions.windowWidth}
            itemWidth={dimensions.windowWidth}
            containerCustomStyle={styles.carouselContainer}
            inactiveSlideShift={0}
            onSnapToItem={index => setIndex(index)}
            useScrollView={true}
          />
          <Text style={styles.counter}>{index}</Text>
        </View>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  itemContainer: {
    width: dimensions.windowWidth * 0.9,
    height: dimensions.windowHeight * 0.7,
  },
  content: {
    marginHorizontal: 10,
    fontSize: Platform.OS == 'ios' ? 18 : 24,
  },
  counter: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

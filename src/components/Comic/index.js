// @flow
import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  Colors,
  withTheme,
  Button,
} from 'react-native-paper';
import Moment from 'moment';

import BaseLayout from '../BaseLayout';
import ComicImage from './ComicImage';

type Props = {
  navigation: any,
};

type State = {
  loading: boolean,
  pageWidth: number,
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  infoWrapper: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 50,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  published: {
    marginTop: 15,
    fontSize: 12,
    color: Colors.grey600,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
  },
});

/* eslint camelcase: 0 */
class Comic extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      loading: true,
      pageWidth: width,
    };
  }

  getNewDimensions = (event) => {
    this.setState({
      pageWidth: event.nativeEvent.layout.width,
    });
  }

  /* eslint class-methods-use-this: 0 */
  findUrl(text) {
    const source = (text || '').toString();
    const urlArray = [];
    let matchArray;

    // Regular expression to find HTTP(S).
    /* eslint no-useless-escape: 0 */
    const regexToken = /(((https?):\/\/)[\-\w@:%_\+.~#?,&\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\/\/=]+(.(jpg|jpeg|png|bmp)))/g;

    // Iterate through any URLs in the text.
    /* eslint no-cond-assign: 0 */
    if ((matchArray = regexToken.exec(source)) !== null) {
      const token = matchArray[0];
      urlArray.push(token);
    }
    return urlArray[0];
  }

  handleLoadImage(newState) {
    this.setState({
      loading: newState,
    });
  }

  render() {
    const { navigation } = this.props;
    const {
      date,
      link,
      title,
      content,
    } = navigation.state.params.data;
    const { loading, pageWidth } = this.state;

    Moment.locale('en');

    return (
      <BaseLayout
        navigation={navigation}
        hideSearch
        hideLogo
        title={title}
        share={{ title, link }}
      >
        <ScrollView style={styles.wrapper} onLayout={this.getNewDimensions}>
          <ComicImage
            uri={this.findUrl(content)}
            width={pageWidth}
            callbackHandleLoadImage={newState => this.handleLoadImage(newState)}
          />
          {loading ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <ActivityIndicator size="large" animating />
            </View> :
            <View style={styles.infoWrapper}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.published}>
                {Moment(date).format('dddd, D MMMM YYYY')}
              </Text>
            </View>}
        </ScrollView>
        <View style={[styles.buttonWrapper, { width: pageWidth - 8 }]}>
          <Button
            raised
            color="orange"
            compact
            style={{ width: '100%' }}
            onPress={() => Linking.openURL(link)}
          >
            See on CommitStrip.com
          </Button>
        </View>
      </BaseLayout>
    );
  }
}

export default withTheme(Comic);

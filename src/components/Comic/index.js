// @flow
import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Colors,
  withTheme,
  Button,
} from 'react-native-paper';

import BaseLayout from '../BaseLayout';
import ComicImage from './ComicImage';

type Props = {
  navigation: any,
};

type State = {};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    // padding: 10,
  },
  col: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  row: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 50,
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
  button: {
    position: 'absolute',
    bottom: 0,
    width: width - 8,
  },
});

/* eslint camelcase: 0 */
class Comic extends React.PureComponent<Props, State> {
  /* eslint class-methods-use-this: 0 */
  findUrl(text) {
    const source = (text || '').toString();
    const urlArray = [];
    let matchArray;

    // Regular expression to find HTTP(S).
    /* eslint no-useless-escape: 0 */
    const regexToken = /(((https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g;

    // Iterate through any URLs in the text.
    /* eslint no-cond-assign: 0 */
    if ((matchArray = regexToken.exec(source)) !== null) {
      const token = matchArray[0];
      urlArray.push(token);
    }
    return urlArray[0];
  }

  render() {
    const { navigation } = this.props;
    const {
      date,
      link,
      title,
      content,
    } = navigation.state.params.data;

    console.log(content);
    console.log(this.findUrl(content));

    return (
      <BaseLayout
        navigation={navigation}
        hideSearch
        hideLogo
        share={{ title, link }}
      >
        <ScrollView style={styles.wrapper}>
          <ComicImage
            uri={this.findUrl(content)}
            width={width}
          />
          <View style={styles.row}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.published}>
              {date}
            </Text>
          </View>
        </ScrollView>
        <View style={styles.button}>
          <Button
            raised
            color="orange"
            compact
            style={{ width: '100%' }}
          >
            See on CommitStrip.com
          </Button>
        </View>
      </BaseLayout>
    );
  }
}

export default withTheme(Comic);

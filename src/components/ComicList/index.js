// @flow
import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import {
  withTheme,
  TouchableRipple,
} from 'react-native-paper';

import BaseLayout from '../BaseLayout';
import FeaturedImage from './FeaturedImage';
import LogoSmall from '../../../assets/logo_small.png';

type Props = {
  navigation: any,
  data: Array<Object>,
  loading: boolean,
  refreshing: boolean,
  callbackHandleRefresh: Function,
  callbackHandleEnd: Function,
};

type State = {
  pageWidth: number,
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  col: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  row: {
    flex: 1,
    flexDirection: 'column',
  },
  imageBackground: {
    height: 200,
    overflow: 'hidden',
  },
  headline: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#1f1f1f',
    height: 40,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 100,
    marginRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoSmall: {
    height: 60,
    width: 80,
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    marginLeft: 3,
  },
});

class Listings extends React.PureComponent<Props, State> {
  constructor() {
    super();
    this.state = {
      pageWidth: width,
    };
  }

  getNewDimensions = (event) => {
    this.setState({
      pageWidth: event.nativeEvent.layout.width,
    });
  }

  renderComic = ({ item }) => {
    const { navigation } = this.props;
    const { pageWidth } = this.state;

    if (item.status !== 'publish') return null;

    return (
      <TouchableRipple
        onPress={() => navigation.navigate({
          key: 'Comic',
          routeName: 'Comic',
          params: {
            data: {
              id: item.id,
              date: item.date,
              link: item.link,
              title: item.title.rendered,
              content: item.content.rendered,
            },
          },
        })}
      >
        <View onLayout={this.getNewDimensions}>
          <FeaturedImage
            id={item.featured_media}
            stylesheet={styles.imageBackground}
            width={pageWidth}
          >
            <Image
              style={styles.logoSmall}
              source={LogoSmall}
              resizeMode="contain"
            />
            <View style={[styles.headline, { width: pageWidth }]}>
              <View style={styles.titleWrapper}>
                <Text numberOfLines={1} style={styles.title}>
                  {item.title.rendered}
                </Text>
              </View>
            </View>
          </FeaturedImage>
        </View>
      </TouchableRipple>
    );
  }

  renderFooter = () => {
    const { data, loading } = this.props;

    if (loading) {
      if (data.length === 0) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: height - 56 }}>
            <ActivityIndicator size="large" animating />
          </View>
        );
      }
      return <ActivityIndicator size="large" animating style={{ marginVertical: 20 }} />;
    }
    return null;
  };

  render() {
    const { navigation, data, refreshing, callbackHandleRefresh, callbackHandleEnd } = this.props;
    const { pageWidth } = this.state;

    const loadingView = (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" animating />
      </View>
    );

    return (
      <BaseLayout
        navigation={navigation}
        hideShare
        hideBackButton
        hideSearch
        hideContent
      >
        {refreshing ? loadingView :
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={this.renderComic}
          onEndReached={callbackHandleEnd}
          onEndReachedThreshold={0.5}
          onRefresh={callbackHandleRefresh}
          refreshing={refreshing}
          ListFooterComponent={this.renderFooter}
          extraData={pageWidth}
        />}
      </BaseLayout>
    );
  }
}

export default withTheme(Listings);

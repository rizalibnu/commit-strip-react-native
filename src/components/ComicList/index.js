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
};

type State = {
  data: Array<Object>,
  page: number,
  loading: boolean,
  refreshing: boolean,
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
    width,
    height: 200,
    overflow: 'hidden',
  },
  headline: {
    width,
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
      data: [],
      page: 1,
      loading: false,
      refreshing: false,
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true });
    const response = await fetch(`https://www.commitstrip.com/en/wp-json/wp/v2/posts?per_page=10&page=${this.state.page}`);
    const json = await response.json();
    this.setState(state => ({
      data: [...state.data, ...json],
      loading: false,
      refreshing: false,
    }));
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
        data: [],
      },
      () => {
        this.fetchData();
      },
    );
  };

  handleEnd = () => {
    this.setState(state => ({ page: state.page + 1 }), () => this.fetchData());
  };

  renderComic = ({ item }) => {
    const { navigation } = this.props;

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
        <View style={styles.itemWrapper}>
          <FeaturedImage
            id={item.featured_media}
            stylesheet={styles.imageBackground}
          >
            <Image
              style={styles.logoSmall}
              source={LogoSmall}
              resizeMode="contain"
            />
            <View style={styles.headline}>
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
    if (this.state.loading) {
      if (this.state.data.length === 0) {
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
    const { navigation } = this.props;

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
        {this.state.refreshing ? loadingView :
        <FlatList
          data={this.state.data}
          keyExtractor={item => item.id.toString()}
          renderItem={this.renderComic}
          onEndReached={() => this.handleEnd()}
          onEndReachedThreshold={0.5}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          ListFooterComponent={this.renderFooter}
        />}
      </BaseLayout>
    );
  }
}

export default withTheme(Listings);

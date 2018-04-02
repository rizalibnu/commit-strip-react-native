// @flow
import * as React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';

import Placeholder from '../../../assets/placeholder.jpg';

type Props = {
  id: number,
  children: any,
  stylesheet: Object,
};

type State = {
  data: Object,
  loading: boolean,
  opacity: any,
};

class FeaturedImage extends React.PureComponent<Props, State> {
  static defaultProps = {
    stylesheet: {},
  }

  constructor() {
    super();
    this.state = {
      data: {},
      loading: false,
      opacity: new Animated.Value(0),
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true });
    const response = await fetch(`https://www.commitstrip.com/en/wp-json/wp/v2/media/${this.props.id}`);
    const json = await response.json();
    this.setState({
      data: json,
      loading: false,
    });
  };

  handleLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 250,
    }).start();
  }

  render() {
    const { children, stylesheet, ...props } = this.props;
    const { data, loading } = this.state;

    return (
      <View style={[stylesheet, { backgroundColor: 'transparent' }]}>
        <Image
          style={stylesheet}
          source={Placeholder}
          resizeMode="cover"
        />
        {!loading &&
          <Animated.Image
            {...props}
            resizeMode="cover"
            source={{ uri: data.media_details.sizes.full.source_url }}
            onLoad={this.handleLoad}
            style={[
              StyleSheet.absoluteFill,
              {
                width: stylesheet ? stylesheet.width : 0,
                height: stylesheet ? stylesheet.height : 0,
                opacity: this.state.opacity,
              },
            ]}
          />}
        {children}
      </View>
    );
  }
}

export default FeaturedImage;

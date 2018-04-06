// @flow
import * as React from 'react';
import {
  Image,
  Animated,
  View,
} from 'react-native';
import {
  Colors,
} from 'react-native-paper';

import Placeholder from '../../../assets/placeholder.jpg';

type Props = {
  uri: string,
  width: number,
  height: ?number,
  callbackHandleLoadImage: Function,
};

type State = {
  source: Object,
  width: number,
  height: number,
  opacity: any,
  loading: boolean,
};

class ComicImage extends React.PureComponent<Props, State> {
  static defaultProps = {
    height: null,
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      source: {
        uri: props.uri,
      },
      width: 0,
      height: 0,
      opacity: new Animated.Value(0),
      loading: true,
    };
  }

  componentDidMount() {
    this.getImageSize();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.width !== nextProps.width) {
      this.getImageSize();
    }
  }

  getImageSize() {
    Image.getSize(this.props.uri, (width, height) => {
      if (this.props.width && !this.props.height) {
        this.setState({ width: this.props.width, height: height * (this.props.width / width) });
      } else if (!this.props.width && this.props.height) {
        this.setState({ width: width * (this.props.height / height), height: this.props.height });
      } else {
        this.setState({ width, height });
      }
    });
  }

  handleLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 250,
    }).start();
  }

  handleLoadEnd = () => {
    this.setState({
      loading: false,
    });
    this.props.callbackHandleLoadImage(false);
  }

  render() {
    const { width, height, loading } = this.state;

    return (
      <View>
        {loading &&
          <Image
            style={{ width: this.props.width, height: 200 }}
            source={Placeholder}
            resizeMode="cover"
          />}
        <Animated.Image
          resizeMode="contain"
          source={this.state.source}
          onLoad={this.handleLoad}
          onLoadEnd={this.handleLoadEnd}
          style={{
            width,
            height,
            backgroundColor: Colors.grey300,
            opacity: this.state.opacity,
          }}
        />
      </View>
    );
  }
}

export default ComicImage;

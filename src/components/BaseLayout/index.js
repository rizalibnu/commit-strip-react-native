// @flow
import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  Share,
  Image,
  View,
  StatusBar,
} from 'react-native';
import {
  Colors,
  withTheme,
  Toolbar,
  ToolbarBackAction,
  ToolbarContent,
  ToolbarAction,
} from 'react-native-paper';
import type { Theme } from 'react-native-paper/types'; /* eslint import/extensions: 0, import/no-unresolved: 0 */
import DialogAbout from './DialogAbout';

import Logo from '../../../assets/logo.png';

type Props = {
  navigation: any,
  children: any,
  title: string,
  theme: Theme,
  hideSearch: boolean,
  hideShare: boolean,
  hideLogo: boolean,
  hideBackButton: boolean,
  hideContent: boolean,
  share: Object,
};

type State = {
  dialogVisible: boolean,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
  },
  logoWrapper: {
    flex: 3,
  },
  logo: {
    marginLeft: 10,
    height: 56,
    width: 260,
  },
});

class BaseLayout extends React.PureComponent<Props, State> {
  static defaultProps = {
    hideShare: false,
    hideSearch: false,
    hideLogo: false,
    hideBackButton: false,
    hideContent: false,
    title: '',
    subtitle: '',
    share: {},
  }

  constructor() {
    super();
    this.state = {
      dialogVisible: false,
    };

    this.handleShare = this.handleShare.bind(this);
  }

  handleShare: Function;
  handleShare() {
    const { share } = this.props;

    Share.share({
      ...Platform.select({
        ios: {
          message: `See Comic "${share.title}" on CommitStrip.com`,
          url: share.link,
        },
        android: {
          message: `See Comic "${share.title}" on CommitStrip.com${' \n'}${share.link}`,
        },
      }),
    })
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  openDialog = () => this.setState({ dialogVisible: true });
  closeDialog = () => this.setState({ dialogVisible: false });

  render() {
    const {
      navigation,
      children,
      title,
      hideSearch,
      hideLogo,
      hideShare,
      hideBackButton,
      hideContent,
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <StatusBar
          backgroundColor="#2B3F6B"
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        />
        <Toolbar>
          {!hideBackButton &&
            <ToolbarBackAction
              onPress={() => navigation.goBack()}
            />}
          {!hideLogo &&
            <View style={styles.logoWrapper}>
              <Image style={styles.logo} source={Logo} />
            </View>}
          {!hideContent &&
            <ToolbarContent
              title={title}
            />}
          {!hideSearch &&
            <ToolbarAction
              icon="search"
              onPress={() => {}}
            />}
          {!hideShare &&
            <ToolbarAction
              icon="share"
              onPress={this.handleShare}
            />}
          <ToolbarAction icon="more-vert" onPress={this.openDialog} />
        </Toolbar>
        {children}
        <DialogAbout visible={this.state.dialogVisible} close={this.closeDialog} />
      </SafeAreaView>
    );
  }
}

export default withTheme(BaseLayout);

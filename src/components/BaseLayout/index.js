// @flow
import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  Share,
  Image,
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
  subtitle: string,
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
  logo: {
    marginLeft: 10,
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
      subtitle,
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
        <Toolbar>
          {!hideBackButton &&
            <ToolbarBackAction
              onPress={() => navigation.goBack()}
            />}
          {!hideLogo &&
            <Image style={styles.logo} source={Logo} />}
          {!hideContent &&
            <ToolbarContent
              title={title}
              subtitle={subtitle}
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

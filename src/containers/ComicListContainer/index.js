// @flow
import * as React from 'react';

import ComicList from '../../components/ComicList';

type Props = {
  navigation: any,
};

type State = {};

class ComicListContainer extends React.PureComponent<Props, State> {
  render() {
    const { navigation } = this.props;

    return (
      <ComicList
        navigation={navigation}
      />
    );
  }
}

export default (ComicListContainer);

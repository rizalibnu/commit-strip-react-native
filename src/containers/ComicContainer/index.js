// @flow
import * as React from 'react';

import Comic from '../../components/Comic';

type Props = {
  navigation: any,
};

class ComicContainer extends React.PureComponent<Props> {
  render() {
    const { navigation } = this.props;
    return (
      <Comic navigation={navigation} />
    );
  }
}

export default ComicContainer;

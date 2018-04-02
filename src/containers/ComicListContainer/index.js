// @flow
import * as React from 'react';

import ComicList from '../../components/ComicList';

type Props = {
  navigation: any,
};

type State = {
  data: Array<Object>,
  page: number,
  loading: boolean,
  refreshing: boolean,
};

class ComicListContainer extends React.PureComponent<Props, State> {
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
        refreshing: true,
        page: 1,
        data: [],
      },
      () => {
        this.fetchData();
      },
    );
  };

  handleEnd = () => {
    if (this.state.data.length >= 10) {
      this.setState(state => ({ page: state.page + 1 }), () => this.fetchData());
    }
  };

  render() {
    const { navigation } = this.props;
    const { data, loading, refreshing } = this.state;

    return (
      <ComicList
        navigation={navigation}
        data={data}
        loading={loading}
        refreshing={refreshing}
        callbackHandleRefresh={() => this.handleRefresh()}
        callbackHandleEnd={() => this.handleEnd()}
      />
    );
  }
}

export default (ComicListContainer);

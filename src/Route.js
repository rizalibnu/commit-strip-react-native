// @flow
import { StackNavigator } from 'react-navigation';
import ComicListContainer from './containers/ComicListContainer';
import ComicContainer from './containers/ComicContainer';

const Route = StackNavigator(
  {
    ComicList: { screen: ComicListContainer },
    Comic: { screen: ComicContainer },
  },
  {
    initialRouteName: 'ComicList',
    headerMode: 'none',
  },
);

export default Route;

import { compose, withState } from 'recompose';

import GridView from './DiscoverView';

export default compose(
  withState('tabIndex', 'setTabIndex', 1),
  withState('tabs', 'setTabs', ['Grid', 'List 1', 'List 2']),
  withState('data', 'setData', []),
  withState('isRefreshing', 'setRefreshing', false),
  withState('isEndReached', 'setEndReached', false),
  withState('upToPage', 'setUpToPage', 1),
)(GridView);

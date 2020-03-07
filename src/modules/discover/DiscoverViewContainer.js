import { compose, withState } from 'recompose';

import GridView from './DiscoverView';

export default compose(
  withState('tabIndex', 'setTabIndex', 1),
  withState('tabs', 'setTabs', ['Grid', 'List 1', 'List 2']),
  withState('data', 'setData', []),
)(GridView);

import { compose, withState } from 'recompose';

import { ShareScreen } from './ShareView';

export const ShareScreenContainer = compose(
  withState('isExtended', 'setIsExtended', false),
)(ShareScreen);

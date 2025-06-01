import { CircleView } from '../layout/CircleView';
import { colors } from '../../styles';
import SelectedIcon from '../../../assets/images/icons/selected.svg';
import React from 'react';

export const SelectionIndicator = ({ isSelected }) =>
  isSelected ? (
    <CircleView size={25} fill={colors.turquoise}>
      <SelectedIcon width={13} height={13} fill={colors.black} />
    </CircleView>
  ) : (
    <CircleView size={25} fill={colors.darkerGray} />
  );

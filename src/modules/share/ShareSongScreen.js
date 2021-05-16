import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  Button,
  View,
  TouchableOpacity,
} from 'react-native';
import { useShareApi } from './useShareApi';
import { colors } from '../../styles';
import { TextInput } from '../../korui/TextInput';
import { useQuery } from 'react-query';
import { toQuery, useApi } from '../api';
import { MultiselectList } from '../../korui/form/MultiselectList';
import { List } from 'immutable';
import { SectionHeader } from '../../korui/SectionHeader';
import GroupsIcon from '../../../assets/images/icons/groups.svg';
import GlobeIcon from '../../../assets/images/icons/globe.svg';
import { SongInfo } from '../song/SongInfo';
import { SelectionIndicator } from '../../korui/form/SelectionIndicator';

export const ShareSongScreen = ({ navigation, route }) => {
  const api = useApi();
  const { song, reshareOf } = route.params;
  useLayoutEffect(() => {
    if (reshareOf) {
      navigation.setOptions({ title: 'Reshare a song' });
    }
  }, []);

  const { share, error: shareError, status: shareStatus } = useShareApi();
  const [error, setError] = useState(shareError);
  useEffect(() => setError(shareError), [shareError]);

  const [captionInput, setCaptionInput] = useState('');
  const caption = captionInput.length > 0 ? captionInput : undefined;

  const [recipients, setRecipients] = useState(List());
  // Groups
  const {
    data: groups,
    error: groupsError,
    status: groupsStatus,
  } = useQuery('my-groups', toQuery(api.listMyGroups));

  const globalCaptionInputRef = useRef();

  // React.useEffect(
  //   () =>
  //     navigation.addListener('focus', () => {
  //       player.playSong(song);
  //     }),
  //   [navigation],
  // );
  //
  // React.useEffect(
  //   () =>
  //     navigation.addListener('blur', () => {
  //       if (shareStatus === 'ready') {
  //         player.pauseSong();
  //       }
  //     }),
  //   [navigation],
  // );

  const processShare = () => {
    share({
      song,
      reshareOfShareId: reshareOf?.id,
      caption,
      recipients,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: 15,
          marginBottom: 50,
          marginHorizontal: 15,
        }}
      >
        {/* Song info & share button */}
        <View
          style={{
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <SongInfo style={{ flexGrow: 1, flexShrink: 1 }} song={song} />
          <View
            style={{
              paddingLeft: 15,
              width: 90,
              height: 50,
              transform: [{ scale: 0.83 }],
              justifyContent: 'center',
            }}
          >
            {shareStatus === 'loading' ? (
              <ActivityIndicator />
            ) : (
              <Button
                color={colors.turquoise}
                onPress={processShare}
                title="Share"
                disabled={recipients.size === 0}
              />
            )}
          </View>
        </View>
        {/* Recipients */}
        <View style={{ flex: 1 }}>
          {(() => {
            const isGlobalSelected = recipients.some(
              (recipient) => recipient.type === 'global',
            );
            const selectGlobal = () =>
              setRecipients(
                recipients
                  .filter((recipient) => recipient.type !== 'global')
                  .push({ type: 'global' }),
              );
            const deselectGlobal = () => {
              setRecipients(
                recipients.filter((recipient) => recipient.type !== 'global'),
              );
              globalCaptionInputRef.current?.blur();
            };
            return (
              <View>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    marginBottom: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() =>
                    isGlobalSelected ? deselectGlobal() : selectGlobal()
                  }
                >
                  <SectionHeader
                    style={{ flex: 1, marginBottom: 10 }}
                    Icon={GlobeIcon}
                  >
                    Global feed
                  </SectionHeader>
                  <SelectionIndicator isSelected={isGlobalSelected} />
                </TouchableOpacity>
                <TextInput
                  ref={globalCaptionInputRef}
                  style={{
                    fontSize: 12,
                    color: !isGlobalSelected ? colors.gray : colors.white,
                  }}
                  error={error}
                  onChangeText={(value) => {
                    setCaptionInput(value);
                    selectGlobal();
                    setError(undefined);
                  }}
                  characterLimit={45}
                  value={captionInput}
                  placeholder="add a caption (optional)"
                />
              </View>
            );
          })()}
          {groups && groups.length > 0 && (
            <View style={{ flex: 1 }}>
              <View style={{ paddingVertical: 20 }}>
                <SectionHeader Icon={GroupsIcon}>Groups</SectionHeader>
              </View>
              <MultiselectList
                items={groups.map((group) => ({
                  ...group,
                  selected: recipients
                    .filter((recipient) => recipient.type === 'group')
                    .map((recipient) => recipient.id)
                    .includes(group.id),
                }))}
                striped={true}
                onSelect={(group) =>
                  setRecipients(
                    recipients.push({ type: 'group', id: group.id }),
                  )
                }
                onDeselect={(group) =>
                  setRecipients(
                    recipients.filter(
                      (recipient) =>
                        recipient.type !== 'group' || recipient.id !== group.id,
                    ),
                  )
                }
                keyExtractor={(group) => group.id}
                renderItem={({ item: group }) => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/*<View style={{ width: 25, marginRight: 5 }}>*/}
                    {/*  {group.profilePicUrl && (*/}
                    {/*    <Image*/}
                    {/*      style={{*/}
                    {/*        width: '100%',*/}
                    {/*        aspectRatio: 1,*/}
                    {/*      }}*/}
                    {/*      source={{ uri: group.profilePicUrl }}*/}
                    {/*      borderRadius={13}*/}
                    {/*    />*/}
                    {/*  )}*/}
                    {/*</View>*/}
                    <Text style={{ color: colors.white }}>{group.name}</Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

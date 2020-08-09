import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, Button, View } from 'react-native';
import { useShareApi } from './useShareApi';
import { colors } from '../../styles';
import { Song } from '../song/Song';
import { usePlayer } from '../streaming-service/usePlayer';
import { TextInput } from '../../korui/TextInput';
import { useQuery } from 'react-query';
import { toQuery, useApi } from '../api';
import { MultiselectList } from '../../korui/form/MultiselectList';
import { List } from 'immutable';
import { SectionHeader } from '../../korui/SectionHeader';
import GroupsIcon from '../../../assets/images/icons/groups.svg';

export const ShareSongScreen = ({ navigation, route }) => {
  const api = useApi();
  const { song } = route.params;

  const { share, error: shareError, status: shareStatus } = useShareApi();
  const [error, setError] = useState(shareError);
  useEffect(() => setError(shareError), [shareError]);

  const player = usePlayer();
  const [captionInput, setCaptionInput] = useState('');
  const caption = captionInput.length > 0 ? captionInput : undefined;

  const [recipients, setRecipients] = useState(List());
  // Groups
  const { data: groups, error: groupsError, status: groupsStatus } = useQuery(
    'my-groups',
    toQuery(api.listMyGroups),
  );

  React.useEffect(
    () =>
      navigation.addListener('focus', () => {
        player.playSong(song);
      }),
    [navigation],
  );

  React.useEffect(
    () =>
      navigation.addListener('blur', () => {
        if (shareStatus === 'ready') {
          player.pauseSong();
        }
      }),
    [navigation],
  );

  const processShare = () => {
    // always global for now.
    const recipientsWithGlobal = recipients
      .filter((recipient) => recipient.type !== 'global')
      .push({ type: 'global', id: 'global' });
    share({ song, caption, recipients: recipientsWithGlobal });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      <View style={{ marginHorizontal: 15 }}>
        <Song height={300} song={song} />
        <View>
          <View style={{ minHeight: 80 }}>
            <TextInput
              error={error}
              onChangeText={(value) => {
                setCaptionInput(value);
                setError(undefined);
              }}
              characterLimit={45}
              value={captionInput}
              placeholder="add a caption (optional)"
            />
          </View>
          {groups && groups.length > 0 && (
            <MultiselectList
              style={{ height: 200 }}
              items={groups.map((group) => ({
                ...group,
                selected: recipients
                  .filter((recipient) => recipient.type === 'group')
                  .map((recipient) => recipient.id)
                  .includes(group.id),
              }))}
              ListHeaderComponent={() => (
                <View style={{ padding: 20 }}>
                  <SectionHeader style={{ marginBottom: 0 }} Icon={GroupsIcon}>
                    Groups
                  </SectionHeader>
                </View>
              )}
              striped={true}
              onSelect={(group) =>
                setRecipients(recipients.push({ type: 'group', id: group.id }))
              }
              onDeselect={(group) =>
                setRecipients(
                  recipients.filter(
                    (recipient) =>
                      recipient.type === 'group' && recipient.id !== group.id,
                  ),
                )
              }
              keyExtractor={(group) => group.id}
              renderItem={({ item: group }) => (
                <Text style={{ color: colors.white }}>{group.name}</Text>
              )}
            />
          )}
          <View
            style={{
              height: 50,
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
      </View>
    </View>
  );
};

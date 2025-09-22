import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo, useEffect } from 'react';
import { Image } from 'react-native';
import { RefreshControl } from 'react-native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, icons, SIZES } from '~/constants';
import { getNotificationById } from '~/features/notification/service';
import { formatDateandTime, formatTime } from '~/utils/formatDate';

type Notification = {
  uuid: string;
  title: string;
  message: string;
  is_read: boolean;
  updated_at: string;
  recipient_type: string;
};

const FILTERS = ['All', 'Read', 'Unread'] as const;
type FilterType = (typeof FILTERS)[number];

const NotificationScreen: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('All');
  const navigate = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllNotifications = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await getNotificationById({ userId });
      if (response) {
        setNotifications(response?.data?.notifications);
      }
    } catch (error) {
      console.log('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    if (filter === 'Read') {
      filtered = filtered.filter((n) => n.is_read);
    } else if (filter === 'Unread') {
      filtered = filtered.filter((n) => !n.is_read);
    }

    return [...filtered].sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [filter, notifications]);

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={[styles.notificationItem, !item.is_read && styles.unread]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <View style={styles.timeWrapper}>
        <Text style={styles.timeText}>{formatDateandTime(item?.updated_at)}</Text>
      </View>
    </View>
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAllNotifications();
    } catch (error) {
      console.log('Error while refreshing notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 10, flexDirection: 'row', gap: 15, marginVertical: 10 }}>
        <TouchableOpacity style={{}} onPress={() => navigate.goBack()}>
          <Image source={icons.back} style={{ width: 25, height: 25 }} tintColor={COLORS.primary} />
        </TouchableOpacity>
        <View style={{}}>
          <Text style={{ ...FONTS.h2, color: COLORS.primary_text, fontWeight: 500 }}>
            Notifications
          </Text>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.filterContainer}>
        {FILTERS?.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.filterButtonActive]}
            onPress={() => setFilter(type)}>
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notification List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.uuid}
        renderItem={renderNotification}
        contentContainerStyle={{ padding: SIZES.radius }}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications found</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: SIZES.radius,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.lightGrey,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.dark,
    ...FONTS.body4,
    fontWeight: 500,
  },
  filterTextActive: {
    color: COLORS.white,
    ...FONTS.body4,
  },
  notificationItem: {
    backgroundColor: COLORS.lightGray2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  title: {
    ...FONTS.h3,
    fontWeight: 500,
    color: COLORS.primary,
  },
  message: {
    marginTop: 4,
    color: COLORS.black,
    ...FONTS.body5,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.grey,
    marginTop: 50,
    ...FONTS.body3,
  },
  timeWrapper: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  timeText: {
    color: COLORS.grey80,
    ...FONTS.body6,
  },
});

import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import { Image } from 'react-native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, icons, SIZES } from '~/constants';

type Notification = {
  id: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  time: string; // e.g., '2h ago', 'Today, 3:00 PM', etc.
};

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Welcome!',
    message: 'Thanks for joining our service.',
    status: 'read',
    time: '1d ago',
  },
  {
    id: '2',
    title: 'New Offer!',
    message: 'Flat 20% off on all services this week!',
    status: 'unread',
    time: '3h ago',
  },
  {
    id: '3',
    title: 'Reminder',
    message: 'Your car service is due tomorrow.',
    status: 'unread',
    time: '10m ago',
  },
  {
    id: '4',
    title: 'Feedback Request',
    message: 'Please rate your last visit.',
    status: 'read',
    time: '5d ago',
  },
];

const FILTERS = ['All', 'Read', 'Unread'] as const;
type FilterType = (typeof FILTERS)[number];

const NotificationScreen: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('All');
  const navigate = useNavigation();

  const filteredNotifications = useMemo(() => {
    if (filter === 'All') return notifications;
    return notifications.filter((n) => n.status === filter.toLowerCase());
  }, [filter]);

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={[styles.notificationItem, item.status === 'unread' && styles.unread]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <View style={styles.timeWrapper}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingHorizontal: 10 }}>
        <TouchableOpacity style={{}} onPress={() => navigate.goBack()}>
          <Image source={icons.back} style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
        <View style={{}}>
          <Text style={{ ...FONTS.h2, color: COLORS.primary_text }}>Notifications</Text>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.filterContainer}>
        {FILTERS.map((type) => (
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
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={{ padding: SIZES.radius }}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications found</Text>}
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
  },
  message: {
    marginTop: 4,
    color: COLORS.grey,
    ...FONTS.body4,
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
    color: COLORS.grey,
    ...FONTS.body7,
  },
});

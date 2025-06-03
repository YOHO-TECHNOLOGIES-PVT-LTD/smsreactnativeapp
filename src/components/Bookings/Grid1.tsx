import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Replace with your actual image paths
import maintenance from '../../assets/Homepage/Annual_maintenance.jpg';
import carbattery from '../../assets/Homepage/Car_battery.jpg';
import carpainting from '../../assets/Homepage/Car_painting.jpg';
import carbreak from '../../assets/Homepage/Car_brakes.jpg';
import carwash from '../../assets/Homepage/Car_wash.jpg';
import { COLORS, FONTS, icons } from '~/constants';

const Grid1 = () => {
  const [cart, setCart] = useState({});
  const [activeTab, setActiveTab] = useState('Overall');

  const handleQuantityChange = (title, count, price) => {
    setCart((prev) => ({
      ...prev,
      [title]: { count, price },
    }));
  };

  const grandTotal = Object.values(cart).reduce((sum, item) => sum + item.count * item.price, 0);

  const totalQuantity = Object.values(cart).reduce((sum, item) => sum + item.count, 0);

  const handleSummary = () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const day = now.toLocaleDateString(undefined, { weekday: 'long' });

    if (totalQuantity === 0) {
      Alert.alert('No Product Selected', 'Please add at least one product.');
      return;
    }

    const productDetails = Object.entries(cart)
      .filter(([_, item]) => item.count > 0)
      .map(([title, item]) => `${title}: ${item.count}`)
      .join('\n');

    Alert.alert(
      'Order Summary',
      `\nDate: ${date}\nDay: ${day}\nTime: ${time}\nProduct Quantity:\n${productDetails}\n\n\t\t\t\t\tGrand Total: ₹${grandTotal}`
    );
  };

  const renderCard = (title, image, price, isService = false) => (
    <Card
      key={title}
      title={title}
      image={image}
      price={price}
      isService={isService}
      onQuantityChange={handleQuantityChange}
    />
  );

  const renderSelectedCards = () => {
    const allCards = {
      Battery: { image: carbattery, price: 500 },
      'Brake Service': { image: carbreak, price: 750 },
      'Battery Install': { image: carbattery, price: 1200 },
      Painting: { image: carpainting, price: 2000 },
      Maintenance: { image: maintenance, price: 1000 },
      'Car Wash': { image: carwash, price: 300 },
    };

    const selectedItems = Object.entries(cart).filter(([_, item]) => item.count > 0);

    return selectedItems.length === 0 ? (
      <Text style={styles.itemText1}>No item selected</Text>
    ) : (
      selectedItems.map(([title, item]) => {
        const { image, price } = allCards[title] || {};
        return (
          <View key={title} style={styles.selectedCard}>
            <Image source={image} style={styles.selectedImage} resizeMode="cover" />
            <Text style={styles.cardText}>{title}</Text>
            <Text style={styles.priceText}>
              ₹{price} x {item.count} = ₹{price * item.count}
            </Text>
            <Text style={styles.selectedLabel}>Selected</Text>
          </View>
        );
      })
    );
  };

  const renderTabContent = () => {
    const productCards = [
      renderCard('Battery', carbattery, 500),
      renderCard('Brake Service', carbreak, 750),
      renderCard('Battery Install', carbattery, 1200),
      renderCard('Painting', carpainting, 2000),
    ];
    const serviceCards = [
      renderCard('Maintenance', maintenance, 1000, true),
      renderCard('Car Wash', carwash, 300, true),
    ];

    if (activeTab === 'Product') {
      return renderRows(productCards);
    } else if (activeTab === 'Service') {
      return renderRows(serviceCards);
    } else if (activeTab === 'Overall') {
      return renderRows([...productCards, ...serviceCards]);
    }
  };

  const renderRows = (cards) => {
    const rows = [];
    for (let i = 0; i < cards.length; i += 2) {
      rows.push(
        <View key={i} style={styles.row}>
          {cards[i]}
          {cards[i + 1] || <View style={[styles.card, { opacity: 0 }]} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <ImageBackground source={icons.booking_background}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.tabRow}>
            {['Overall', 'Product', 'Service'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderTabContent()}

          <View style={styles.totalListContainer}>
            {Object.values(cart).some((item) => item.count > 0) ? (
              <>
                <View style={styles.itemRow1}>
                  <Text style={[styles.itemText1, { flex: 2, color: COLORS.primary }]}>
                    Product
                  </Text>
                  <Text style={[styles.itemText1, { flex: 1, textAlign: 'center' }]}>-</Text>
                  <Text style={[styles.itemText1, { flex: 1, textAlign: 'center' }]}>Qty</Text>
                  <Text style={[styles.itemText1, { flex: 1, textAlign: 'right' }]}>Total</Text>
                </View>
                {Object.entries(cart).map(([title, item]) =>
                  item.count > 0 ? (
                    <View key={title} style={styles.itemRow2}>
                      <Text style={[styles.itemText1, { flex: 2 }]}>{title}</Text>
                      <Text style={[styles.itemText1, { flex: 1, textAlign: 'center' }]}>-</Text>
                      <Text style={[styles.itemText1, { flex: 1, textAlign: 'center' }]}>
                        {item.count}
                      </Text>
                      <Text style={[styles.itemText1, { flex: 1, textAlign: 'right' }]}>
                        ₹{item.count * item.price}
                      </Text>
                    </View>
                  ) : null
                )}
              </>
            ) : (
              <Text style={styles.itemText1}>No product selected</Text>
            )}
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Grand Total:</Text>
            <Text style={styles.totalAmount}>₹{grandTotal}</Text>
          </View>

          <TouchableOpacity style={styles.infoButton} onPress={handleSummary}>
            <Text style={styles.infoButtonText}>Confirm Order</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

const Card = ({ title, image, price, onQuantityChange, isService = false }) => {
  const [count, setCount] = useState(0);

  const increase = () => {
    const newCount = count + 1;
    setCount(newCount);
    onQuantityChange(title, newCount, price);
  };

  const decrease = () => {
    const newCount = count > 0 ? count - 1 : 0;
    setCount(newCount);
    onQuantityChange(title, newCount, price);
  };

  const handleToggleService = () => {
    const newCount = count > 0 ? 0 : 1;
    setCount(newCount);
    onQuantityChange(title, newCount, price);
  };

  if (isService) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>{title}</Text>
        <Text style={styles.priceText}>₹{price}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: count > 0 ? '#aaa' : COLORS.primary }]}
          onPress={handleToggleService}>
          <Text style={styles.addButtonText}>{count > 0 ? 'Deselect' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.cardImage} resizeMode="cover" />
      <Text style={styles.cardText}>{title}</Text>
      <Text style={styles.priceText}>₹{price} each</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity style={styles.counterButton} onPress={decrease}>
          <Text style={styles.counterButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{count}</Text>
        <TouchableOpacity style={styles.counterButton} onPress={increase}>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.totalText}>Total: ₹{count * price}</Text>
    </View>
  );
};
const style1 = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    flex: 1,
    height: '80%',
  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    height: 260,
    marginHorizontal: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    elevation: 3,
  },
});
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 15, paddingBottom: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  card: {
    backgroundColor: 'white',
    flex: 1,
    height: 260,
    marginHorizontal: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    elevation: 3,
  },
  cardImage: { width: '100%', height: '45%', borderRadius: 8 },
  cardText: { ...FONTS.h4, textAlign: 'center', marginTop: 3 },
  priceText: { color: '#333', ...FONTS.body5, marginTop: 4 },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  counterButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: { ...FONTS.h4 },
  counterValue: { ...FONTS.h4 },
  totalText: { ...FONTS.body5, marginTop: 6, color: '#333' },
  totalListContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginTop: 20,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  itemRow1: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  itemRow2: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  itemText1: { ...FONTS.body4, color: '#333' },
  totalContainer: {
    backgroundColor: '#eee',
    padding: 16,
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: { ...FONTS.h4 },
  totalAmount: { ...FONTS.h4, color: COLORS.primary },
  infoButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    marginTop: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  infoButtonText: { color: COLORS.white, ...FONTS.h4 },
  tabRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 16 },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  activeTabButton: { backgroundColor: COLORS.primary },
  tabButtonText: { color: COLORS.black, ...FONTS.h4 },
  activeTabText: { color: COLORS.white },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  addButtonText: { color: COLORS.white, ...FONTS.h4 },
  selectedCard: {
    backgroundColor: COLORS.white,
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  selectedImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedLabel: {
    marginTop: 6,
    color: COLORS.success_lightgreen,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedGrid: {
    width: '50%',
    paddingBottom: '9%',
    backgroundColor: COLORS.primary,
  },
});

export default Grid1;

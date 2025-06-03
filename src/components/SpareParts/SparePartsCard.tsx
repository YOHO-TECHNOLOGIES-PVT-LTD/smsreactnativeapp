import { StyleSheet, Text, View, Image, Pressable, Dimensions } from 'react-native';
import React from 'react';
import { SparePart } from '../../components/SpareParts/sparePartsData';
import { COLORS, SIZES, FONTS } from '~/constants';

type Props = {
  part: SparePart;
};

const SparePartsCard = ({ part }: Props) => {
  return (
    <Pressable style={styles.card}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={part.images[0]} 
          style={styles.image} 
          resizeMode="contain"
        />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>{part.name}</Text>
        <Text style={styles.price}>₹{part.price}</Text>
        <View style={styles.rowContainer}>
          <View style={[
            styles.stockContainer,
            part.inStock ? styles.inStock : styles.outOfStock
          ]}>
            <Text style={styles.stockText}>
              {part.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
          <Pressable 
            style={styles.addButton}
            onPress={() => console.log('Add to cart')}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
     width: '95%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.lightGray2,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.lightGray1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%', 
    height: '100%',
    objectFit:'cover',
  },
  detailsContainer: {
    paddingHorizontal: 5,
  },
  name: {
    ...FONTS.body4,
    color: COLORS.black,
    marginBottom: 2,
    fontWeight: '600',
    textAlign: 'center',
    height: 30, // Fixed height for two lines
  },
  price: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  stockContainer: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  inStock: {
    backgroundColor: COLORS.success || '#4CAF50',
  },
  outOfStock: {
    backgroundColor: COLORS.error || '#F44336',
  },
  stockText: {
    ...FONTS.body5,
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    width: 60,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
});

export default SparePartsCard;
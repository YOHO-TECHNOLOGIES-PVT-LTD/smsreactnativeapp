import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
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
        <Image source={part.images[0]} style={styles.image} resizeMode="contain" />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {part.name}
        </Text>
        <Text style={styles.type}>{part.type}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{part.price}</Text>
          <View style={[styles.stockContainer, part.inStock ? styles.inStock : styles.outOfStock]}>
            <Text style={styles.stockText}>{part.inStock ? 'In Stock' : 'Out of Stock'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <Text style={styles.addButtonText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: COLORS.success20,
    borderRadius: 8,
    padding: 12,
    margin: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray2,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.light,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    ...FONTS.h4,
    color: COLORS.primary_text,
    fontWeight: '600',
    textAlign: 'left',
    height: 35,
  },
  type: {
    ...FONTS.body5,
    color: COLORS.grey,
    textAlign: 'left',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  stockContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  inStock: {
    backgroundColor: COLORS.success_lightgreen || '#4CAF50',
  },
  outOfStock: {
    backgroundColor: COLORS.error || '#F44336',
  },
  stockText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 4,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    ...FONTS.h5,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
});

export default SparePartsCard;

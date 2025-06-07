import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES, FONTS } from '~/constants';
import { addBookingCartItem } from '~/features/booking-cart/service.ts';

type Props = {
  part: SparePart;
};

type SparePart = {
  uuid: string;
  _id: string;
  productName: string;
  brand: string;
  price: string;
  inStock: boolean;
  stock: number;
  warrantyPeriod?: string;
  image?: string;
}

const SparePartsCard = ({ part }: Props) => {
  const [error, setError] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  const handleAddtoCart = async (part: SparePart) => {
    if (!part?.uuid || !part?.price) {
      console.error('Missing required part data');
      return;
    }
    try {
      const data = {
        uuid: part?.uuid,
        products: {
          productId: part?._id,
          quantity,
          price: part?.price,
        },
        type: 'spare',
      };
      const response = await addBookingCartItem(data);
      if (response) {
        setQuantity(1);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <Pressable style={styles.card}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={
            part?.image
              ? { uri: part.image }
              : require('../../assets/sparepartsimage/parts/brakepads.jpg')
          }
          alt={part?.productName || 'Spare Part Image'}
          style={styles.image}
          resizeMode="contain"
          onError={() => setError(true)}
        />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {part?.productName || 'N/A'}
        </Text>
        <Text style={styles.type}>
          {part?.brand || 'N/A'} • {part?.warrantyPeriod || 'No warranty'}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{parseInt(part?.price || '0').toLocaleString('en-IN')}</Text>
          <View style={[styles.stockContainer, part?.inStock ? styles.inStock : styles.outOfStock]}>
            <Text style={styles.stockText}>
              {part?.inStock ? `In Stock (${part.stock})` : 'Out of Stock'}
            </Text>
          </View>
        </View>

        {/* Quantity Control */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity((q) => q + 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            handleAddtoCart(part);
          }}>
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
    height: 25,
  },
  type: {
    ...FONTS.body5,
    color: COLORS.grey,
    textAlign: 'left',
    marginBlock: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  stockContainer: {
    paddingVertical: 3,
    paddingHorizontal: 4,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGray2,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 12,
  },
  quantityButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quantityButtonText: {
    color: COLORS.white,
    ...FONTS.h5,
  },
  quantityValue: {
    ...FONTS.body4,
    paddingHorizontal: 8,
    fontWeight: '600',
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

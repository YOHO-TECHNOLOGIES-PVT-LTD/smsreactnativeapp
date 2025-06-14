import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import { COLORS, SIZES, FONTS, icons } from '~/constants';
import { addBookingCartItem } from '~/features/booking-cart/service.ts';
import toast from '~/utils/toast';

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
};

const SparePartsCard = ({ part }: Props) => {
  const [error, setError] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);

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
        toast.success('Added', `${part?.productName} is added to cart`);
        setAdded(true);
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
          source={require('../../assets/sparepartsimage/parts/suspension.jpg')}
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
          <Text style={styles.price}>₹ {parseInt(part?.price || '0').toLocaleString('en-IN')}</Text>
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
            style={styles.quantityButton}
            disabled={added}>
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity((q) => q + 1)}
            style={styles.quantityButton}
            disabled={added}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addButton, added && styles.addedButton]}
          onPress={() => {
            if (!added) handleAddtoCart(part);
          }}
          disabled={added}>
          <Text style={styles.addButtonText}>{added ? 'ADDED' : 'ADD TO CART'}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 340,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  name: {
    ...FONTS.h2_02,
    color: COLORS.primary_text,
    fontWeight: '600',
    marginBottom: 3,
  },
  type: {
    ...FONTS.body5,
    color: COLORS.primary,
  },
  priceContainer: {
    marginVertical: 10,
  },
  price: {
    ...FONTS.h3,
    color: COLORS.primary_text,
    fontWeight: 500,
  },
  stockContainer: {
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderRadius: 5,
    width: '65%',
    alignSelf: 'flex-end',
    marginVertical: 5,
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
    textAlign: 'center',
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
    backgroundColor: COLORS.primary_borders,
    paddingVertical: 8,
    borderRadius: 4,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  addButtonText: {
    ...FONTS.h6,
    color: COLORS.white,
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  addedButton: {
    backgroundColor: COLORS.sucesss_darkgreen,
  },
});

export default SparePartsCard;

import { View } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const ServiceCard = ({
  title,
  subtitle,
  price,
  warranty,
  location,
}: {
  title: string;
  subtitle: string;
  price: string;
  warranty: string;
  location: string;
}) => {
  return (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>{title}</Text>
        {subtitle ? <Text style={styles.serviceSubtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.serviceDetails}>
        {price ? <Text style={styles.servicePrice}>{price}</Text> : null}
        {warranty ? <Text style={styles.serviceWarranty}>{warranty}</Text> : null}
        {location ? <Text style={styles.serviceLocation}>{location}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  serviceDetails: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  serviceWarranty: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  serviceLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default ServiceCard;

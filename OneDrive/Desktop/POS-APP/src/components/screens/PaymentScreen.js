import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/store';

const PaymentScreen = ({ navigation }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const { state, createOrder } = useAppContext();

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      createOrder(selectedPayment);
      setLoading(false);
      navigation.navigate('Receipt');
    }, 800);
  };

  const PaymentOption = ({ method, icon, label, description }) => (
    <TouchableOpacity
      style={[
        styles.paymentOption,
        selectedPayment === method && styles.paymentOptionSelected,
      ]}
      onPress={() => setSelectedPayment(method)}
    >
      <View style={styles.paymentOptionContent}>
        <View
          style={[
            styles.paymentIcon,
            selectedPayment === method && styles.paymentIconSelected,
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={32}
            color={selectedPayment === method ? '#fff' : '#16a085'}
          />
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>{label}</Text>
          <Text style={styles.paymentDescription}>{description}</Text>
        </View>
      </View>
      <View
        style={[
          styles.radioButton,
          selectedPayment === method && styles.radioButtonSelected,
        ]}
      >
        {selectedPayment === method && (
          <MaterialCommunityIcons name="check" size={16} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1a1a1a" />
        </TouchableOpacity> */}
        {/* <Text style={styles.title}>Payment Method</Text> */}
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>₹{total.toFixed(2)}</Text>
        </View>

        <Text style={styles.selectText}>Select Payment Method</Text>

        <PaymentOption
          method="cash"
          icon="cash"
          label="Cash"
          description="Pay with cash at counter"
        />

        <PaymentOption
          method="upi"
          icon="qrcode"
          label="UPI"
          description="Pay using UPI apps"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.payButtonText}>
            {loading ? 'Processing...' : 'Pay Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  amountCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  amountLabel: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#16a085',
  },
  selectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentOptionSelected: {
    borderColor: '#16a085',
    backgroundColor: '#f0fffe',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0fffe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentIconSelected: {
    backgroundColor: '#16a085',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 12,
    color: '#999',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#16a085',
    backgroundColor: '#16a085',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  payButton: {
    flex: 1,
    backgroundColor: '#16a085',
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default PaymentScreen;

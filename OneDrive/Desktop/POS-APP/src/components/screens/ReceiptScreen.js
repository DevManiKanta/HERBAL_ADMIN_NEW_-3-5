import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/store';

const ReceiptScreen = ({ navigation }) => {
  const { state } = useAppContext();
  const order = state.orders[state.orders.length - 1];

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>No order found</Text>
      </View>
    );
  }

  const handlePrint = () => {
    Alert.alert('Success', 'Receipt printed successfully');
  };

  const handleNewOrder = () => {
    navigation.navigate('Billing');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="check-circle" size={60} color="#16a085" />
        <Text style={styles.successText}>Payment Successful</Text>
        <Text style={styles.successSubtext}>Your order has been confirmed</Text>
      </View>

      <View style={styles.receiptCard}>
        {/* Bill Header */}
        <View style={styles.billHeader}>
          <View style={styles.billHeaderContent}>
            <Text style={styles.billNumber}>Bill #{order.id}</Text>
            <Text style={styles.billDate}>{order.date}</Text>
          </View>
          <View style={styles.billStatus}>
            <MaterialCommunityIcons name="check" size={20} color="#fff" />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.receiptItem}>
              <View style={styles.receiptItemLeft}>
                <Text style={styles.receiptItemName}>{item.name}</Text>
                <Text style={styles.receiptItemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.receiptItemPrice}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{order.total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>₹0.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.summaryValue}>₹0.00</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{order.total.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        {/* Payment Method */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentRow}>
            <MaterialCommunityIcons
              name={order.paymentMethod === 'cash' ? 'cash' : 'qrcode'}
              size={20}
              color="#16a085"
            />
            <Text style={styles.paymentMethod}>
              {order.paymentMethod === 'cash' ? 'Cash Payment' : 'UPI Payment'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Footer Message */}
        <View style={styles.footerMessage}>
          <MaterialCommunityIcons name="information" size={16} color="#999" />
          <Text style={styles.footerText}>Thank you for your purchase!</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
          <MaterialCommunityIcons name="printer" size={20} color="#16a085" />
          <Text style={styles.printButtonText}>Print Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.newOrderButton} onPress={handleNewOrder}>
          <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
          <Text style={styles.newOrderButtonText}>New Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
  },
  successSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  receiptCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  billHeaderContent: {
    flex: 1,
  },
  billNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  billDate: {
    fontSize: 12,
    color: '#999',
  },
  billStatus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16a085',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  itemsSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptItemLeft: {
    flex: 1,
  },
  receiptItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  receiptItemQty: {
    fontSize: 12,
    color: '#999',
  },
  receiptItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  summarySection: {
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
  },
  summaryValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  totalSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#16a085',
  },
  paymentSection: {
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentMethod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  footerMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 30,
  },
  printButton: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#16a085',
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  printButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a085',
  },
  newOrderButton: {
    flexDirection: 'row',
    backgroundColor: '#16a085',
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  newOrderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ReceiptScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/store';

const DUMMY_ORDERS = [
  {
    id: 'ORD-001',
    items: [
      { name: 'Idly (Single)', quantity: 2, price: 25 },
      { name: 'Dosa (Half)', quantity: 1, price: 25 },
    ],
    total: 75,
    paymentMethod: 'cash',
    date: '2024-03-13 10:30 AM',
    status: 'completed',
  },
  {
    id: 'ORD-002',
    items: [
      { name: 'Bonda (Single)', quantity: 3, price: 20 },
      { name: 'Vada (Half)', quantity: 2, price: 15 },
    ],
    total: 90,
    paymentMethod: 'upi',
    date: '2024-03-13 11:15 AM',
    status: 'completed',
  },
  {
    id: 'ORD-003',
    items: [
      { name: 'Poori (Single)', quantity: 1, price: 35 },
      { name: 'Idly (Half)', quantity: 2, price: 15 },
    ],
    total: 65,
    paymentMethod: 'cash',
    date: '2024-03-13 12:00 PM',
    status: 'completed',
  },
  {
    id: 'ORD-004',
    items: [
      { name: 'Dosa (Single)', quantity: 2, price: 40 },
    ],
    total: 80,
    paymentMethod: 'upi',
    date: '2024-03-13 01:30 PM',
    status: 'completed',
  },
  {
    id: 'ORD-005',
    items: [
      { name: 'Bonda (Half)', quantity: 4, price: 12 },
      { name: 'Vada (Single)', quantity: 1, price: 25 },
    ],
    total: 73,
    paymentMethod: 'cash',
    date: '2024-03-13 02:45 PM',
    status: 'completed',
  },
];

const OrdersScreen = () => {
  const { state } = useAppContext();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const allOrders = [...DUMMY_ORDERS, ...state.orders];
  
  const filteredOrders = selectedFilter === 'all' 
    ? allOrders 
    : allOrders.filter(order => order.paymentMethod === selectedFilter);

  const renderOrderCard = ({ item }) => (
    <View style={styles.orderCard}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.orderIdSection}>
          <View style={styles.orderIdBadge}>
            <MaterialCommunityIcons name="receipt-text" size={16} color="#16a085" />
          </View>
          <View>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
        </View>
        <View style={[
          styles.paymentBadge,
          { backgroundColor: item.paymentMethod === 'cash' ? '#fff3cd' : '#d1ecf1' }
        ]}>
          <MaterialCommunityIcons 
            name={item.paymentMethod === 'cash' ? 'cash' : 'qrcode'} 
            size={18}
            color={item.paymentMethod === 'cash' ? '#856404' : '#0c5460'} 
          />
          <Text style={[
            styles.paymentText,
            { color: item.paymentMethod === 'cash' ? '#856404' : '#0c5460' }
          ]}>
            {item.paymentMethod === 'cash' ? 'Cash' : 'UPI'}
          </Text>
        </View>
      </View>

      {/* Items Section */}
      <View style={styles.itemsSection}>
        <Text style={styles.itemsTitle}>Items ({item.items.length})</Text>
        <View style={styles.itemsList}>
          {item.items.map((orderItem, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <View style={styles.itemDot} />
                <Text style={styles.itemName}>{orderItem.name}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemQty}>x{orderItem.quantity}</Text>
                <Text style={styles.itemPrice}>₹{(orderItem.price * orderItem.quantity).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Total Section */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>₹{item.total.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.grandTotalLabel}>Total Amount</Text>
          <Text style={styles.grandTotalValue}>₹{item.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      {/* <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.viewButton}>
          <MaterialCommunityIcons name="eye" size={16} color="#16a085" />
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.printButton}>
          <MaterialCommunityIcons name="printer" size={16} color="#fff" />
          <Text style={styles.printButtonText}>Print</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );

  const filterOptions = [
    { label: 'All Orders', value: 'all', icon: 'receipt-text' },
    { label: 'Cash', value: 'cash', icon: 'cash' },
    { label: 'UPI', value: 'upi', icon: 'qrcode' },
  ];

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                selectedFilter === option.value && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(option.value)}
            >
              <MaterialCommunityIcons 
                name={option.icon} 
                size={16}
                color={selectedFilter === option.value ? '#fff' : '#16a085'}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === option.value && styles.filterTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Orders</Text>
          <Text style={styles.statValue}>{filteredOrders.length}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <Text style={styles.statValue}>₹{filteredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}</Text>
        </View>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  filterSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#16a085',
    borderColor: '#16a085',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a085',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderIdSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  orderIdBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0fffe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 10,
    color: '#999',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a085',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a1a',
    flex: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemQty: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'right',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a085',
    minWidth: 50,
    textAlign: 'right',
  },
  totalSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '700',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a085',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#16a085',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a085',
  },
  printButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a085',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  printButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export default OrdersScreen;

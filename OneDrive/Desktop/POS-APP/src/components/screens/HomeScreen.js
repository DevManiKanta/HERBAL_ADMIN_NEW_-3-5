import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/store';

const HomeScreen = ({ navigation }) => {
  const { state } = useAppContext();

  const stats = [
    {
      label: 'Orders',
      value: 10,
      icon: 'receipt-text',
      color: '#16a085',
      onPress: () => navigation.navigate('OrdersTab'),
    },
    {
      label: 'Revenue',
      // value: `₹${state.orders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}`,
      value:3000,
      icon: 'cash-multiple',
      color: '#27ae60',
      onPress: () => {},
    },
    {
      label: 'Items',
      value: state.products.length,
      icon: 'silverware-fork-knife',
      color: '#e74c3c',
      onPress: () => {},
    },
    {
      label: 'Cart',
      value: state.cart.length,
      icon: 'cart',
      color: '#3498db',
      onPress: () => navigation.navigate('BillingScreen'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome Back!</Text>
        <Text style={styles.subGreeting}>Smart Billing POS</Text>
      </View>

      {/* Stats Cards - 4 in a row */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.statCard}
            onPress={stat.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
              <MaterialCommunityIcons name={stat.icon} size={24} color="#fff" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('BillingScreen')}
        >
          <View style={styles.actionIconContainer}>
            <MaterialCommunityIcons name="plus-circle" size={40} color="#16a085" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>New Order</Text>
            <Text style={styles.actionDesc}>Start taking orders</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('DashboardTab')}
        >
          <View style={styles.actionIconContainer}>
            <MaterialCommunityIcons name="plus" size={40} color="#e74c3c" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Add Products</Text>
            <Text style={styles.actionDesc}>Manage your menu</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Recent Orders */}
      {state.orders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {state.orders.slice(-3).reverse().map((order, index) => (
            <View key={index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderAmount}>₹{order.total.toFixed(2)}</Text>
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.orderDate}>{order.date}</Text>
                <View style={styles.paymentBadge}>
                  <Text style={styles.paymentText}>
                    {order.paymentMethod === 'cash' ? '💵 Cash' : '📱 UPI'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    width: '23%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    color: '#999',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#16a085',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a085',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 11,
    color: '#999',
  },
  paymentBadge: {
    backgroundColor: '#f0fffe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paymentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16a085',
  },
  spacer: {
    height: 40,
  },
});

export default HomeScreen;

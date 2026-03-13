import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../context/store';

const MENU_ITEMS = [
  { id: '1', name: 'Idly', icon: 'bread-slice', portions: { half: 15, single: 25 } },
  { id: '2', name: 'Dosa', icon: 'silverware-fork-knife', portions: { half: 25, single: 40 } },
  { id: '3', name: 'Bonda', icon: 'hamburger', portions: { half: 12, single: 20 } },
  { id: '4', name: 'Vada', icon: 'cake-layered', portions: { half: 15, single: 25 } },
  { id: '5', name: 'Poori', icon: 'bread-slice-outline', portions: { half: 20, single: 35 } },
];

const BillingScreen = ({ navigation }) => {
  const { state, addToCart } = useAppContext();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPortion, setSelectedPortion] = useState(null);
  const cartCount = state.cart.length;

  const handleAddItem = (item) => {
    setSelectedItem(item);
    setSelectedPortion(null);
  };

  const handlePortionSelect = (portion) => {
    setSelectedPortion(portion);
  };

  const handleConfirmAdd = () => {
    if (selectedItem && selectedPortion) {
      const price = selectedItem.portions[selectedPortion];
      const portionLabel = selectedPortion === 'half' ? 'Half' : 'Single';
      
      addToCart({
        id: `${selectedItem.id}-${selectedPortion}`,
        name: selectedItem.name,
        icon: selectedItem.icon,
        price,
        portion: selectedPortion,
        portionLabel,
        cartId: `${selectedItem.id}-${selectedPortion}-${Date.now()}`,
      });
      setSelectedItem(null);
      setSelectedPortion(null);
    }
  };

  const getIconBgColor = (id) => {
    const colors = ['#FFB84D', '#16a085', '#FFB84D', '#E74C3C', '#3498DB'];
    return colors[parseInt(id) - 1];
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={styles.itemContent}>
        <View style={[styles.iconContainer, { backgroundColor: getIconBgColor(item.id) }]}>
          <MaterialCommunityIcons name={item.icon} size={28} color="#fff" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Half: ₹{item.portions.half}</Text>
            <Text style={styles.priceSeparator}>•</Text>
            <Text style={styles.priceLabel}>Single: ₹{item.portions.single}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddItem(item)}
      >
        <MaterialCommunityIcons name="plus" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MENU_ITEMS}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
        scrollEnabled={true}
      />

      {cartCount > 0 && (
        <View style={styles.cartFooter}>
          <View>
            <Text style={styles.cartItemsText}>
              {cartCount} item{cartCount > 1 ? 's' : ''} added
            </Text>
            <Text style={styles.cartTotalText}>
              ₹{state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.viewCartButtonText}>View Cart</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color="#16a085" />
          </TouchableOpacity>
        </View>
      )}

      {/* Portion Selection Modal */}
      <Modal
        visible={selectedItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Portion</Text>
              <TouchableOpacity onPress={() => setSelectedItem(null)}>
                <MaterialCommunityIcons name="close" size={24} color="#1a1a1a" />
              </TouchableOpacity>
            </View>

            <View style={styles.itemDisplayCard}>
              <View style={[styles.itemDisplayIcon, { backgroundColor: getIconBgColor(selectedItem?.id) }]}>
                <MaterialCommunityIcons name={selectedItem?.icon} size={40} color="#fff" />
              </View>
              <Text style={styles.itemDisplayName}>{selectedItem?.name}</Text>
            </View>

            <Text style={styles.portionLabel}>Choose your portion size:</Text>

            <View style={styles.portionOptions}>
              <TouchableOpacity
                style={[
                  styles.portionButton,
                  selectedPortion === 'half' && styles.portionButtonSelected,
                ]}
                onPress={() => handlePortionSelect('half')}
              >
                <View style={styles.portionHeader}>
                  <MaterialCommunityIcons
                    name="bowl-mix"
                    size={32}
                    color={selectedPortion === 'half' ? '#fff' : '#16a085'}
                  />
                  <Text
                    style={[
                      styles.portionButtonText,
                      selectedPortion === 'half' && styles.portionButtonTextSelected,
                    ]}
                  >
                    Half Plate
                  </Text>
                </View>
                <Text
                  style={[
                    styles.portionPrice,
                    selectedPortion === 'half' && styles.portionPriceSelected,
                  ]}
                >
                  ₹{selectedItem?.portions.half}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.portionButton,
                  selectedPortion === 'single' && styles.portionButtonSelected,
                ]}
                onPress={() => handlePortionSelect('single')}
              >
                <View style={styles.portionHeader}>
                  <MaterialCommunityIcons
                    name="bowl"
                    size={32}
                    color={selectedPortion === 'single' ? '#fff' : '#16a085'}
                  />
                  <Text
                    style={[
                      styles.portionButtonText,
                      selectedPortion === 'single' && styles.portionButtonTextSelected,
                    ]}
                  >
                    Single Plate
                  </Text>
                </View>
                <Text
                  style={[
                    styles.portionPrice,
                    selectedPortion === 'single' && styles.portionPriceSelected,
                  ]}
                >
                  ₹{selectedItem?.portions.single}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedItem(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !selectedPortion && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirmAdd}
                disabled={!selectedPortion}
              >
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
                <Text style={styles.confirmButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  priceSeparator: {
    fontSize: 11,
    color: '#ccc',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#16a085',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#16a085',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cartItemsText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  cartTotalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 3,
  },
  viewCartButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  itemDisplayCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  itemDisplayIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemDisplayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  portionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  portionOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  portionButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  portionButtonSelected: {
    borderColor: '#16a085',
    backgroundColor: '#16a085',
  },
  portionHeader: {
    alignItems: 'center',
    gap: 6,
  },
  portionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  portionButtonTextSelected: {
    color: '#fff',
  },
  portionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a085',
    marginTop: 4,
  },
  portionPriceSelected: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
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
  confirmButton: {
    flex: 1,
    backgroundColor: '#16a085',
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BillingScreen;

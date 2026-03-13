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

const SettingsScreen = ({ navigation }) => {
  const { logout, state } = useAppContext();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => {
          logout();
        },
        style: 'destructive',
      },
    ]);
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'account',
          label: 'Profile',
          value: state.user?.email || 'Not logged in',
          onPress: () => {},
        },
        {
          icon: 'lock',
          label: 'Change Password',
          value: '••••••••',
          onPress: () => Alert.alert('Info', 'Password change feature coming soon'),
        },
      ],
    },
    // {
    //   title: 'App Settings',
    //   items: [
    //     {
    //       icon: 'bell',
    //       label: 'Notifications',
    //       value: 'Enabled',
    //       onPress: () => Alert.alert('Info', 'Notification settings coming soon'),
    //     },
    //     {
    //       icon: 'palette',
    //       label: 'Theme',
    //       value: 'Light',
    //       onPress: () => Alert.alert('Info', 'Theme settings coming soon'),
    //     },
    //     {
    //       icon: 'translate',
    //       label: 'Language',
    //       value: 'English',
    //       onPress: () => Alert.alert('Info', 'Language settings coming soon'),
    //     },
    //   ],
    // },
    // {
    //   title: 'Business',
    //   items: [
    //     {
    //       icon: 'store',
    //       label: 'Store Name',
    //       value: 'Smart Billing',
    //       onPress: () => Alert.alert('Info', 'Store settings coming soon'),
    //     },
    //     {
    //       icon: 'phone',
    //       label: 'Contact Number',
    //       value: '+91 XXXXXXXXXX',
    //       onPress: () => Alert.alert('Info', 'Contact settings coming soon'),
    //     },
    //   ],
    // },
    {
      title: 'About',
      items: [
        {
          icon: 'information',
          label: 'App Version',
          value: '1.0.0',
          onPress: () => {},
        },
        {
          icon: 'file-document',
          label: 'Terms & Conditions',
          value: '',
          onPress: () => Alert.alert('Terms', 'Terms & Conditions content'),
        },
        {
          icon: 'shield-check',
          label: 'Privacy Policy',
          value: '',
          onPress: () => Alert.alert('Privacy', 'Privacy Policy content'),
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your preferences</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex !== section.items.length - 1 && styles.settingItemBorder,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={item.icon} size={20} color="#16a085" />
                  </View>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <View style={styles.settingRight}>
                  {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0fffe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  spacer: {
    height: 40,
  },
});

export default SettingsScreen;

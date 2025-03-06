import { StyleSheet, View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { Download, Map, Settings, Info } from 'lucide-react-native';

export default function MoreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Map Settings</Text>
        <View style={styles.option}>
          <View style={styles.optionContent}>
            <Download size={24} color="#64748b" />
            <Text style={styles.optionText}>Download Offline Maps</Text>
          </View>
          <Switch />
        </View>
        <View style={styles.option}>
          <View style={styles.optionContent}>
            <Map size={24} color="#64748b" />
            <Text style={styles.optionText}>Show Building Labels</Text>
          </View>
          <Switch />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <Pressable style={styles.option}>
          <View style={styles.optionContent}>
            <Settings size={24} color="#64748b" />
            <Text style={styles.optionText}>Settings</Text>
          </View>
        </Pressable>
        <Pressable style={styles.option}>
          <View style={styles.optionContent}>
            <Info size={24} color="#64748b" />
            <Text style={styles.optionText}>About</Text>
          </View>
        </Pressable>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    paddingTop: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#334155',
    marginLeft: 12,
  },
  version: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
});
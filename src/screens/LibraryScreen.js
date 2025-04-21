import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; // or another icon package
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function LibraryScreen() {
  const [articles, setArticles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingArticle, setEditingArticle] = useState(null); // holds the article being edited

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const stored = await AsyncStorage.getItem('articles');
    if (stored) setArticles(JSON.parse(stored));
  };

  const saveArticles = async (updatedArticles) => {
    await AsyncStorage.setItem('articles', JSON.stringify(updatedArticles));
    setArticles(updatedArticles);
  };

  const addArticle = () => {
    if (!newTitle || !newContent) {
      Alert.alert("Title and content can't be empty");
      return;
    }
    const newArticle = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
    };
    const updated = [...articles, newArticle];
    saveArticles(updated);
    setNewTitle('');
    setNewContent('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.articleCard}>
            <Text style={styles.title}>{item.title}</Text>
            <TouchableOpacity
              onPress={() => {
                setEditingArticle(item);
                setNewTitle(item.title);
                setNewContent(item.content);
                setModalVisible(true);
              }}
            >
              <Text style={{ color: '#3b82f6' }}>
                Edit
              
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: '#fff', fontSize: 24 }}> + </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Enter title"
          />
          <Text style={styles.label}>Content:</Text>
          <TextInput
            style={[styles.input, { height: 150 }]}
            value={newContent}
            onChangeText={setNewContent}
            placeholder="Enter content"
            multiline
          />
          <TouchableOpacity onPress={addArticle} style={styles.saveBtn}>
            <Text style={{ color: '#fff' }}>Save Article</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ marginTop: 10, color: 'red' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  articleCard: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    padding: 15,
    elevation: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: { fontWeight: 'bold', marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
});

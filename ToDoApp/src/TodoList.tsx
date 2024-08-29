import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
};

const TodoList = (): React.JSX.Element => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Fetch to-do items from the backend
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/todos/');  // Use localhost
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      Alert.alert('Error', 'Unable to fetch todos from the server.');
    }
  };

  // Add a new to-do item
  const addTodo = async () => {
    if (!title) {
      Alert.alert('Validation Error', 'Please enter a title for the to-do.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/todos/', { title, description });  // Use localhost
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
      Alert.alert('Error', 'Unable to add todo to the server.');
    }
  };

  // Delete a to-do item
  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/todos/${id}/`);  // Use localhost
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      Alert.alert('Error', 'Unable to delete todo from the server.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Add To-Do" onPress={addTodo} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button title="Delete" onPress={() => deleteTodo(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default TodoList;

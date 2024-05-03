import React, { FC, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import useConfig from "../../../hooks/useConfig";
import fetchAPI from "../../../lib/api";

interface TagAnnotationInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

interface AutocompleteListProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const AutocompleteList: FC<AutocompleteListProps> = ({ suggestions, onSelect }) => (
  <FlatList
    data={suggestions}
    keyExtractor={(item) => item}
    style={{ backgroundColor: "#fff", width: "100%", borderRadius: 20, borderWidth: 1, borderColor: "lightgray" }}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => onSelect(item)} style={styles.suggestionItem}>
        <Text style={styles.suggestionText}>{item}</Text>
      </TouchableOpacity>
    )}
  />
);

const TagAnnotationInput: FC<TagAnnotationInputProps> = ({ tags: initialTags, onTagsChange }) => {
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { api_url } = useConfig();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (inputValue && api_url) {
        fetchAPI(api_url, `/tags/autocomplete`, { search: inputValue })
          .then((response) => {
            if (response.success && response.data) {
              setSuggestions(response.data);
            } else {
              setSuggestions([]);
              console.error(response.message || "Failed to fetch suggestions");
            }
          })
          .catch((error) => console.error(error));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, api_url]);

  const handleInputChange = (text: string) => {
    const lastChar = text.charAt(text.length - 1);
    if (lastChar === ",") {
      const newTag = text.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue("");
      setSuggestions([]);
    } else {
      setInputValue(text);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInputValue("");
    setSuggestions([]);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(index)} style={styles.tagCloseButton}>
              <Text style={styles.tagCloseText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput value={inputValue} onChangeText={handleInputChange} style={styles.input} placeholder='Type tags, separated by commas...' />
      {suggestions.length > 0 && <AutocompleteList suggestions={suggestions} onSelect={addTag} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    padding: 8,
    marginRight: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  tagText: {
    color: "#333",
    marginRight: 5,
  },
  tagCloseButton: {
    backgroundColor: "#a0a0a0",
    borderRadius: 10,
  },
  tagCloseText: {
    color: "#fff",
    fontSize: 16,
    padding: 2,
  },
  input: {
    flex: 1,
    minHeight: 38,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    width: "100%",
  },
  suggestionItem: {
    width: "100%",
    backgroundColor: "#fffffff",
    padding: 8,
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 2,
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
  },
});

export default TagAnnotationInput;

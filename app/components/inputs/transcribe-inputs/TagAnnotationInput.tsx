import React, { FC, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Modal from "../../../components/Modal";
import useConfig from "../../../hooks/useConfig";
import fetchAPI from "../../../lib/api";
import { Tag } from "../../../types/annotation";
import shortid from "shortid";
import _ from "lodash";

interface TagAnnotationInputProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

interface AutocompleteListProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const AutocompleteList: FC<AutocompleteListProps> = ({ suggestions, onSelect }) => (
  <View style={styles.autocompleteList}>
    {suggestions.map((item, index) => (
      <TouchableOpacity key={index} onPress={() => onSelect(item)} style={styles.suggestionItem}>
        <Text style={styles.suggestionText}>{item}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const TagAnnotationInput: FC<TagAnnotationInputProps> = ({ tags: initialTags, onTagsChange }) => {
  const [tags, setTags] = useState<Tag[]>(initialTags || []);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { api_url } = useConfig();

  useEffect(() => {
    if (!_.isEqual(initialTags, tags)) {
      onTagsChange(tags);
    }
  }, [tags]);

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

  const insertTag = async (tag: string): Promise<Tag | null> => {
    try {
      const res = await fetchAPI(api_url, `/tags/insert`, { tag }, "POST");
      if (res.success && res.data) {
        return res.data;
      } else {
        console.error(res.message || "Failed to insert tag");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleInputChange = (text: string) => {
    const lastChar = text.charAt(text.length - 1);
    if (lastChar === ",") {
      const newTag = text.slice(0, -1).trim();
      if (newTag && !tags.some((t) => t.tag === newTag)) {
        addNewTag(newTag);
      }
      setInputValue("");
      setSuggestions([]);
    } else {
      setInputValue(text);
    }
  };

  const setUniqueTags = (newTags: Tag[]) => {
    const uniqueTags = _.uniqBy([...tags, ...newTags], "tag");
    setTags(uniqueTags);
  };

  const addNewTag = async (tag: string) => {
    if (tag && !tags.some((t) => t.tag === tag)) {
      const insertedTag = await insertTag(tag);
      if (insertedTag) {
        setUniqueTags([insertedTag]);
      }
    }
    setInputValue("");
    setSuggestions([]);
  };

  const addTagFromSuggestion = (suggestion: string) => {
    const tag = suggestions.find((t) => t.tag === suggestion);
    if (tag) {
      setUniqueTags([tag]);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const toggleModal = () => setModalVisible(!modalVisible);
  return (
    <View style={styles.container}>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag.tag}</Text>
            <TouchableOpacity onPress={() => removeTag(index)} style={styles.tagCloseButton}>
              <Feather name='x' size={18} color='gray' />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={toggleModal} style={styles.editTagsButton}>
        <Text style={styles.editTagsButtonText}>Edit Tags</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} onRequestClose={toggleModal} verticalPosition='top'>
        <View style={styles.inputContainer}>
          <TextInput
            value={inputValue}
            onChangeText={handleInputChange}
            style={[styles.input, { flex: 1 }]}
            placeholder='Search tags or type a new one...'
            placeholderTextColor={"gray"}
          />
          {inputValue && (
            <TouchableOpacity onPress={() => addNewTag(inputValue)} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
        {suggestions.length > 0 && <AutocompleteList suggestions={suggestions.map((t) => t.tag)} onSelect={addTagFromSuggestion} />}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    borderRadius: 10,
  },
  tagCloseText: {
    color: "#fff",
    fontSize: 16,
    width: 20,
    height: 20,
  },
  editTagsButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  editTagsButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: "#007bff",
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    minHeight: 38,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    width: "100%",
  },
  autocompleteList: {
    maxHeight: 200,
    overflow: "scroll",
    width: "100%",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  suggestionItem: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 2,
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
  },
  modalContent: {
    width: "100%",
    padding: 20,
  },
});

export default TagAnnotationInput;

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import useQuery from "../hooks/useQuery";
import useConfig from "../hooks/useConfig";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

interface FileSystemPageProps {}

interface FileItem {
  name: string;
  generic_file_type: string;
  specific_file_type: string;
  is_directory: boolean;
  size_bytes: number;
  added_at: Date;
  created_at: Date;
  modified_at: Date;
}

const iconLookup = {
  mp4: <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  avi: <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  flv: <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  mov: <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  webm: <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  mkv: <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  mpeg: <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  mpv: <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  m2v: <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  "3gp": <Feather name='video' size={16} color='black' style={{ marginRight: 8 }} />,
  jpg: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  jpeg: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  png: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  heic: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  gif: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  bmp: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  svg: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  tiff: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  tif: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  webp: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  ico: <Feather name='image' size={16} color='black' style={{ marginRight: 8 }} />,
  mp3: <Feather name='music' size={16} color='black' style={{ marginRight: 8 }} />,
  wav: <Feather name='music' size={16} color='black' style={{ marginRight: 8 }} />,
  ogg: <Feather name='music' size={16} color='black' style={{ marginRight: 8 }} />,
  flac: <Feather name='music' size={16} color='black' style={{ marginRight: 8 }} />,
  aac: <Feather name='music' size={16} color='black' style={{ marginRight: 8 }} />,
  m4a: <Feather name='music' size={16} color='black' style={{ marginRight: 8 }} />,
  aiff: <Feather name='music' size={16} color='black' style={{ marginRight: 8 }} />,
  txt: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  doc: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  docx: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  pdf: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  odt: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  rtf: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  tex: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  wks: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  wps: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  wpd: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  pages: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  md: <Feather name='file-text' size={16} color='black' style={{ marginRight: 8 }} />,
  csv: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  xls: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  xlsx: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  ppt: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  pptx: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  json: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  xml: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  sql: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  db: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  log: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
  dat: <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />,
};

const DirectoryItem: React.FC<{ name: string; onSelect: () => void }> = ({ name, onSelect }) => (
  <TouchableOpacity onPress={onSelect} style={styles.directoryItem}>
    <Feather name='folder' size={16} color='black' style={{ marginRight: 8 }} />
    <Text style={styles.directoryText}>{name}</Text>
  </TouchableOpacity>
);
const FileItemComponent: React.FC<{ name: string; onLoad: () => void }> = ({ name, onLoad }) => {
  const fileExtension = name.split(".").pop() || "";
  const icon = iconLookup[fileExtension.toLowerCase()] || <Feather name='file' size={16} color='black' style={{ marginRight: 8 }} />;

  return (
    <TouchableOpacity onPress={onLoad} style={styles.fileItem}>
      {icon}
      <Text style={styles.fileText}>{name}</Text>
    </TouchableOpacity>
  );
};

const DirectoryView: React.FC<{ path: string; onSelectDirectory: (path: string) => void; onLoadFile: (path: string) => void }> = ({
  path,
  onSelectDirectory,
  onLoadFile,
}) => {
  const { data, isLoading, error } = useQuery<FileItem[]>("paths/read-dir", { path });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) =>
        item.is_directory ? (
          <DirectoryItem key={item.name} name={item.name} onSelect={() => onSelectDirectory(`${path}/${item.name}`)} />
        ) : (
          <FileItemComponent key={item.name} name={item.name} onLoad={() => onLoadFile(`${path}/${item.name}`)} />
        )
      }
    />
  );
};

const FileSystemPage: React.FC<FileSystemPageProps> = () => {
  const { data: configData } = useConfig();
  const [currentPath, setCurrentPath] = useState<string>("");
  const [pathHistory, setPathHistory] = useState<string[]>([]);

  const handleSelectDirectory = (path: string) => {
    setPathHistory((prev) => [...prev, currentPath]);
    setCurrentPath(path);
  };

  const handleLoadFile = (path: string) => {
    // Implement file loading logic here
    console.log(`Load file at ${path}`);
  };

  const handleBack = () => {
    setCurrentPath(pathHistory.pop() || "");
    setPathHistory(pathHistory.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.currentPath}>{currentPath || "Select a Storage Location:"}</Text>
      {currentPath === "" ? (
        configData.root_paths.map((path) => <DirectoryItem key={path} name={path} onSelect={() => handleSelectDirectory(path)} />)
      ) : (
        <>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Feather name='arrow-left' size={16} color='white' />
            <Text style={{ color: "white" }}>Back</Text>
          </TouchableOpacity>
          <DirectoryView path={currentPath} onSelectDirectory={handleSelectDirectory} onLoadFile={handleLoadFile} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  currentPath: {
    fontSize: 12,
    marginBottom: 10,
  },
  directoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 5,
  },
  directoryText: {
    fontSize: 14,
    color: "#000",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
  },
  fileText: {
    fontSize: 14,
    // color: "#444",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginBottom: 10,
    backgroundColor: "#000000",
    borderRadius: 5,
    color: "#FFFFFF", // White text color
  },
});

export default FileSystemPage;

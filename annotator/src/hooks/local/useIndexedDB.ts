import { useState, useEffect } from "react";
import { openDB, IDBPDatabase } from "idb";

export function useIndexedDB(dbName: string, storeName: string, version = 1) {
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async function openDatabase() {
      try {
        const db = await openDB(dbName, version, {
          upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName);
            }
          },
        });
        setDb(db);
      } catch (error) {
        console.error("Failed to open database:", error);
        setError(error as Error);
      }
    })();
  }, [dbName, storeName, version]);

  async function get(key: string) {
    try {
      if (!db) throw new Error("Database not initialized");
      return await db.get(storeName, key);
    } catch (error) {
      setError(error as Error);
    }
  }

  async function getKey(value: string) {
    try {
      if (!db) throw new Error("Database not initialized");
      return await db.getKey(storeName, value);
    } catch (error) {
      setError(error as Error);
    }
  }

  async function listKeys() {
    try {
      if (!db) throw new Error("Database not initialized");
      return await db.getAllKeys(storeName);
    } catch (error) {
      setError(error as Error);
    }
  }

  async function set(key: string, val: any) {
    try {
      if (!db) throw new Error("Database not initialized");
      return await db.put(storeName, val, key);
    } catch (error) {
      setError(error as Error);
    }
  }

  async function del(key: string) {
    try {
      if (!db) throw new Error("Database not initialized");
      return await db.delete(storeName, key);
    } catch (error) {
      setError(error as Error);
    }
  }

  async function getAll() {
    try {
      if (!db) throw new Error("Database not initialized");
      return await db.getAll(storeName);
    } catch (error) {
      setError(error as Error);
    }
  }

  return { get, getKey, set, del, getAll, listKeys, error };
}

export default useIndexedDB;

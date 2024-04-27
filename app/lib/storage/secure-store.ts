import { setItemAsync, getItemAsync } from "expo-secure-store";

export class SecureStorage {
  public static async saveItem(key: string, value: string): Promise<void> {
    await setItemAsync(key, value);
  }

  public static async getItem(key: string): Promise<string | null> {
    return await getItemAsync(key);
  }
}

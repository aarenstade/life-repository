import { ipcMain } from "electron";
import ENDPOINTS from "../../shared/config/endpoints";
import LocalDatabaseAdapter from "../adapters/local/DatabaseAdapter";
import { Database } from "../../types/database.types";

const registerDatabaseEndpoints = () => {
  Object.entries(ENDPOINTS.DATABASE).forEach(([key, value]) => {
    ipcMain.handle(value.get, async (event, args) => {
      const db = LocalDatabaseAdapter.getInstance();
      const data = await db.get(key as keyof Database["public"]["Tables"], args);
      return data;
    });

    ipcMain.handle(value.getAll, async (event, args) => {
      const db = LocalDatabaseAdapter.getInstance();
      const data = await db.getAll(key as keyof Database["public"]["Tables"], args);
      return data;
    });

    ipcMain.handle(value.create, async (event, args) => {
      const db = LocalDatabaseAdapter.getInstance();
      const data = await db.insert(key as keyof Database["public"]["Tables"], args);
      return data;
    });

    ipcMain.handle(value.update, async (event, args) => {
      const { where, data } = args;
      const db = LocalDatabaseAdapter.getInstance();
      const result = await db.update(key as keyof Database["public"]["Tables"], where, data);
      return result;
    });

    ipcMain.handle(value.delete, async (event, args) => {
      const db = LocalDatabaseAdapter.getInstance();
      const result = await db.delete(key as keyof Database["public"]["Tables"], args);
      return result;
    });
  });

  console.log("Registered Database Endpoints:");
  Object.values(ENDPOINTS.DATABASE).forEach((endpoint) => {
    console.log(`Endpoint: ${endpoint.get}`);
    console.log(`Endpoint: ${endpoint.getAll}`);
    console.log(`Endpoint: ${endpoint.create}`);
    console.log(`Endpoint: ${endpoint.update}`);
    console.log(`Endpoint: ${endpoint.delete}`);
  });
};

export default registerDatabaseEndpoints;

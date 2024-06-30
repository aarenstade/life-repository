import { createClient } from "@supabase/supabase-js";
import { TypedSupabaseClient } from "../../../shared/types/supabase";
import { Database } from "../../../types/database.types";

type QueryParams = { [column: string]: any };

class SupabaseDatabaseAdapter {
  private static instance: SupabaseDatabaseAdapter;
  private client: TypedSupabaseClient;

  constructor(private url: string = process.env.SUPABASE_URL || "", private key: string = process.env.SUPABASE_KEY || "") {
    this.client = createClient(this.url, this.key);
  }

  public static getInstance(): SupabaseDatabaseAdapter {
    if (!SupabaseDatabaseAdapter.instance) {
      SupabaseDatabaseAdapter.instance = new SupabaseDatabaseAdapter();
    }
    return SupabaseDatabaseAdapter.instance;
  }

  private prepareData(data: QueryParams): any {
    return Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "object" || Array.isArray(value) ? JSON.stringify(value) : value;
      return acc;
    }, {} as QueryParams);
  }

  public async insert(table: keyof Database["public"]["Tables"], data: QueryParams): Promise<void> {
    const preparedData = this.prepareData(data);
    const { error } = await this.client.from(table).insert(preparedData);
    if (error) throw error;
  }

  public async get(table: keyof Database["public"]["Tables"], where: QueryParams): Promise<any | undefined> {
    const { data, error } = await this.client.from(table).select("*").match(where).single();
    if (error) throw error;
    return this.parseJsonFields(data);
  }

  public async getAll(table: keyof Database["public"]["Tables"], where: QueryParams = {}): Promise<any[]> {
    const { data, error } = await this.client.from(table).select("*").match(where);
    if (error) throw error;
    return data.map(this.parseJsonFields);
  }

  public async update(table: keyof Database["public"]["Tables"], where: QueryParams, updates: QueryParams): Promise<void> {
    const preparedUpdates = this.prepareData(updates);
    const { error } = await this.client.from(table).update(preparedUpdates).match(where);
    if (error) throw error;
  }

  public async delete(table: keyof Database["public"]["Tables"], where: QueryParams): Promise<void> {
    const { error } = await this.client.from(table).delete().match(where);
    if (error) throw error;
  }

  private parseJsonFields(row: any): any {
    if (!row) return row;
    for (const [key, value] of Object.entries(row)) {
      if (this.isJsonString(value as any)) {
        row[key] = JSON.parse(value as any);
      }
    }
    return row;
  }

  private isJsonString(str: string): boolean {
    try {
      const json = JSON.parse(str);
      return typeof json === "object";
    } catch (e) {
      return false;
    }
  }
}

export default SupabaseDatabaseAdapter;

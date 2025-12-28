/**
 * API Service Abstraction & Adapter Pattern
 * 
 * This service acts as an Adapter/Repository layer. Currently, it bridges the interface
 * between the application and our Mock Data.
 * 
 * In the future, this "Adapter" will be swapped for a "SupabaseAdapter" without
 * changing the consuming components.
 * 
 * Future Implementation (example):
 * 
 * // interface IProjectRepository {
 * //   getAll(): Promise<Project[]>;
 * //   getById(id: string): Promise<Project>;
 * // }
 * 
 * // const supabaseProjectRepo: IProjectRepository = { ... }
 */

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Simulated delay for realistic mock behavior
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic fetch wrapper.
 * Ideally, specific entity services (ProjectService) should call this.
 * When switching to Supabase, this function might wrap `supabase.from(...).select(...)`.
 */
export async function fetchFromApi<T>(mockFn: () => T | Promise<T>, delayMs = 500): Promise<ApiResponse<T>> {
  try {
    await delay(delayMs);
    const data = await mockFn();
    return { data, error: null };
  } catch (e) {
    console.error('API Error:', e);
    return { data: null, error: e instanceof Error ? e : new Error('Unknown error') };
  }
}


interface ImportMeta {
  glob<T = unknown>(
    pattern: string,
    options?: {
      as?: string;
      eager?: boolean;
      import?: string;
      query?: string | Record<string, string>;
    },
  ): Record<string, T>;
}

declare module "*?worker" {
  const WorkerCtor: {
    new (options?: { name?: string; type?: "classic" | "module" }): Worker;
  };
  export default WorkerCtor;
}

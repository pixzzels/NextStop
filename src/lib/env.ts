const requiredEnvVars = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
};

export function getEnv() {
  const missingKeys = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
  }

  return {
    supabaseUrl: requiredEnvVars.supabaseUrl,
    supabaseAnonKey: requiredEnvVars.supabaseAnonKey,
  };
}
export function getEnv() {
  return {
    host: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:password@localhost:5432/wrectifai',
    jwtSecret: process.env.JWT_SECRET ?? 'super-secret-jwt-key',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'super-secret-refresh-key',
    corsOrigins: process.env.WEB_ORIGINS ? process.env.WEB_ORIGINS.split(',') : ['http://localhost:4200', 'http://localhost:3001'],
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    llmProvider: process.env.LLM_PROVIDER ?? 'groq',
    llmModel: process.env.LLM_MODEL ?? 'llama-3.1-70b-versatile',
    groqApiKey: process.env.GROQ_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    imageLlmProvider: process.env.IMAGE_LLM_PROVIDER ?? 'groq',
    imageLlmModel: process.env.IMAGE_LLM_MODEL ?? 'meta-llama/llama-4-scout-17b-16e-instruct',
    audioProvider: process.env.AUDIO_PROVIDER ?? 'groq',
    audioModel: process.env.AUDIO_MODEL ?? 'whisper-large-v3-turbo',
  };
}

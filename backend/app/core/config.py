from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ENVIRONMENT: str = "Development"
    DATABASE_URL:str
    JWT_SECRET: str
    JWT_ALGORITHM:str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60

    GROQ_API_KEY: str = ""
    CORS_ORIGINS: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


    model_config = SettingsConfigDict(env_file=".env")





settings = Settings()
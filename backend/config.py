from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ENVIRONMENT: str = "DDDevelopment"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
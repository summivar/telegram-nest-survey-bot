import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  TELEGRAM_TOKEN: string;

  @IsNotEmpty()
  @IsString()
  DB_TYPE: string;

  @IsNotEmpty()
  @IsString()
  DB_HOST: string;

  @IsNotEmpty()
  @IsString()
  DB_PORT: string;

  @IsNotEmpty()
  @IsString()
  DB_USENEWURLPARSER: string;

  @IsNotEmpty()
  @IsString()
  DB_AUTOLOADENTITIES: string;

  @IsNotEmpty()
  @IsString()
  DB_USEUNIFIEDTOPOLOGY: string;
}

export function validateEnvVariables(config: Record<string, unknown>) {
  const validateConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  });
  const error = validateSync(validateConfig, {
    skipMissingProperties: false
  });

  if(error.length > 0) {
    throw new Error(error.toString());
  }

  return validateConfig;
}
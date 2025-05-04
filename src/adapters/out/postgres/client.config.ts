import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;

export const databaseProperties = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT || '5432', 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [`${__dirname}/schemas/*{.ts,.js}`],
  namingStrategy: new SnakeNamingStrategy(),
  name: DB_NAME,
};

export const PostgresDataSource = new DataSource({
  ...(databaseProperties as DataSourceOptions),
});

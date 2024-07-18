import { DataSource, DataSourceOptions } from "typeorm";
import { environment } from "../environment/environment";
import { join } from "path";

export const config: DataSourceOptions = {
  type: 'postgres',
  url: environment.DATABASE_URL,
  entities: [join(__dirname, '../modules', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '../migrations', '*.ts')],
  synchronize: false, // Recomenda-se desativar o synchronize em produção
  ssl: true,
  logging: environment.DATABASE_LOGGING === 'true',
  host: environment.HOST,
  username: environment.DATABASE_USERNAME,
  password: environment.DATABASE_PASSWORD,
  database: 'postgres',
  port: 5432,
};

export default new DataSource(config);

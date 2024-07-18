import { DataSource, DataSourceOptions } from 'typeorm';
import { environment } from '../environment/environment';
import { join } from 'path';

export const config: DataSourceOptions = {
  type: 'postgres',
  //remover se for usado docker
  url: environment.DATABASE_URL,
  //Usar Docker
  // host: 'localhost',
  // port: 5432,
  // username: 'postgres',
  // password: '1234',
  // database: 'postgres',
  //
  entities: [join(__dirname, '../../../../modules', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'dist/migrations', '*.ts')],
  synchronize: true,
  ssl: true,
  logging: environment.DATABASE_LOGGING === 'true',
  host: environment.HOST,
  username: environment.DATABASE_USERNAME,
  password: environment.PASSWORD,
  database: 'postgres',
  port: 5423,
};

export default new DataSource(config);

import { DataSource, DataSourceOptions } from 'typeorm';
import { environment } from '../environment/environment';
import { join } from 'path';

const config: DataSourceOptions = {
  type: 'postgres',
  //remover se for usado docker
  url: environment.DATABASE_URL,
  // entities: [join(__dirname, '../../../../modules', '**', '*.entity.{ts,js}')],
  entities: [join(__dirname, '../../../../modules', '**', '*.entity.{ts,js}')],
  // migrations: [join(__dirname, 'migrations', '*.ts')],
  //
  //Usar Docker
  // host: 'localhost',
  // port: 5432,
  // username: 'postgres',
  // password: '1234',
  // database: 'postgres',
  //
  migrations: [join(__dirname, 'dist/migrations', '*.ts')],
  synchronize: false,
  ssl: true,
  logging: environment.DATABASE_LOGGING === 'true',
  host: environment.HOST,
  username: 'default',
  password: environment.PASSWORD,
  migrationsRun: false,
};

export default new DataSource(config);

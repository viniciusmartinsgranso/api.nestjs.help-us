import { DataSource } from 'typeorm';
import { join } from 'path';
import { environment } from 'src/environment/environment';

const appDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: environment.DATABASE_URL,
  host: environment.HOST,
  username: 'default',
  password: environment.DATABASE_PASSWORD,
  ssl: true,
  entities: [join(__dirname, 'src/modules/**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'src/migrations/*.{ts,js}')],
  synchronize: false,
  logging: environment.DATABASE_LOGGING === 'true',
});

export default appDataSource;

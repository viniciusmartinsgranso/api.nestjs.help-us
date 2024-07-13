import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/user.module';
import { environment } from './environment/environment';
import { AuthModule } from './modules/auth/auth.module';
import { join } from 'path';
import { OccurrencesModule } from './modules/occurrences/occurrences.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      //remover se for usado docker
      // url: environment.DATABASE_URL,
      // host: environment.HOST,
      // username: 'default',
      // password: environment.PASSWORD,
      // autoLoadEntities: false,
      //
      //Usar Docker
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      //
      entities: [
        join(__dirname, '../../../../modules', '**', '*.entity.{ts,js}'),
      ],
      migrations: [join(__dirname, 'dist/migrations', '*.ts')],
      synchronize: true,
      autoLoadEntities: true,
      logging: environment.DATABASE_LOGGING === 'true',
    }),
    AuthModule,
    UserModule,
    OccurrencesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

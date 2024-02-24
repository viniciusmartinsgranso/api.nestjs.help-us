import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './modules/users/user.module';
import { environment } from "./environment/environment";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            url: environment.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: true,
            logging: environment.DATABASE_LOGGING === 'true',
            ssl: true,
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        }),
        AuthModule,
        UserModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}

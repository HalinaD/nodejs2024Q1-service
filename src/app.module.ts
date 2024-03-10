import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { TrackModule } from './track/entities/track.module';
import { UserModule } from './user/entities/user.module';

@Module({
  imports: [DbModule, UserModule, TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

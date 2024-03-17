import { Module } from '@nestjs/common';
import { AlbumModule } from './album/entities/album.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/entities/artist.module';
import { DbModule } from './db/db.module';
import { FavoritesModule } from './favs/entities/favorites.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrackModule } from './track/entities/track.module';
import { UserModule } from './user/entities/user.module';

@Module({
  imports: [
    DbModule,
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavoritesModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

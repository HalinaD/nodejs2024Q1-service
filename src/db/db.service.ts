import { Injectable } from '@nestjs/common';
import { AlbumDto } from 'src/album/dto/album.dto';
import { ArtistDto } from 'src/artist/dto/artist.dto';
import { FavoritesDto } from 'src/favs/dto/favorite.dto';
import { TrackDto } from 'src/track/dto/track.dto';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class DbService {
  users: UserDto[] = [];
  tracks: TrackDto[] = [];
  artists: ArtistDto[] = [];
  albums: AlbumDto[] = [];
  favorites: FavoritesDto = { artists: [], albums: [], tracks: [] };
}

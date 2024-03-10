import { Injectable } from '@nestjs/common';
import { ArtistDto } from 'src/artist/dto/artist.dto';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class DbService {
  users: UserDto[] = [];
  tracks: TrackDto[] = [];
  artists: ArtistDto[] = [];
}

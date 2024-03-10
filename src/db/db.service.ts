import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class DbService {
  users: UserDto[] = [];
  tracks: TrackDto[] = [];
}

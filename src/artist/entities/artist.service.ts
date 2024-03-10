import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateArtistDto } from '../dto/createArtist.dto';
import { UpdateArtistDto } from '../dto/updateArtist.dto';
import { ArtistDto } from '../dto/artist.dto';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  constructor(private readonly dbService: DbService) {}

  async findAll(): Promise<ArtistDto[]> {
    return this.dbService.artists.map(({ id, name, grammy }) => ({
      id,
      name,
      grammy,
    }));
  }

  async findOne(id: string): Promise<ArtistDto> {
    const artist = this.dbService.artists.find(u => u.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<ArtistDto> {
    const { name, grammy } = createArtistDto;
    if (!name || grammy === undefined) {
      throw new BadRequestException('Name and grammy are required');
    }
    const newArtist: ArtistDto = {
      id: uuidv4(),
      name,
      grammy,
    };
    this.dbService.artists.push(newArtist);
    return newArtist;
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.dbService.artists.find((artist) => artist.id === id);
    if (!artist) {
        throw new NotFoundException('Artist not found');
    }
    if (updateArtistDto.name !== undefined) {
        artist.name = updateArtistDto.name;
    }
    if (updateArtistDto.grammy !== undefined) {
        artist.grammy = updateArtistDto.grammy;
    }
    return artist;
  }

  async remove(id: string): Promise<void> {
    const index = this.dbService.artists.findIndex(u => u.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.dbService.tracks.forEach(track => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  
    /*this.dbService.albums.forEach(album => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });*/
  
    this.dbService.artists.splice(index, 1);
  }
}

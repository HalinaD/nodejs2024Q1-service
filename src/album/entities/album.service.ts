import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAlbumDto } from '../dto/createAlbum.dto';
import { UpdateAlbumDto } from '../dto/updateAlbum.dto';
import { AlbumDto } from '../dto/album.dto';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  constructor(private readonly dbService: DbService) {}

  async findAll(): Promise<AlbumDto[]> {
    return this.dbService.albums.map(({ id, name, year, artistId }) => ({
      id,
      name,
      year,
      artistId,
    }));
  }

  async findOne(id: string): Promise<AlbumDto> {
    const album = this.dbService.albums.find((u) => u.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumDto> {
    const { name, year } = createAlbumDto;
    if (!name || year === undefined) {
      throw new BadRequestException('Name and year are required');
    }
    const newAlbum: AlbumDto = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.dbService.albums.push(newAlbum);
    return newAlbum;
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumDto> {
    const albumIndex = this.dbService.albums.findIndex((a) => a.id === id);
    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    } else {
      const updatedAlbum: AlbumDto = {
        id,
        name: updateAlbumDto.name ?? this.dbService.albums[albumIndex].name,
        year: updateAlbumDto.year ?? this.dbService.albums[albumIndex].year,
        artistId:
          updateAlbumDto.artistId ?? this.dbService.albums[albumIndex].artistId,
      };
      this.dbService.albums[albumIndex] = updatedAlbum;
      return updatedAlbum;
    }
  }

  async remove(id: string): Promise<void> {
    const index = this.dbService.albums.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('Album not found');
    }
    this.dbService.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
    this.dbService.albums.splice(index, 1);
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTrackDto } from '../dto/createTrack.dto';
import { UpdateTrackDto } from '../dto/updateTrack.dto';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { TrackDto } from '../dto/track.dto';

@Injectable()
export class TrackService {
  constructor(private readonly dbService: DbService) {}

  async findAll(): Promise<TrackDto[]> {
    return this.dbService.tracks.map(
      ({ id, name, artistId, albumId, duration }) => ({
        id,
        name,
        artistId,
        albumId,
        duration,
      }),
    );
  }

  async findOne(id: string): Promise<TrackDto> {
    const track = this.dbService.tracks.find((u) => u.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<TrackDto> {
    const { name, artistId, albumId, duration } = createTrackDto;
    if (!name || !duration) {
      throw new BadRequestException('Name and duration are required');
    }
    const newTrack: TrackDto = {
      id: uuidv4(),
      name,
      artistId,
      albumId,
      duration,
    };
    this.dbService.tracks.push(newTrack);
    return newTrack;
  }

  async updateTrack(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackDto> {
    const { name, artistId, albumId, duration } = updateTrackDto;
    const trackIndex = this.dbService.tracks.findIndex((u) => u.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }
    if (!name || !duration) {
      throw new BadRequestException('Name and duration are required');
    }
    const updatedTrack: TrackDto = {
      id,
      name,
      artistId,
      albumId,
      duration,
    };
    this.dbService.tracks[trackIndex] = updatedTrack;
    return updatedTrack;
  }

  async remove(id: string): Promise<void> {
    const index = this.dbService.tracks.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('Track not found');
    }
    this.dbService.tracks.splice(index, 1);
  }
}

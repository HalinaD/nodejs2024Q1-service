import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTrackDto } from '../dto/createTrack.dto';
import { UpdateTrackDto } from '../dto/updateTrack.dto';
import { TrackDto } from '../dto/track.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TrackDto[]> {
    const tracks = await this.prisma.client.track.findMany();
    return tracks.map(track => ({
      id: track.id,
      name: track.name,
      artistId: track.artistId ?? null,
      albumId: track.albumId ?? null,
      duration: track.duration,
    }));
  }

  async findOne(id: string): Promise<TrackDto> {
    const track = await this.prisma.client.track.findUnique({
      where: { id },
    });
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
    const newTrack = await this.prisma.client.track.create({
      data: {
        name,
        artistId,
        albumId,
        duration,
      },
    });
    return newTrack;
  }

  async updateTrack(id: string, updateTrackDto: UpdateTrackDto): Promise<TrackDto> {
    const existingTrack = await this.prisma.client.track.findUnique({ where: { id } });
    if (!existingTrack) {
      throw new NotFoundException('Track not found');
    }
    const { name, artistId, albumId, duration } = updateTrackDto;
    const updatedTrack = await this.prisma.client.track.update({
      where: { id },
      data: { name, artistId, albumId, duration },
    });
    return updatedTrack;
  }

  async remove(id: string): Promise<void> {
    const existingTrack = await this.prisma.client.track.findUnique({ where: { id } });
    if (!existingTrack) {
      throw new NotFoundException('Track not found');
    }
    await this.prisma.client.track.delete({ where: { id } });
  }
}

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from '../dto/createArtist.dto';
import { UpdateArtistDto } from '../dto/updateArtist.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Artist } from '.prisma/client';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Artist[]> {
    return this.prisma.client.artist.findMany();
  }

  async findOne(id: string): Promise<Artist | null> {
    const artist = await this.prisma.client.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.prisma.client.artist.create({ data: createArtistDto });
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const existingArtist = await this.prisma.client.artist.findUnique({ where: { id } });
    if (!existingArtist) {
      throw new NotFoundException('Artist not found');
    }
    const updatedArtist = await this.prisma.client.artist.update({
      where: { id },
      data: updateArtistDto,
    });
    return updatedArtist;
  }

  async remove(id: string): Promise<void> {
    const existingArtist = await this.prisma.client.artist.findUnique({ where: { id } });
    if (!existingArtist) {
      throw new NotFoundException('Artist not found');
    }

    await this.prisma.client.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.client.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.client.artist.delete({ where: { id } });
  }
}

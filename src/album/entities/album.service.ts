import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from '../dto/createAlbum.dto';
import { UpdateAlbumDto } from '../dto/updateAlbum.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Album } from '.prisma/client';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    return this.prisma.client.album.findMany();
  }

  async findOne(id: string): Promise<Album | null> {
    const album = await this.prisma.client.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.prisma.client.album.create({ data: createAlbumDto });
  }

  async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const existingAlbum = await this.prisma.client.album.findUnique({ where: { id } });
    if (!existingAlbum) {
      throw new NotFoundException('Album not found');
    }
    return this.prisma.client.album.update({ where: { id }, data: updateAlbumDto });
  }

  async remove(id: string): Promise<void> {
    const existingAlbum = await this.prisma.client.album.findUnique({ where: { id } });
    if (!existingAlbum) {
      throw new NotFoundException('Album not found');
    }
    await this.prisma.client.album.delete({ where: { id } });
    await this.prisma.client.track.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });
  }
}

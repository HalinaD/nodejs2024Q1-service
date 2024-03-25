import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFavorites() {
    const favorites = await this.prisma.client.favorites.findUnique({
      where: { id: 'singleton' },
      select: { artists: true, albums: true, tracks: true },
    });
    if (!favorites) {
      return { artists: [], albums: [], tracks: [] };
    }

    const artists = await Promise.all(
      favorites.artists.map(async (artistId) => {
        const artist = await this.prisma.client.artist.findUnique({
          where: { id: artistId },
        });
        if (!artist) return null;
        return {
          id: artist.id,
          name: artist.name,
          grammy: artist.grammy ?? false,
        };
      }),
    );

    const albums = await Promise.all(
      favorites.albums.map(async (albumId) => {
        const album = await this.prisma.client.album.findUnique({
          where: { id: albumId },
        });
        if (!album) return null;
        return {
          id: album.id,
          name: album.name,
          year: album.year ?? null,
          artistId: album.artistId ?? null,
        };
      }),
    );

    const tracks = await Promise.all(
      favorites.tracks.map(async (trackId) => {
        const track = await this.prisma.client.track.findUnique({
          where: { id: trackId },
        });
        if (!track) return null;
        return {
          id: track.id,
          name: track.name,
          duration: track.duration ?? null,
          artistId: track.artistId ?? null,
          albumId: track.albumId ?? null,
        };
      }),
    );

    return {
      artists: artists.filter(Boolean),
      albums: albums.filter(Boolean),
      tracks: tracks.filter(Boolean),
    };
  }

  async addTrackToFavorites(trackId: string) {
    const track = await this.prisma.client.track.findUnique({
      where: { id: trackId },
    });
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }
    let favorites = await this.prisma.client.favorites.findUnique({
      where: { id: 'singleton' },
    });
    if (!favorites) {
      favorites = await this.prisma.client.favorites.create({
        data: { id: 'singleton' },
      });
    }
    await this.prisma.client.favorites.update({
      where: { id: 'singleton' },
      data: { tracks: { push: trackId } },
    });
    return await this.getAllFavorites();
  }

  async deleteTrackFromFavorites(trackId: string) {
    const track = await this.prisma.client.track.findUnique({
      where: { id: trackId },
    });
    if (!track) {
      throw new NotFoundException('Track not found in favorites');
    }
    await this.prisma.client.favorites.update({
      where: { id: 'singleton' },
      data: { tracks: { set: [] } },
    });
    return { message: 'Track removed from favorites' };
  }

  async addAlbumToFavorites(albumId: string) {
    const album = await this.prisma.client.album.findUnique({
      where: { id: albumId },
    });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }
    let favorites = await this.prisma.client.favorites.findUnique({
      where: { id: 'singleton' },
    });
    if (!favorites) {
      favorites = await this.prisma.client.favorites.create({
        data: { id: 'singleton' },
      });
    }
    await this.prisma.client.favorites.update({
      where: { id: 'singleton' },
      data: { albums: { push: albumId } },
    });
    return await this.getAllFavorites();
  }

  async deleteAlbumFromFavorites(albumId: string) {
    const album = await this.prisma.client.album.findUnique({
      where: { id: albumId },
    });
    if (!album) {
      throw new NotFoundException('Album not found in favorites');
    }
    await this.prisma.client.favorites.update({
      where: { id: 'singleton' },
      data: { albums: { set: [] } },
    });
    return { message: 'Album removed from favorites' };
  }

  async addArtistToFavorites(artistId: string) {
    const artist = await this.prisma.client.artist.findUnique({
      where: { id: artistId },
    });
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }
    let favorites = await this.prisma.client.favorites.findUnique({
      where: { id: 'singleton' },
    });
    if (!favorites) {
      favorites = await this.prisma.client.favorites.create({
        data: { id: 'singleton' },
      });
    }
    await this.prisma.client.favorites.update({
      where: { id: 'singleton' },
      data: { artists: { push: artistId } },
    });
    return await this.getAllFavorites();
  }

  async deleteArtistFromFavorites(artistId: string) {
    const artist = await this.prisma.client.artist.findUnique({
      where: { id: artistId },
    });
    if (!artist) {
      throw new NotFoundException('Artist not found in favorites');
    }
    await this.prisma.client.favorites.update({
      where: { id: 'singleton' },
      data: { artists: { set: [] } },
    });
    return { message: 'Artist removed from favorites' };
  }
}

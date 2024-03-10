import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { CreateAlbumDto } from '../dto/createAlbum.dto';
import { UpdateAlbumDto } from '../dto/updateAlbum.dto';
import { AlbumService } from './album.service';
import { validate } from 'uuid';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid album ID', HttpStatus.BAD_REQUEST);
    }
    return this.albumService.findOne(id);
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    const { name, year } = createAlbumDto;
    if (!name || !year) {
      throw new HttpException('Name and year are required', HttpStatus.BAD_REQUEST);
    }
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    if (!validate(id)) {
      throw new HttpException('Invalid album ID', HttpStatus.BAD_REQUEST);
    }
    const { name, year, artistId } = updateAlbumDto;
    if (!name || typeof year !== 'number' || (artistId && !validate(artistId))) {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }
  
    return this.albumService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe) id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid album ID', HttpStatus.BAD_REQUEST);
    }
    return this.albumService.remove(id);
  }
}

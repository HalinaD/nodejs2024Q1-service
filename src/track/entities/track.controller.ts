import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CreateTrackDto } from '../dto/createTrack.dto';
import { UpdateTrackDto } from '../dto/updateTrack.dto';
import { TrackService } from './track.service';
import { validate } from 'uuid';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid track ID', HttpStatus.BAD_REQUEST);
    }
    return this.trackService.findOne(id);
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    const { name, duration } = createTrackDto;
    if (!name || !duration) {
      throw new HttpException(
        'Name and duration are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    if (!validate(id)) {
      throw new HttpException('Invalid track ID', HttpStatus.BAD_REQUEST);
    }
    if (!updateTrackDto || !updateTrackDto.name || !updateTrackDto.duration) {
      throw new HttpException(
        'Name and duration are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.trackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid track ID', HttpStatus.BAD_REQUEST);
    }
    return this.trackService.remove(id);
  }
}

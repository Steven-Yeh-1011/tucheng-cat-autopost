import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CropDataDto {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

class PostImageDto {
  imageId: string;
  position: number;
  cropData?: CropDataDto;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostImageDto)
  images?: PostImageDto[];
}


import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Image } from '@prisma/client';

interface CropData {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

@Injectable()
export class ImageService {
  /**
   * Process image for publishing: convert SVG to PNG with optional crop
   */
  async processImageForPublish(
    image: Image,
    cropData?: CropData,
  ): Promise<Buffer> {
    const imagePath = image.url;

    // Read SVG file
    let svgBuffer: Buffer;
    try {
      svgBuffer = await fs.readFile(imagePath);
    } catch (error) {
      throw new Error(`Failed to read image file: ${imagePath}`);
    }

    // Convert SVG to PNG using sharp
    let pipeline = sharp(svgBuffer).png();

    // Apply crop if provided
    if (cropData && cropData.width && cropData.height) {
      pipeline = pipeline.extract({
        left: cropData.x || 0,
        top: cropData.y || 0,
        width: cropData.width,
        height: cropData.height,
      });
    }

    return pipeline.toBuffer();
  }

  /**
   * Generate preview PNG from SVG
   */
  async generatePreview(svgPath: string, outputPath: string): Promise<void> {
    const svgBuffer = await fs.readFile(svgPath);
    await sharp(svgBuffer)
      .png()
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .toFile(outputPath);
  }
}


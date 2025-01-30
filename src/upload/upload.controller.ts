// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res, 
  Delete} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname,join } from 'path';
// import { join } from 'path';
// import * as path from 'path';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Folder where files will be stored
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
            const originalname = file.originalname.replace(/\s+/g, '-').toLowerCase().replace(extname(file.originalname), '');
          
          const filename = `${originalname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
    
  uploadFile(@UploadedFile() file:Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
    };
  }

  @Get('files')
  getAllFiles() {
    const path = require('path');
    const uploadDir = path.join(__dirname, '../../uploads');
    console.log("---------------", uploadDir);

    try {
      const files = fs.readdirSync(uploadDir);
      return {
        message: 'Uploaded files retrieved successfully',
        totalFiles: files.length,
        files,
      };
    } catch (error) {
      return {
        message: 'Error retrieving files',
        error: error.message,
      };
    }
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = `./uploads/${filename}`;
    return res.sendFile(filePath, { root: './' });
  }

  @Delete(':filename')
  deleteFile(@Param('filename') filename: string) {
    const path = require('path');
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return {
          message: 'File deleted successfully',
        };
      } else {
        return {
          message: 'File not found',
        };
      }
    } catch (error) {
      return {
        message: 'Error deleting file',
        error: error.message,
      };
    }
  }

  @Post('rename/:oldFilename/:newFilename')
  renameFile(@Param('oldFilename') oldFilename: string, @Param('newFilename') newFilename: string) {
    const path = require('path');
    const oldFilePath = path.join(__dirname, '../../uploads', oldFilename);
    const newFilePath = path.join(__dirname, '../../uploads', newFilename);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);


    try {
      if (fs.existsSync(oldFilePath)) {
        const ext = path.extname(newFilename);
        const baseName = path.basename(newFilename, ext);
        const newFileNameWithSuffix = `${baseName}-${uniqueSuffix}${ext}`;
        const newFilePathWithSuffix = path.join(__dirname, '../../uploads', newFileNameWithSuffix);
        fs.renameSync(oldFilePath, newFilePathWithSuffix);
        return {
          message: 'File renamed successfully',
          text: `File renamed from ${oldFilename} to ${newFileNameWithSuffix}`,
        };
      } else {
        return {
          message: 'File not found',
        };
      }
    } catch (error) {
      return {
        message: 'Error renaming file',
        error: error.message,
      };
    }
  }

  

}

import { IsString, IsNotEmpty,IsEmail, IsInt, Min } from 'class-validator';

export class UpdatePostDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;
    
    @IsString()
    @IsNotEmpty()
    author: string;

   @IsInt()
    @Min(0)
    createdAt: number;
    constructor() {
        this.createdAt = Date.now();
    }
}

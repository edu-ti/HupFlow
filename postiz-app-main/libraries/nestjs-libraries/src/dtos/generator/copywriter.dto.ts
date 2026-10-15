import { IsIn, IsOptional, IsString } from 'class-validator';

export class CopywriterDto {
  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  @IsIn(['linkedin', 'x', 'instagram', 'facebook', 'threads', 'generic'])
  platform?: 'linkedin' | 'x' | 'instagram' | 'facebook' | 'threads' | 'generic';

  @IsOptional()
  @IsString()
  @IsIn(['engaging', 'professional', 'casual', 'persuasive', 'viral'])
  tone?: 'engaging' | 'professional' | 'casual' | 'persuasive' | 'viral';

  @IsOptional()
  @IsString()
  @IsIn(['caption', 'hooks', 'hashtags', 'improve'])
  mode?: 'caption' | 'hooks' | 'hashtags' | 'improve';

  @IsOptional()
  @IsString()
  customInstruction?: string;
}

export interface CopywriterResult {
  caption: string;
  hooks: string[];
  hashtags: string[];
  platformTip: string;
}

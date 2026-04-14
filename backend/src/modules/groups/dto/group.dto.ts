import { IsString, IsOptional, IsArray, IsUUID, IsBoolean } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  member_ids?: string[];
}

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class AddMembersDto {
  @IsArray()
  @IsUUID('4', { each: true })
  client_ids: string[];
}

export class RemoveMembersDto {
  @IsArray()
  @IsUUID('4', { each: true })
  client_ids: string[];
}
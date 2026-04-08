export interface CollectionTableFieldDto {
  id: number;
  name: string;
  field_type: string;
  is_required: boolean;
}

export interface CollectionTableItemDto {
  id: number;
  name: string;
  created_at: Date;
  values: Record<string, any>;
}

export interface CollectionTableResponseDto {
  fields: CollectionTableFieldDto[];
  items: CollectionTableItemDto[];
}

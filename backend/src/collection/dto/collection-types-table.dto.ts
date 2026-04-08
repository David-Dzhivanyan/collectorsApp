export interface CollectionTypeFieldInfo {
  id: number;
  fieldId: number;
  name: string;
  field_type: string;
  is_required: boolean;
  options?: string[];
}

export interface CollectionTypeTableRow {
  id: number;
  name: string;
  description: string;
  created_by: string;
  created_at: Date;
  fields: CollectionTypeFieldInfo[];
}

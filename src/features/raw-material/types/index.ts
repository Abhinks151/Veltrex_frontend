export interface RawMaterial {
  id: string;
  tenantId: string;
  name: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
    unit: string;
  };
  material: string;
  minQty: number;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RawMaterialRequest {
  name: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
    unit: string;
  };
  material: string;
  minQty: number;
}

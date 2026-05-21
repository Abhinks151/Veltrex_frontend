import { FixtureType } from '@/shared/types/fixture-type.enum';

export interface FixtureDimensions {
  width: number;
  length: number;
  height: number;
  unit: string;
}

export interface Fixture {
  id: string;
  name: string;
  dimensions: FixtureDimensions;
  type: FixtureType;
  isBlocked: boolean;
  isDeleted: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FixtureRequest {
  name: string;
  dimensions: FixtureDimensions;
  type: FixtureType;
}

export interface FixtureResponse {
  fixtures: Fixture[];
  total: number;
}

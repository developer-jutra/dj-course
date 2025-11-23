import React from 'react';
import { Environment } from '@react-three/drei';
import { WarehouseLighting } from './WarehouseLighting';
import { WarehouseStructure } from './WarehouseStructure';
import { WarehouseContent } from './WarehouseContent';

export const WarehouseEnvironment: React.FC = () => {
  return (
    <>
      <WarehouseLighting />
      <WarehouseContent />
      <WarehouseStructure />
      <Environment preset="warehouse" />
    </>
  );
};
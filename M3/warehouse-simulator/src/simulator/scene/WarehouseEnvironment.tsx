import React, { forwardRef } from 'react';
import { Environment } from '@react-three/drei';
import { WarehouseLighting } from './WarehouseLighting';
import { WarehouseStructure } from './WarehouseStructure';
import { WarehouseContent, WarehouseContentRef } from './WarehouseContent';

export const WarehouseEnvironment = forwardRef<WarehouseContentRef, {}>((props, ref) => {
  return (
    <>
      <WarehouseLighting />
      <WarehouseContent ref={ref} />
      <WarehouseStructure />
      <Environment preset="warehouse" />
    </>
  );
});
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import type Web3 from 'web3';
import type { AbiItem } from 'web3-utils';

import { DEFAULT_GAS } from '@/utils';

import { getInstance, LSP6KeyManagerSchema } from './schemas';

const CONTROLLER_PERMISSIONS = {
  // ADDPERMISSIONS: true,
  CALL: true,
  // CHANGEOWNER: true,
  // CHANGEPERMISSIONS: true,
  // DELEGATECALL: true,
  // DEPLOY: true,
  SETDATA: true,
  // SIGN: true,
  // STATICCALL: true,
  // SUPER_CALL: true,
  // SUPER_DELEGATECALL: true,
  // SUPER_SETDATA: true,
  // SUPER_STATICCALL: true,
  // SUPER_TRANSFERVALUE: true,
  // TRANSFERVALUE: true,
};

export const checkPermissions = async (
  web3: Web3,
  address: string,
  controllerAddress: string
) => {
  const erc725 = getInstance(LSP6KeyManagerSchema);
  const up = new web3.eth.Contract(UniversalProfile.abi as AbiItem[], address);

  // Setup the permissions of the controller address
  const beneficiaryPermissions = erc725.encodePermissions(
    CONTROLLER_PERMISSIONS
  );

  // Encode the data key-value pairs of the permissions
  const permissionData = erc725.encodeData([
    {
      keyName: 'AddressPermissions:Permissions:<address>',
      dynamicKeyParts: controllerAddress,
      value: beneficiaryPermissions,
    },
  ]);

  // Check existing permissions
  const existingPermissions = await up.methods['getData(bytes32)'](
    permissionData.keys[0]
  ).call();

  return existingPermissions === beneficiaryPermissions;
};

export const grantPermissions = async (
  web3: Web3,
  address: string,
  controllerAddress: string
) => {
  const erc725 = getInstance(LSP6KeyManagerSchema);
  const up = new web3.eth.Contract(UniversalProfile.abi as AbiItem[], address);

  // Setup the permissions of the controller address
  const beneficiaryPermissions = erc725.encodePermissions(
    CONTROLLER_PERMISSIONS
  );

  // Encode the data key-value pairs of the permissions to be set
  const permissionData = erc725.encodeData([
    {
      keyName: 'AddressPermissions:Permissions:<address>',
      dynamicKeyParts: controllerAddress,
      value: beneficiaryPermissions,
    },
  ]);

  // Send the transaction to user
  await up.methods['setData(bytes32[],bytes[])'](
    permissionData.keys,
    permissionData.values
  ).send({
    from: address,
    gasLimit: DEFAULT_GAS,
  });

  console.log(
    `Permissions successfully granted to controller ${controllerAddress}`
  );
};

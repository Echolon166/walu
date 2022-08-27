import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import type Web3 from 'web3';
import type { AbiItem } from 'web3-utils';

import { getInstance, LSP6KeyManagerSchema } from './schemas';

export const getPermissions = async (
  web3: Web3,
  address: string,
  controllerAddress: string
) => {
  const erc725 = getInstance(LSP6KeyManagerSchema);
  const up = new web3.eth.Contract(UniversalProfile.abi as AbiItem[], address);

  // Setup the permissions of the controller address
  const beneficiaryPermissions = erc725.encodePermissions({
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
  });

  // Encode the data key-value pairs of the permissions to be set
  const permissionData = erc725.encodeData([
    {
      keyName: 'AddressPermissions:Permissions:<address>',
      dynamicKeyParts: controllerAddress,
      value: beneficiaryPermissions,
    },
  ]);

  // Check existing permissions, return if the user has the required permissions
  const existingPermissions = await up.methods['getData(bytes32)'](
    permissionData.keys[0]
  ).call();

  if (existingPermissions === beneficiaryPermissions) {
    return;
  }

  // Send the transaction to user
  await up.methods['setData(bytes32[],bytes[])'](
    permissionData.keys,
    permissionData.values
  ).send({
    from: address,
    gasLimit: 600_000,
  });

  console.log(
    `Permissions successfully granted to controller ${controllerAddress}`
  );
};

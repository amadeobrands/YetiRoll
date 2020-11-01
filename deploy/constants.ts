import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

export const EXCHANGE_ADAPTOR = 'ExchangeAdaptor';
export const STREAM_MANAGER = 'StreamManager';
export const STREAM = 'Stream';
export const TREASURY = 'Treasury';
export const AAVE_ADAPTOR = 'AaveAdaptor';

export const AAVE_ADDRESS = '0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3';
export const AAVE_TAKER_ADDRESS = '0x398eC7346DcD622eDc5ae82352F02bE94C62d119';

export const ONE_INCH_ADDRESS = '0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E';

export const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
export const A_DAI = '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {};

export default func;

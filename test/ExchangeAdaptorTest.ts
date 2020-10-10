import chai from "chai";
import {deployErc20, getProvider} from "./helpers/contract";

import {
  deployContract,
  deployMockContract,
  MockContract,
} from "ethereum-waffle";

import ExchangeAdaptorArtifact from "../artifacts/ExchangeAdaptor.json";
import {ExchangeAdaptor} from "../typechain/ExchangeAdaptor";
import {oneEther} from "./helpers/numbers";
import {MockErc20} from "../typechain/MockErc20";

const {expect} = chai;

const [alice] = getProvider().getWallets();

describe("Exchange Adaptor", () => {
  let oneInch: MockContract;
  let exchangeAdaptor: ExchangeAdaptor;
  let USDT: MockErc20;
  let DAI: MockErc20;

  before(async () => {
    oneInch = await deployMockContract(alice, ONE_INCH_ABI);
    exchangeAdaptor = (await deployContract(
      alice,
      ExchangeAdaptorArtifact
    )) as ExchangeAdaptor;

    USDT = await deployErc20(alice);
    DAI = await deployErc20(alice);

    await USDT.mint(alice.address, oneEther.mul(99999999));
    await DAI.mint(exchangeAdaptor.address, oneEther.mul(99999999));

    await exchangeAdaptor.setOneInch(oneInch.address);
  });

  it("Should forward exchange requests to an exchange", async () => {
    await oneInch.mock.swap.returns(oneEther.mul(195));

    await exchangeAdaptor.callStatic
      .exchange(
        USDT.address,
        DAI.address,
        oneEther.mul(200),
        oneEther.mul(195),
        [10],
        alice.address
      )
      .then((isSuccessful) => {
        expect(isSuccessful).to.be.true;
      });
  });
});

const ONE_INCH_ABI = [
  {
    inputs: [
      {
        internalType: "contract IOneSplitMulti",
        name: "impl",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newImpl",
        type: "address",
      },
    ],
    name: "ImplementationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC20",
        name: "fromToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "contract IERC20",
        name: "destToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fromTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "destTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minReturn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "distribution",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "flags",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "referral",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feePercent",
        type: "uint256",
      },
    ],
    name: "Swapped",
    type: "event",
  },
  {payable: true, stateMutability: "payable", type: "fallback"},
  {
    constant: true,
    inputs: [],
    name: "chi",
    outputs: [
      {internalType: "contract IFreeFromUpTo", name: "", type: "address"},
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {internalType: "contract IERC20", name: "asset", type: "address"},
      {internalType: "uint256", name: "amount", type: "uint256"},
    ],
    name: "claimAsset",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {internalType: "contract IERC20", name: "fromToken", type: "address"},
      {internalType: "contract IERC20", name: "destToken", type: "address"},
      {internalType: "uint256", name: "amount", type: "uint256"},
      {internalType: "uint256", name: "parts", type: "uint256"},
      {internalType: "uint256", name: "flags", type: "uint256"},
    ],
    name: "getExpectedReturn",
    outputs: [
      {internalType: "uint256", name: "returnAmount", type: "uint256"},
      {internalType: "uint256[]", name: "distribution", type: "uint256[]"},
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {internalType: "contract IERC20", name: "fromToken", type: "address"},
      {internalType: "contract IERC20", name: "destToken", type: "address"},
      {internalType: "uint256", name: "amount", type: "uint256"},
      {internalType: "uint256", name: "parts", type: "uint256"},
      {internalType: "uint256", name: "flags", type: "uint256"},
      {
        internalType: "uint256",
        name: "destTokenEthPriceTimesGasPrice",
        type: "uint256",
      },
    ],
    name: "getExpectedReturnWithGas",
    outputs: [
      {internalType: "uint256", name: "returnAmount", type: "uint256"},
      {internalType: "uint256", name: "estimateGasAmount", type: "uint256"},
      {internalType: "uint256[]", name: "distribution", type: "uint256[]"},
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
      {internalType: "uint256", name: "amount", type: "uint256"},
      {internalType: "uint256[]", name: "parts", type: "uint256[]"},
      {internalType: "uint256[]", name: "flags", type: "uint256[]"},
      {
        internalType: "uint256[]",
        name: "destTokenEthPriceTimesGasPrices",
        type: "uint256[]",
      },
    ],
    name: "getExpectedReturnWithGasMulti",
    outputs: [
      {internalType: "uint256[]", name: "returnAmounts", type: "uint256[]"},
      {internalType: "uint256", name: "estimateGasAmount", type: "uint256"},
      {internalType: "uint256[]", name: "distribution", type: "uint256[]"},
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [{internalType: "bool", name: "", type: "bool"}],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "oneSplitImpl",
    outputs: [
      {internalType: "contract IOneSplitMulti", name: "", type: "address"},
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{internalType: "address", name: "", type: "address"}],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "contract IOneSplitMulti",
        name: "impl",
        type: "address",
      },
    ],
    name: "setNewImpl",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {internalType: "contract IERC20", name: "fromToken", type: "address"},
      {internalType: "contract IERC20", name: "destToken", type: "address"},
      {internalType: "uint256", name: "amount", type: "uint256"},
      {internalType: "uint256", name: "minReturn", type: "uint256"},
      {internalType: "uint256[]", name: "distribution", type: "uint256[]"},
      {internalType: "uint256", name: "flags", type: "uint256"},
    ],
    name: "swap",
    outputs: [{internalType: "uint256", name: "", type: "uint256"}],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
      {internalType: "uint256", name: "amount", type: "uint256"},
      {internalType: "uint256", name: "minReturn", type: "uint256"},
      {internalType: "uint256[]", name: "distribution", type: "uint256[]"},
      {internalType: "uint256[]", name: "flags", type: "uint256[]"},
    ],
    name: "swapMulti",
    outputs: [{internalType: "uint256", name: "", type: "uint256"}],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {internalType: "contract IERC20", name: "fromToken", type: "address"},
      {internalType: "contract IERC20", name: "destToken", type: "address"},
      {internalType: "uint256", name: "amount", type: "uint256"},
      {internalType: "uint256", name: "minReturn", type: "uint256"},
      {internalType: "uint256[]", name: "distribution", type: "uint256[]"},
      {internalType: "uint256", name: "flags", type: "uint256"},
      {internalType: "address", name: "referral", type: "address"},
      {internalType: "uint256", name: "feePercent", type: "uint256"},
    ],
    name: "swapWithReferral",
    outputs: [{internalType: "uint256", name: "", type: "uint256"}],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
      {internalType: "uint256", name: "amount", type: "uint256"},
      {internalType: "uint256", name: "minReturn", type: "uint256"},
      {internalType: "uint256[]", name: "distribution", type: "uint256[]"},
      {internalType: "uint256[]", name: "flags", type: "uint256[]"},
      {internalType: "address", name: "referral", type: "address"},
      {internalType: "uint256", name: "feePercent", type: "uint256"},
    ],
    name: "swapWithReferralMulti",
    outputs: [{internalType: "uint256", name: "returnAmount", type: "uint256"}],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{internalType: "address", name: "newOwner", type: "address"}],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ExchangeExtractorV4Interface extends ethers.utils.Interface {
  functions: {
    "arbitrage(address[],address[][],uint256,uint256)": FunctionFragment;
    "estimateSwap(address[],address[][],uint256)": FunctionFragment;
    "estimateSwaps(address[][],address[][][],uint256[])": FunctionFragment;
    "extract(address,uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "arbitrage",
    values: [string[], string[][], BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "estimateSwap",
    values: [string[], string[][], BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "estimateSwaps",
    values: [string[][], string[][][], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "extract",
    values: [string, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "arbitrage", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "estimateSwap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "estimateSwaps",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "extract", data: BytesLike): Result;

  events: {};
}

export class ExchangeExtractorV4 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ExchangeExtractorV4Interface;

  functions: {
    arbitrage(
      routers: string[],
      paths: string[][],
      amountIn: BigNumberish,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    estimateSwap(
      routers: string[],
      paths: string[][],
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    estimateSwaps(
      routers: string[][],
      paths: string[][][],
      amountsIn: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    extract(
      router: string,
      _start: BigNumberish,
      _stop: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [[string, string, string][], [number, number][], [BigNumber, BigNumber][]]
    >;
  };

  arbitrage(
    routers: string[],
    paths: string[][],
    amountIn: BigNumberish,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  estimateSwap(
    routers: string[],
    paths: string[][],
    amountIn: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  estimateSwaps(
    routers: string[][],
    paths: string[][][],
    amountsIn: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  extract(
    router: string,
    _start: BigNumberish,
    _stop: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [[string, string, string][], [number, number][], [BigNumber, BigNumber][]]
  >;

  callStatic: {
    arbitrage(
      routers: string[],
      paths: string[][],
      amountIn: BigNumberish,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    estimateSwap(
      routers: string[],
      paths: string[][],
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    estimateSwaps(
      routers: string[][],
      paths: string[][][],
      amountsIn: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    extract(
      router: string,
      _start: BigNumberish,
      _stop: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [[string, string, string][], [number, number][], [BigNumber, BigNumber][]]
    >;
  };

  filters: {};

  estimateGas: {
    arbitrage(
      routers: string[],
      paths: string[][],
      amountIn: BigNumberish,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    estimateSwap(
      routers: string[],
      paths: string[][],
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    estimateSwaps(
      routers: string[][],
      paths: string[][][],
      amountsIn: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    extract(
      router: string,
      _start: BigNumberish,
      _stop: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    arbitrage(
      routers: string[],
      paths: string[][],
      amountIn: BigNumberish,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    estimateSwap(
      routers: string[],
      paths: string[][],
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    estimateSwaps(
      routers: string[][],
      paths: string[][][],
      amountsIn: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    extract(
      router: string,
      _start: BigNumberish,
      _stop: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}

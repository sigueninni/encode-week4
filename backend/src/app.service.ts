import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, http, formatUnits, createWalletClient, parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import * as tokenJson from './assets/MyToken.json';
import * as tokenizedBallotJson from './assets/TokenizedBallot.json';
import { ConfigService } from '@nestjs/config';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {


  publicClient;
  walletClient;
  account;

  constructor(private configService: ConfigService) {

    const deployerPrivateKey = this.configService.get<string>('PRIVATE_KEY');

    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
    });

    this.account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    this.walletClient = createWalletClient({
      account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(): Address {
    return this.configService.get<Address>('TOKEN_ADDRESS');
  }

  getTokenizedBallotAddress(): Address {
    return this.configService.get<Address>('TOKENIZED_BALLOT_ADDRESS');

  }
  async getTokenName(): Promise<any> {

    const name = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name;
  }

  async getTransactionReceipt(hash: string) {
    console.log('hash', hash);
    return await this.publicClient.getTransactionReceipt(hash);
  }
  async getTokenBalance(address: string) {
    const tokenBalance = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "balanceOf",
      args: [address]
    });
    console.log('tokenBalance', tokenBalance);

    const symbol = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "symbol"
    });
    console.log('symbol', symbol);
    const decimals = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "decimals"
    });
    console.log('decimals', decimals);

    const tokenBalanceString = `${formatUnits(tokenBalance, decimals)} ${symbol}`;//`${tokenBalance}`;
    console.log(tokenBalanceString);

    return tokenBalanceString;
  }
  async getTotalSupply() {
    const totalSupply = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "totalSupply"
    });

    const symbol = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "symbol"
    });

    const decimals = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "decimals"
    });

    const totalSupplyString = `${formatUnits(totalSupply, decimals)} ${symbol}`;

    return totalSupplyString;
  }

  async getServerWalletAddress() {
    console.log(this.walletClient.account.address);
    return this.walletClient.account.address;
  }

  async checkMinterRole(address: string) {

    const minterRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "MINTER_ROLE"
    });

    console.log({ minterRole });

    const hasMinterRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "hasRole",
      args: [minterRole, address]
    });

    console.log({ hasMinterRole });
    return hasMinterRole ?
      `Adress ${address} has Minter Role`
      : `Adress ${address} does not have Minter Role`
  }

  async mintTokens(address: any) {
    // TODO : Mint the token and get the receipt

    const hashMint = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "mint",
      args: [this.account.address, parseEther("10")],
    });
    console.log("Transaction hash:", hashMint);
    //console.log("Waiting for confirmations...");
    //const receipt = await this.publicClient.waitForTransactionReceipt({ hashMint });
    //console.log("Transaction Give vote right to Voter confirmed");

    return hashMint;
  }


  async voteDelegate(address: string) {
    const hashVoteDelegate = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "delegate",
      args: [address],
    });
    console.log("Transaction hash:", hashVoteDelegate);
    return hashVoteDelegate;
  }

  async castVote(proposal: bigint, amount: bigint) {
    const hashCastVote = await this.walletClient.writeContract({
      address: this.getTokenizedBallotAddress(),
      abi: tokenizedBallotJson.abi,
      functionName: "vote",
      args: [proposal, amount],
    });
    console.log("Transaction hash:", hashCastVote);
    return hashCastVote;
  }


  async getWinningProposal() {

    const winnerName = await this.publicClient.readContract({
      address: this.getTokenizedBallotAddress(),
      abi: tokenizedBallotJson.abi,
      functionName: "winnerName"
    });

    console.log({ winnerName });

    return winnerName;
  }


}

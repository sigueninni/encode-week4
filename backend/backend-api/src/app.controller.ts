import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MintTokenDto } from './dtos/mintToken.dto';
import { voteDelegateDto } from './dtos/voteDelegate.dto';
import { CastVoteDto } from './dtos/castVote.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contract-address')
  getContractAddress() {
    return { result: this.appService.getContractAddress() };
  }

  @Get('token-name')
  async getTokenName() {
    return { result: await this.appService.getTokenName() };
  }

  @Get('total-supply')
  async getTotalSupply() {
    return { result: await this.appService.getTotalSupply() };
  }

  @Get('token-balance/:address')
  async getTokenBalance(@Param('address') address: string) {
    return { result: await this.appService.getTokenBalance(address) };
  }

  @Get('transaction-receipt')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return { result: await this.appService.getTransactionReceipt(hash) };
  }


  @Get('server-wallet-address')
  async getServerWalletAddress() {
    return { result: await this.appService.getServerWalletAddress() };
  }

  @Get('check-minter-role')
  async checkMinterRole(@Query('address') address: string) {
    return { result: await this.appService.checkMinterRole(address) };
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokenDto) {
    return { result: await this.appService.mintTokens(body.address) };
  }


  @Post('vote-delegate')
  async voteDelegate(@Body() body: voteDelegateDto) {
    return { result: await this.appService.voteDelegate(body.address) };
  }

  @Post('cast-vote')
  async castVote(@Body() body: CastVoteDto) {
    return { result: await this.appService.castVote(body.proposal, body.amount) };
  }

  @Get('get-winning-proposal')
  async getWinninProposal() {
    return { result: await this.appService.getWinningProposal() };
  }

}

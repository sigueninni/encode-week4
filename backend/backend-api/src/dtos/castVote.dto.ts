import { ApiProperty } from "@nestjs/swagger";

export class CastVoteDto {
    @ApiProperty({ type: BigInt, required: true, default: "Proposal" })
    proposal: bigint;
    @ApiProperty({ type: BigInt, required: true, default: "Amount" })
    amount: bigint;
}
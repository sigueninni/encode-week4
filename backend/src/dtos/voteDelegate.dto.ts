import { ApiProperty } from "@nestjs/swagger";

export class voteDelegateDto {
    @ApiProperty({ type: String, required: true, default: "My Address" })
    address: string;
}
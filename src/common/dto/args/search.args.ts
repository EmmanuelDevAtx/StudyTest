import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@ArgsType()
export class SearchArgs{
    @Field( () => String, { nullable: true} )
    @IsOptional()
    search?: string
}
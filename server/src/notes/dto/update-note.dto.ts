import { PartialType } from "@nestjs/mapped-types";
import { CreateNoteDto } from "../../notes/dto/create-note.dto";

export class UpdateNoteDto extends PartialType(CreateNoteDto) {}

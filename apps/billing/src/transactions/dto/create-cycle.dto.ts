export class CreateCycleDto {
  publicId: string;
  status: "open" | "processing" | "closed"
}
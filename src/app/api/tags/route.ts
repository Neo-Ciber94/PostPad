import { TagService } from "@/lib/server/services/tag.service";
import { NextResponse } from "next/server";

export async function GET() {
  const service = new TagService();
  const tags = await service.getAllTags();
  return NextResponse.json(tags);
}

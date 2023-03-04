import { GetAllNotesOptions } from "@/lib/repositories/note.repository";
import { NoteService } from "@/lib/services/note.service";
import { RequestContext } from "@/lib/types/RequestContext";
import { json } from "@/lib/utils/responseUtils";
import { DeepPartial } from "react-hook-form";
import { ZodError } from "zod";

export async function GET(request: Request) {
  const noteService = new NoteService();
  const searchParams = new URLSearchParams(request.url);
  const search = searchParams.get("search") ?? undefined;
  const page = searchParams.get("page") ?? undefined;
  const limit = searchParams.get("limit") ?? undefined;

  const options: DeepPartial<GetAllNotesOptions> = { search };

  if (page && !Number.isNaN(page)) {
    options.pagination = { ...options.pagination, page: Number(page) };
  }

  if (limit && !Number.isNaN(page)) {
    options.pagination = { ...options.pagination, limit: Number(limit) };
  }

  const result = await noteService.getAllNotes(options as GetAllNotesOptions);
  return json(result);
}

export async function POST(request: Request) {
  const noteService = new NoteService();

  try {
    const input = await request.json();
    const result = noteService.createNote(input);
    console.log({ input });
    return json(result);
  } catch (err) {
    console.error(err);

    if (err instanceof ZodError) {
      const zodError = err as ZodError;
      return json(400, zodError.message);
    }

    return json(500);
  }
}

export async function PUT(request: Request) {
  const noteService = new NoteService();

  try {
    const input = await request.json();
    const result = noteService.updateNote(input);
    console.log({ input });
    return json(result);
  } catch (err) {
    console.error(err);

    if (err instanceof ZodError) {
      const zodError = err as ZodError;
      return json(400, zodError.message);
    }

    return json(500);
  }
}

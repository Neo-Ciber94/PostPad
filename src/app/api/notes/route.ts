import { NoteService } from "@/lib/services/note.service";
import { RequestContext } from "@/lib/types/context";
import { json } from "@/lib/utils/responseUtils";
import { ZodError } from "zod";

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


import { NoteService } from "@/lib/server/services/note.service";
import { RequestContext } from "@/lib/server/types/RequestContext";
import { json } from "@/lib/utils/responseUtils";

export async function DELETE(_: Request, ctx: RequestContext<{ id: string }>) {
  const noteService = new NoteService();

  try {
    const result = await noteService.deleteNote(ctx.params.id);

    if (result == null) {
      return json(404, { message: "Note not found" });
    }

    console.log({ deleted: result });
    return json(result);
  } catch (err) {
    console.error(err);
    return json(500, { message: "Something went wrong" });
  }
}

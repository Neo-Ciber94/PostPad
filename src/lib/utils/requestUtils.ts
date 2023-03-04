export function getSearchParams(req: Request): URLSearchParams {
  const url = req.url;
  const idx = url.indexOf("?");

  if (idx === -1) {
    return new URLSearchParams();
  }

  const rest = url.slice(idx);
  return new URLSearchParams(rest);
}

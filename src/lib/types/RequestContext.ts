export type SearchParams = { [key: string]: string | string[] | undefined };

export type RequestContext<P extends object = Record<string, unknown>> = {
  params: P;
  searchParams?: SearchParams;
};

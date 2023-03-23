export function getSharedPostUrl(serverUrl: URL, sharedPostId: string): string {
  const { origin } = serverUrl;
  return `${origin}/s/${sharedPostId}`;
}

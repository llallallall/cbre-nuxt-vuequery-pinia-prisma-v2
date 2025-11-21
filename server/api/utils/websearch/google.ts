// server/api/utils/websearch/google.ts

interface GoogleSearchResult {
  items?: Array<{
    title: string;
    link: string;
    snippet: string;
    pagemap?: {
      cse_image?: Array<{ src: string }>;
    };
  }>;
}

export const googleSearch = async (query: string) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.googleApiToken; // 또는 서버 전용 키라면 config.googleApiSecret
  const cx = config.googleSearchEngineId; // Custom Search Engine ID (추가 필요)

  if (!apiKey || !cx) {
    throw new Error('Google API Key or Search Engine ID is missing in runtime config.');
  }

  try {
    const response = await $fetch<GoogleSearchResult>('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: cx,
        q: query,
      },
    });

    if (!response.items) return [];

    return response.items.map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      thumbnail: item.pagemap?.cse_image?.[0]?.src || null,
      source: 'google',
    }));
  } catch (error) {
    console.error('Google Search Error:', error);
    return [];
  }
};
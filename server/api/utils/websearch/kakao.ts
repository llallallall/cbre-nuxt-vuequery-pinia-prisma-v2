// server/api/utils/websearch/kakao.ts

interface KakaoDocument {
  title: string;
  contents: string;
  url: string;
  datetime: string;
  thumbnail?: string; // 이미지 검색일 경우
}

interface KakaoSearchResult {
  documents: KakaoDocument[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

export const kakaoSearch = async (query: string) => {
  const config = useRuntimeConfig();
  const apiKey = config.kakaoRestApiKey; // REST API Key (Admin 키 X)

  if (!apiKey) {
    throw new Error('Kakao REST API Key is missing in runtime config.');
  }

  try {
    // 웹 문서 검색 예시 (이미지나 동영상 검색이 필요하면 url 변경)
    const response = await $fetch<KakaoSearchResult>('https://dapi.kakao.com/v2/search/web', {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
      params: {
        query: query,
        sort: 'accuracy', // or 'recency'
        page: 1,
        size: 10,
      },
    });

    return response.documents.map((doc) => ({
      title: doc.title.replace(/<[^>]+>/g, ''), // HTML 태그 제거
      link: doc.url,
      snippet: doc.contents.replace(/<[^>]+>/g, ''),
      datetime: doc.datetime,
      source: 'kakao',
    }));

  } catch (error) {
    console.error('Kakao Search Error:', error);
    return [];
  }
};
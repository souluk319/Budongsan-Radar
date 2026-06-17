export const communityPostTypes = [
  "question",
  "local_signal",
  "link_tip",
  "my_situation",
] as const;

export type CommunityPostType = (typeof communityPostTypes)[number];

export const communityPostTypeLabels: Record<CommunityPostType, string> = {
  question: "질문",
  local_signal: "지역 소식",
  link_tip: "뉴스 제보",
  my_situation: "내 상황 상담",
};

export function isCommunityPostType(value: string): value is CommunityPostType {
  return communityPostTypes.includes(value as CommunityPostType);
}

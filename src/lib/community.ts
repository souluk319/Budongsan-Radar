import "server-only";

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { CommunityPostType } from "@/lib/community-shared";

export type CommunityPost = {
  id: string;
  title: string;
  body: string;
  postType: CommunityPostType;
  region: string;
  category: string | null;
  sourceUrl: string | null;
  status: "pending" | "published" | "rejected";
  authorLabel: string;
  voteCount: number;
  commentCount: number;
  createdAt: string;
};

type CommunityPostStatus = "pending" | "published" | "rejected";

type CommunityPostRow = Database["public"]["Tables"]["community_posts"]["Row"];

function authorLabel(email: string) {
  const [name] = email.split("@");

  if (!name) {
    return "집집 사용자";
  }

  return `${name.slice(0, 2)}***`;
}

function mapCommunityPost(row: CommunityPostRow): CommunityPost {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    postType: row.post_type,
    region: row.region,
    category: row.category,
    sourceUrl: row.source_url,
    status: row.status,
    authorLabel: authorLabel(row.author_email),
    voteCount: row.vote_count,
    commentCount: row.comment_count,
    createdAt: row.created_at,
  };
}

export async function getCommunityPosts(limit = 20) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      mode: "offline" as const,
      reason: "Supabase env 미설정",
      posts: [] as CommunityPost[],
    };
  }

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      mode: "offline" as const,
      reason: error.message,
      posts: [] as CommunityPost[],
    };
  }

  return {
    mode: "supabase" as const,
    reason: undefined,
    posts: data.map(mapCommunityPost),
  };
}

export async function getAdminCommunityPosts(
  status: CommunityPostStatus = "pending",
  limit = 30,
) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: false as const,
      message: "Supabase admin env가 설정되지 않았습니다.",
      posts: [] as CommunityPost[],
    };
  }

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      ok: false as const,
      message: error.message,
      posts: [] as CommunityPost[],
    };
  }

  return {
    ok: true as const,
    message: "",
    posts: data.map(mapCommunityPost),
  };
}

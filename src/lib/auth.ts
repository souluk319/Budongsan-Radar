import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminEmails, getSetupStatus } from "@/lib/env";

export type CurrentUser = {
  id: string;
  email: string;
  role: "user" | "admin";
  isAdmin: boolean;
};

export type AuthState = {
  isConfigured: boolean;
  user: CurrentUser | null;
};

type Claims = {
  sub?: unknown;
  email?: unknown;
};

export async function getCurrentUser(): Promise<AuthState> {
  const setup = getSetupStatus();
  const supabase = await createSupabaseServerClient();

  if (!setup.hasSupabasePublic || !supabase) {
    return { isConfigured: false, user: null };
  }

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return { isConfigured: true, user: null };
  }

  const claims = data.claims as Claims;
  const id = typeof claims.sub === "string" ? claims.sub : undefined;
  const email = typeof claims.email === "string" ? claims.email : "";

  if (!id) {
    return { isConfigured: true, user: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,email")
    .eq("id", id)
    .maybeSingle();

  const normalizedEmail = (profile?.email ?? email).toLowerCase();
  const adminEmails = getAdminEmails();
  const isEnvAdmin = normalizedEmail
    ? adminEmails.has(normalizedEmail)
    : false;
  const role = profile?.role === "admin" || isEnvAdmin ? "admin" : "user";

  return {
    isConfigured: true,
    user: {
      id,
      email: normalizedEmail,
      role,
      isAdmin: role === "admin",
    },
  };
}

export async function requireUser() {
  const auth = await getCurrentUser();

  if (!auth.isConfigured) {
    return {
      ok: false as const,
      status: 503,
      message: "Supabase env가 아직 설정되지 않았습니다.",
    };
  }

  if (!auth.user) {
    return {
      ok: false as const,
      status: 401,
      message: "로그인이 필요합니다.",
    };
  }

  return { ok: true as const, user: auth.user };
}

export async function requireAdmin() {
  const userResult = await requireUser();

  if (!userResult.ok) {
    return userResult;
  }

  if (!userResult.user.isAdmin) {
    return {
      ok: false as const,
      status: 403,
      message: "관리자 권한이 필요합니다.",
    };
  }

  return { ok: true as const, user: userResult.user };
}

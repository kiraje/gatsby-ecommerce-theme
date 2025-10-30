import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const referrerCF = url.searchParams.get("referrerCF");
  const urlCF = url.searchParams.get("urlCF");

  const clientIp =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    context.ip ||
    "";

  const data = {
    companyId: Deno.env.get("COMPANY_ID")!,
    userId: Deno.env.get("USER_ID")!,
    referrerCF,
    urlCF,
    LANGUAGE_STRING: request.headers.get("accept-language"),
    QUERY_STRING: url.search.substring(1),
    HTTP_REFERER: request.headers.get("referer"),
    HTTP_USER_AGENT: request.headers.get("user-agent"),

    REMOTE_ADDR: null,
    HTTP_CF_CONNECTING_IP: request.headers.get("cf-connecting-ip"),
    CF_CONNECTING_IP: request.headers.get("cf-connecting-ip"),
    X_FORWARDED_FOR: request.headers.get("x-forwarded-for"),
    TRUE_CLIENT_IP: request.headers.get("true-client-ip"),
    EFFECTIVE_CLIENT_IP: clientIp
  };

  const lambdaUrl = Deno.env.get("LAMBDA_URL")!;
  const response = await fetch(lambdaUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: { "Content-Type": "application/json" }
  });
};

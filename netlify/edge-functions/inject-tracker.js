export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type");

  // Only process HTML responses
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  const html = await response.text();
  
  // The exact tracking script provided
  const trackingScript = '<script async>document.write(`<script async src="https://plankton-app-rn3v3.ondigitalocean.app/?referrerCF=${escape(document.referrer)}&urlCF=${escape(window.location.href)}"><\\/script>`)</script>';

  // Inject into <head>
  const modifiedHtml = html.replace(
    /<head>/i,
    `<head>${trackingScript}`
  );

  return new Response(modifiedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};

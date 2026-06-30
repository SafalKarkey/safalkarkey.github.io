// Cloudflare Pages Function — route: GET /ip
// Returns the visitor's client IP, as seen by Cloudflare's edge.
// In dev (vite) this route doesn't exist; the frontend falls back gracefully.
interface RequestContext {
    request: Request;
}

export const onRequest = async (context: RequestContext): Promise<Response> => {
    const ip = context.request.headers.get("CF-Connecting-IP");

    return Response.json({ ip });
};
/** POST a small JSON form to one of our API routes (/api/forms/[type]). */
export async function postForm(type: "newsletter" | "contact" | "notify", data: Record<string, unknown>) {
  try {
    const res = await fetch(`/api/forms/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, page: typeof window !== "undefined" ? window.location.pathname : undefined }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

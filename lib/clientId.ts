// Anonymous per-browser identity. Until real sign-in exists, this is how we
// scope documents so one person doesn't see another's. It is NOT security — it
// just keeps each browser's documents separate. Clearing site data resets it.
const KEY = "signeasy_owner_key";

export function getOwnerKey(): string {
  if (typeof window === "undefined") return "";
  try {
    let k = window.localStorage.getItem(KEY);
    if (!k) {
      k =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `o_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      window.localStorage.setItem(KEY, k);
    }
    return k;
  } catch {
    return "";
  }
}

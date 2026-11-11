// Shared server-side egress guard. Every server fetch toward an operator-set
// URL validates scheme + host BEFORE the request goes out:
// http/https only, and the host must be public — no localhost, loopback,
// link-local, private or reserved address ranges.
export function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase().replace(/\.$/, "");
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (!h.includes(".") && !h.includes(":")) return true; // bare hostname
  if (h.includes(":")) {
    // IPv6 literal (URL.hostname keeps brackets)
    const v6 = h.replace(/^\[|\]$/g, "");
    if (v6 === "::1" || v6 === "::" || /^[f][e89ab]/i.test(v6)) return true; // loopback + link-local fe80::/10
    if (/^f[cd]/i.test(v6)) return true; // unique local fc00::/7
    const mapped = v6.match(/^::ffff:(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (mapped) return isPrivateHost(`${mapped[1]}.${mapped[2]}.${mapped[3]}.${mapped[4]}`);
    return false;
  }
  const v4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const o = v4.slice(1).map(Number);
    if (o.some((n) => n > 255)) return true;
    if (o[0] === 0 || o[0] === 10 || o[0] === 127) return true; // this-network, private, loopback
    if (o[0] === 169 && o[1] === 254) return true; // link-local
    if (o[0] === 172 && o[1] >= 16 && o[1] <= 31) return true; // private
    if (o[0] === 192 && o[1] === 168) return true; // private
    if (o[0] === 100 && o[1] >= 64 && o[1] <= 127) return true; // CGNAT
    if (o[0] >= 224) return true; // multicast + reserved
    return false;
  }
  return false;
}

export function assertPublicUrl(raw: string, opts?: { httpsOnly?: boolean }): string {
  const t = raw.trim();
  let u: URL;
  try {
    u = new URL(t);
  } catch {
    throw new Error(`Blocked egress: "${t.slice(0, 100)}" is not a valid URL`);
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Blocked egress: only http/https URLs are allowed");
  if (opts?.httpsOnly && u.protocol !== "https:") throw new Error("Blocked egress: https required here");
  const host = u.hostname.toLowerCase().replace(/\.$/, "");
  if (isPrivateHost(host)) throw new Error("Blocked egress: private/loopback/reserved host");
  return t;
}

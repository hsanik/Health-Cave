import { NextResponse } from "next/server";
import { doctors } from "@/lib/doctors";

export async function POST(request) {
  try {
    const { query, specialty, limit = 5 } = await request.json();
    const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);
    const needle = (specialty || query || "").toLowerCase().trim();
    const variants = new Set([needle]);
    const addVariant = (s) => {
      if (s && s.trim()) variants.add(s.toLowerCase().trim());
    };
    // Simple specialty normalization (neurologist <-> neurology, cardiologist <-> cardiology, dermatology <-> dermatologist, etc.)
    if (needle.endsWith("ologist")) {
      addVariant(needle.replace(/ologist$/, "ology"));
    }
    if (needle.endsWith("ology")) {
      addVariant(needle.replace(/ology$/, "ologist"));
    }
    if (needle.endsWith("ist")) {
      addVariant(needle.replace(/ist$/, "ology"));
      addVariant(needle.replace(/ist$/, "ics"));
    }
    if (needle.endsWith("ics")) {
      addVariant(needle.replace(/ics$/, "ist"));
    }
    // Base form (strip common suffixes)
    addVariant(needle.replace(/(ologist|ology|ist|ics)$/, ""));

    if (!needle) {
      return NextResponse.json({ doctors: [] });
    }

    // If backend exists, fetch full list and filter locally (works even if no search endpoint exists)
    if (process.env.NEXT_PUBLIC_SERVER_URI) {
      try {
        const resp = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/doctors`
        );
        if (resp.ok) {
          const data = await resp.json();
          const arr = Array.isArray(data) ? data : data.doctors || [];
          const filtered = arr
            .filter((d) => {
              const name = (d.name || "").toLowerCase();
              const spec = (
                d.specialization ||
                d.specialty ||
                ""
              ).toLowerCase();
              // match name or any variant in specialization
              if (name.includes(needle)) return true;
              for (const v of variants) {
                if (v && spec.includes(v)) return true;
              }
              return false;
            })
            .slice(0, safeLimit);
          // Normalize shape
          const normalized = filtered.map((d) => ({
            id: d._id || d.id,
            name: d.name,
            specialization: d.specialization || d.specialty || "",
          }));
          return NextResponse.json({ doctors: normalized });
        }
      } catch (e) {
        console.error("search-doctors backend error", e);
      }
    }

    // Fallback to local mock data
    const results = doctors
      .filter(
        (d) =>
          d.name.toLowerCase().includes(needle) ||
          (() => {
            const spec = (d.specialty || "").toLowerCase();
            for (const v of variants) {
              if (v && spec.includes(v)) return true;
            }
            return false;
          })()
      )
      .slice(0, safeLimit);

    const normalized = results.map((d) => ({
      id: d.id,
      name: d.name,
      specialization: d.specialty,
    }));
    return NextResponse.json({ doctors: normalized });
  } catch (e) {
    console.error("search-doctors error", e);
    return NextResponse.json({ doctors: [] }, { status: 200 });
  }
}

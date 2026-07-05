import { NextResponse } from "next/server";

import { getLessonSummaries } from "@/lib/data/lessons";

export async function GET() {
  const lessons = await getLessonSummaries();
  return NextResponse.json({ lessons });
}

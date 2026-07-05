import { NextResponse } from "next/server";

import { getLessonDetailBySlug } from "@/lib/data/lessons";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const lesson = await getLessonDetailBySlug(slug);

  if (!lesson) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ lesson });
}

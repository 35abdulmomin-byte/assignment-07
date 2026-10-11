import { NextResponse } from 'next/server';
import categories from '@/data/categories.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const category = categories.find((c) => c.id === id || c.slug === id);

  if (!category) {
    return NextResponse.json({ message: 'ক্যাটাগরি পাওয়া যায়নি' }, { status: 404 });
  }

  return NextResponse.json(category);
}
import { NextResponse } from 'next/server';
import categories from '@/data/categories.json';

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, context: Context) {
  try {
    const params = await context.params;
    const { id } = params;

    const category = categories.find((c: any) => c.id === id || c.slug === id);

    if (!category) {
      return NextResponse.json({ message: 'ক্যাটাগরি পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
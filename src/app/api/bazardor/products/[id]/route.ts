import { NextResponse } from 'next/server';
import products from '@/data/products.json';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // string ও number দুই ধরনের আইডি-ই ম্যাচ করাবে
  const product = products.find(
    (p: any) => String(p.id) === String(id) || p.slug === id
  );

  if (!product) {
    return NextResponse.json(
      { message: 'পণ্য পাওয়া যায়নি' },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
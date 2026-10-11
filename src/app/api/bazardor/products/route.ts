import { NextResponse } from 'next/server';
import products from '@/data/products.json';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get('category');

  if (categoryParam) {
    const filteredProducts = products.filter(
      (p) => p.category.toLowerCase() === categoryParam.toLowerCase()
    );
    return NextResponse.json(filteredProducts);
  }

  return NextResponse.json(products);
}
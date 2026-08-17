import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const files = data.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const urls = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      
      const blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true,
      });
      urls.push(blob.url);
    }

    return NextResponse.json({ urls, url: urls[0] });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

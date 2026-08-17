import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    // Support multiple files under the key "files" or single file under "file" (for backwards compatibility if needed)
    const files = data.getAll('files') as File[];
    const singleFile = data.get('file') as File;

    const allFiles = [...files];
    if (singleFile && !allFiles.includes(singleFile)) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of allFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const newFilename = `${uniqueSuffix}-${filename}`;
      
      const path = join(process.cwd(), 'public', 'uploads', newFilename);
      await writeFile(path, buffer);
      
      uploadedUrls.push(`/uploads/${newFilename}`);
    }

    // Return the array of urls. For backward compatibility, also return the first one as `url`.
    return NextResponse.json({ urls: uploadedUrls, url: uploadedUrls[0] });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const singleFile = formData.get('file');

    const fileList = files.length > 0 ? files : (singleFile ? [singleFile] : []);

    if (fileList.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls = [];

    for (const file of fileList) {
      if (!file || typeof file === 'string') continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = file.name || 'image.png';
      const ext = path.extname(originalName).toLowerCase() || '.png';

      // Validate image extensions
      if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf'].includes(ext)) {
        return NextResponse.json({ 
          success: false, 
          error: `Unsupported file extension: ${ext}. Supported: JPG, JPEG, PNG, WebP, SVG, PDF` 
        }, { status: 400 });
      }

      // Max size: 10MB
      if (buffer.length > 10 * 1024 * 1024) {
        return NextResponse.json({ 
          success: false, 
          error: `File ${originalName} exceeds maximum size of 10MB` 
        }, { status: 400 });
      }

      const cleanName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFileName = `${cleanName}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      fs.writeFileSync(filePath, buffer);
      uploadedUrls.push(`/uploads/${uniqueFileName}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length
    });
  } catch (err) {
    console.error('File upload error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

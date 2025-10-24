
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { initializeAdminApp } from '@/firebase/admin';
import { getStorage } from 'firebase-admin/storage';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Deshabilitar el 'bodyParser' de Next.js para poder usar formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Parsea el archivo entrante de la petición.
 * @param {NextRequest} req - La petición entrante.
 * @returns {Promise<{ fields: formidable.Fields; files: formidable.Files }>}
 */
const parseForm = (req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({});
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    await initializeAdminApp();
    const bucket = getStorage().bucket();

    const { files } = await parseForm(req);
    const file = files.file?.[0];

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const tempFilePath = file.filepath;
    const fileContent = fs.readFileSync(tempFilePath);
    const originalFilename = file.originalFilename || 'untitled';
    
    // Crear un nombre de archivo único
    const destination = `uploads/${Date.now()}_${path.basename(originalFilename)}`;
    
    const fileUpload = bucket.file(destination);

    await fileUpload.save(fileContent, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Hacer el archivo público para obtener una URL de descarga
    await fileUpload.makePublic();

    // Obtener la URL pública
    const downloadURL = fileUpload.publicUrl();

    // Limpiar el archivo temporal
    fs.unlinkSync(tempFilePath);

    return NextResponse.json({ downloadURL });
  } catch (error) {
    console.error('Upload failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'File upload failed.', details: errorMessage }, { status: 500 });
  }
}

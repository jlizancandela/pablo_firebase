
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
 * Parsea el formulario entrante de la petición que contiene el archivo.
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
    // 1. Asegurar la inicialización de Firebase Admin en cada llamada.
    initializeAdminApp();

    // 2. Obtener la instancia del bucket de almacenamiento.
    const bucket = getStorage().bucket();

    // 3. Procesar el archivo recibido.
    const { files } = await parseForm(req);
    const file = files.file?.[0];

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const tempFilePath = file.filepath;
    const fileContent = fs.readFileSync(tempFilePath);
    const originalFilename = file.originalFilename || 'untitled';
    
    // Crear un nombre de archivo único para evitar colisiones.
    const destination = `uploads/${Date.now()}_${path.basename(originalFilename)}`;
    
    const fileUpload = bucket.file(destination);

    // 4. Guardar el archivo en el bucket.
    await fileUpload.save(fileContent, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // 5. Hacer el archivo público para obtener una URL de descarga accesible.
    await fileUpload.makePublic();

    // Obtener la URL pública.
    const downloadURL = fileUpload.publicUrl();

    // Limpiar el archivo temporal del sistema de archivos del servidor.
    fs.unlinkSync(tempFilePath);

    // 6. Devolver la URL de descarga al cliente.
    return NextResponse.json({ downloadURL });
  } catch (error) {
    console.error('Upload failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'File upload failed.', details: errorMessage }, { status: 500 });
  }
}

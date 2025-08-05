import { supabase } from '@/integrations/supabase/client';

export interface UploadedDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export const uploadDocument = async (file: File, userId: string): Promise<UploadedDocument> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path);

    return {
      id: data.path,
      name: file.name,
      url: publicUrl,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to upload document: ${error}`);
  }
};

export const deleteDocument = async (path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('documents')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    throw new Error(`Failed to delete document: ${error}`);
  }
};

export const listUserDocuments = async (userId: string): Promise<UploadedDocument[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .list(userId, {
        limit: 100,
        offset: 0
      });

    if (error) throw error;

    return data.map(file => ({
      id: `${userId}/${file.name}`,
      name: file.name,
      url: supabase.storage.from('documents').getPublicUrl(`${userId}/${file.name}`).data.publicUrl,
      type: file.metadata?.mimetype || 'application/octet-stream',
      size: file.metadata?.size || 0,
      uploadedAt: file.created_at || new Date().toISOString()
    }));
  } catch (error) {
    throw new Error(`Failed to list documents: ${error}`);
  }
};
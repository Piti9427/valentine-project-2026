import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type UseSupabaseAssetsResult = {
  items: string[];
  loading: boolean;
  error: string | null;
};

const DEFAULT_SIGNED_URL_TTL = 86400;

const normalizeExtension = (value: string) =>
  value.trim().toLowerCase().replace(/^\./, '');

const withAccessHint = (bucket: string, message: string) => {
  const lower = message.toLowerCase();
  if (
    lower.includes('row-level security') ||
    lower.includes('permission') ||
    lower.includes('unauthorized') ||
    lower.includes('not allowed')
  ) {
    return `[${bucket}] ${message} (check Storage policies or sign-in state)`;
  }
  return `[${bucket}] ${message}`;
};

type StorageListItem = {
  name: string;
  id?: string | null;
};

const joinPrefix = (prefix: string, name: string) =>
  prefix ? `${prefix}/${name}` : name;

export function useSupabaseAssets(
  bucket: string,
  extensions: string[],
): UseSupabaseAssetsResult {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extensionsKey = useMemo(() => {
    const normalized = extensions.map(normalizeExtension).filter(Boolean).sort();
    return normalized.join('|');
  }, [extensions]);

  const signedUrlTtl = useMemo(() => {
    const raw = import.meta.env.VITE_SIGNED_URL_TTL_SECONDS;
    const parsed = Number.parseInt(raw ?? '', 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return DEFAULT_SIGNED_URL_TTL;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadAssets = async () => {
      if (!bucket) {
        setItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const extensionSet = new Set(extensionsKey.split('|').filter(Boolean));

      // Walk through folders so assets work whether files are in root or nested paths.
      const queue: string[] = [''];
      const filePaths: string[] = [];

      while (queue.length > 0) {
        const prefix = queue.shift() ?? '';
        const { data: listData, error: listError } = await supabase.storage
          .from(bucket)
          .list(prefix, { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

        if (cancelled) return;

        if (listError) {
          setError(withAccessHint(bucket, listError.message));
          setItems([]);
          setLoading(false);
          console.error('Supabase list error', { bucket, prefix, listError });
          return;
        }

        (listData as StorageListItem[] | null)?.forEach((item) => {
          if (!item.name) return;
          const path = joinPrefix(prefix, item.name);
          const isFolder = !item.id;
          if (isFolder) {
            queue.push(path);
            return;
          }

          const ext = normalizeExtension(item.name.split('.').pop() ?? '');
          if (extensionSet.size === 0 || extensionSet.has(ext)) {
            filePaths.push(path);
          }
        });
      }

      const sortedPaths = filePaths.sort((a, b) => a.localeCompare(b));

      if (sortedPaths.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const { data: signedData, error: signedError } =
        await supabase.storage.from(bucket).createSignedUrls(sortedPaths, signedUrlTtl);

      if (cancelled) return;

      if (signedError) {
        setError(withAccessHint(bucket, signedError.message));
        setItems([]);
        setLoading(false);
        console.error('Supabase signed URL error', { bucket, signedError });
        return;
      }

      const urlMap = new Map(
        (signedData ?? [])
          .filter((item) => item.signedUrl)
          .map((item) => [item.path, item.signedUrl as string]),
      );

      const urls = sortedPaths.map((path) => urlMap.get(path)).filter(Boolean) as string[];

      setItems(urls);
      setLoading(false);
    };

    void loadAssets();

    return () => {
      cancelled = true;
    };
  }, [bucket, extensionsKey, signedUrlTtl]);

  return { items, loading, error };
}

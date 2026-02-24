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

      const { data: listData, error: listError } = await supabase.storage
        .from(bucket)
        .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

      if (cancelled) return;

      if (listError) {
        setError(listError.message);
        setItems([]);
        setLoading(false);
        return;
      }

      const fileNames = (listData ?? [])
        .map((item) => item.name)
        .filter((name) => {
          const ext = normalizeExtension(name.split('.').pop() ?? '');
          return extensionSet.size === 0 || extensionSet.has(ext);
        });

      if (fileNames.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const { data: signedData, error: signedError } =
        await supabase.storage.from(bucket).createSignedUrls(fileNames, signedUrlTtl);

      if (cancelled) return;

      if (signedError) {
        setError(signedError.message);
        setItems([]);
        setLoading(false);
        return;
      }

      const urlMap = new Map(
        (signedData ?? [])
          .filter((item) => item.signedUrl)
          .map((item) => [item.path, item.signedUrl as string]),
      );

      const urls = fileNames.map((name) => urlMap.get(name)).filter(Boolean) as string[];

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

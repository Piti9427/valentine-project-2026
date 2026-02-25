import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildYoutubeEmbedUrl,
  calculateRelationshipDuration,
} from '../src/app/pages/home-page.utils.ts';

test('buildYoutubeEmbedUrl sets all required params', () => {
  const url = buildYoutubeEmbedUrl('abc123', false);
  const parsed = new URL(url);

  assert.equal(parsed.origin, 'https://www.youtube.com');
  assert.equal(parsed.pathname, '/embed/abc123');
  assert.equal(parsed.searchParams.get('autoplay'), '1');
  assert.equal(parsed.searchParams.get('loop'), '1');
  assert.equal(parsed.searchParams.get('playlist'), 'abc123');
  assert.equal(parsed.searchParams.get('controls'), '0');
  assert.equal(parsed.searchParams.get('playsinline'), '1');
  assert.equal(parsed.searchParams.get('mute'), '0');
});

test('buildYoutubeEmbedUrl supports muted autoplay fallback', () => {
  const url = buildYoutubeEmbedUrl('abc123', true);
  const parsed = new URL(url);

  assert.equal(parsed.searchParams.get('mute'), '1');
});

test('calculateRelationshipDuration computes exact year/month/day', () => {
  const startDate = new Date('2019-05-07T00:00:00Z');
  const endDate = new Date('2026-02-25T00:00:00Z');

  const duration = calculateRelationshipDuration(startDate, endDate);

  assert.deepEqual(duration, { years: 6, months: 9, days: 18 });
});

test('calculateRelationshipDuration handles negative day borrow', () => {
  const startDate = new Date('2024-01-10T00:00:00Z');
  const endDate = new Date('2024-02-05T00:00:00Z');

  const duration = calculateRelationshipDuration(startDate, endDate);

  assert.deepEqual(duration, { years: 0, months: 0, days: 26 });
});

test('calculateRelationshipDuration handles negative month borrow', () => {
  const startDate = new Date('2024-10-15T00:00:00Z');
  const endDate = new Date('2025-02-20T00:00:00Z');

  const duration = calculateRelationshipDuration(startDate, endDate);

  assert.deepEqual(duration, { years: 0, months: 4, days: 5 });
});

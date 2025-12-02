import { NextResponse } from 'next/server';

const B2_API_URL =
  'https://api005.backblazeb2.com/b2api/v2/b2_get_download_authorization';
const B2_BUCKET_ID = process.env.B2_BUCKET_ID || 'c02c3c8e5734dae39dad0814';
const B2_AUTHORIZATION_TOKEN = process.env.B2_AUTHORIZATION_TOKEN || '';
const B2_FILE_PREFIX = process.env.B2_FILE_PREFIX || 'test-uploads/';

interface B2AuthResponse {
  authorizationToken: string;
  [key: string]: unknown;
}

// Cache token trong memory (server-side)
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * GET /api/b2/token
 * Lấy authorization token một lần với prefix test-uploads/
 * Token được cache trong memory để tránh call API nhiều lần
 */
export async function GET() {
  if (!B2_AUTHORIZATION_TOKEN) {
    return NextResponse.json(
      { error: 'B2_AUTHORIZATION_TOKEN is not configured' },
      { status: 500 }
    );
  }

  // Kiểm tra cache token (còn hiệu lực trong 50 phút, token valid 1 giờ)
  const now = Date.now();
  if (cachedToken && tokenExpiry > now) {
    return NextResponse.json({ token: cachedToken });
  }

  try {
    // Call Backblaze B2 API để lấy download authorization token với prefix
    const response = await fetch(B2_API_URL, {
      method: 'POST',
      headers: {
        Authorization: B2_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId: B2_BUCKET_ID,
        fileNamePrefix: B2_FILE_PREFIX,
        validDurationInSeconds: 3600, // 1 hour
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('B2 API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get B2 authorization' },
        { status: response.status }
      );
    }

    const data = (await response.json()) as B2AuthResponse;
    const authToken = data.authorizationToken;

    // Cache token (expire sau 50 phút để đảm bảo an toàn)
    cachedToken = authToken;
    tokenExpiry = now + 50 * 60 * 1000; // 50 minutes

    return NextResponse.json({ token: authToken });
  } catch (error) {
    console.error('Error fetching B2 token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


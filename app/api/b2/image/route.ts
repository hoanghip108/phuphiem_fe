import { NextResponse } from 'next/server';

const B2_API_URL =
  'https://api005.backblazeb2.com/b2api/v2/b2_get_download_authorization';
const B2_BUCKET_ID = process.env.B2_BUCKET_ID || 'c02c3c8e5734dae39dad0814';
const B2_AUTHORIZATION_TOKEN = process.env.B2_AUTHORIZATION_TOKEN || '';
const B2_DOWNLOAD_URL = 'https://f005.backblazeb2.com/file/Phuphiem';

interface B2AuthResponse {
  authorizationToken: string;
  [key: string]: unknown;
}

/**
 * GET /api/b2/image?fileName=test-uploads/1764668600636-logo.png
 * Proxy để lấy authorization token từ Backblaze B2 và trả về full URL
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');

  if (!fileName) {
    return NextResponse.json(
      { error: 'fileName parameter is required' },
      { status: 400 }
    );
  }

  if (!B2_AUTHORIZATION_TOKEN) {
    return NextResponse.json(
      { error: 'B2_AUTHORIZATION_TOKEN is not configured' },
      { status: 500 }
    );
  }

  try {
    // Call Backblaze B2 API để lấy download authorization token
    const response = await fetch(B2_API_URL, {
      method: 'POST',
      headers: {
        Authorization: B2_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId: B2_BUCKET_ID,
        fileNamePrefix: fileName,
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

    // Tạo full URL với authorization token
    const imageUrl = `${B2_DOWNLOAD_URL}/${fileName}?Authorization=${authToken}`;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error fetching B2 image URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

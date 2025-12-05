import { NextResponse } from 'next/server';

// Backblaze B2 Configuration
// Lấy từ environment variables - KHÔNG hardcode credentials trong code!
const B2_KEY_ID = process.env.B2_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY;
const B2_BUCKET_ID = process.env.B2_BUCKET_ID || 'c02c3c8e5734dae39dad0814';
const B2_FILE_PREFIX = process.env.B2_FILE_PREFIX || 'test-uploads/';

// B2 Authorize Account Response
interface B2AuthorizeResponse {
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
  [key: string]: unknown;
}

// B2 Download Authorization Response
interface B2DownloadAuthResponse {
  authorizationToken: string;
  [key: string]: unknown;
}

// Cache authorization token từ b2_authorize_account (valid 24 hours)
let cachedAuthToken: string | null = null;
let cachedApiUrl: string | null = null;
let cachedDownloadUrl: string | null = null;
let authTokenExpiry: number = 0;

// Cache download authorization token (valid 1 hour)
let cachedDownloadToken: string | null = null;
let downloadTokenExpiry: number = 0;

/**
 * Authorize với Backblaze B2 account và lấy authorization token
 * Token này valid trong 24 giờ
 */
async function authorizeB2Account(): Promise<{
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
}> {
  const now = Date.now();

  // Kiểm tra cache (token valid 24 giờ, cache 23 giờ để an toàn)
  if (
    cachedAuthToken &&
    cachedApiUrl &&
    cachedDownloadUrl &&
    authTokenExpiry > now
  ) {
    return {
      authorizationToken: cachedAuthToken,
      apiUrl: cachedApiUrl,
      downloadUrl: cachedDownloadUrl,
    };
  }

  // Basic Auth với keyID:applicationKey
  const credentials = Buffer.from(
    `${B2_KEY_ID}:${B2_APPLICATION_KEY}`
  ).toString('base64');

  const response = await fetch(
    'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Failed to authorize B2 account';
    try {
      const errorData = JSON.parse(errorText) as {
        code?: string;
        message?: string;
      };
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.code) {
        errorMessage = `B2 authorization error: ${errorData.code}`;
      }
    } catch {
      if (errorText) {
        errorMessage = errorText;
      }
    }
    throw new Error(errorMessage);
  }

  const data = (await response.json()) as B2AuthorizeResponse;

  // Cache authorization token (expire sau 23 giờ)
  cachedAuthToken = data.authorizationToken;
  cachedApiUrl = data.apiUrl;
  cachedDownloadUrl = data.downloadUrl;
  authTokenExpiry = now + 23 * 60 * 60 * 1000; // 23 hours

  return {
    authorizationToken: data.authorizationToken,
    apiUrl: data.apiUrl,
    downloadUrl: data.downloadUrl,
  };
}

/**
 * GET /api/b2/token
 * Lấy download authorization token với prefix test-uploads/
 * Token được cache trong memory để tránh call API nhiều lần
 */
export async function GET() {
  if (!B2_KEY_ID || !B2_APPLICATION_KEY) {
    return NextResponse.json(
      {
        error:
          'B2_KEY_ID and B2_APPLICATION_KEY are required. Please configure them in environment variables.',
      },
      { status: 500 }
    );
  }

  const now = Date.now();

  // Kiểm tra cache download token (còn hiệu lực trong 50 phút, token valid 1 giờ)
  if (cachedDownloadToken && downloadTokenExpiry > now) {
    return NextResponse.json({ token: cachedDownloadToken });
  }

  try {
    // Bước 1: Authorize account và lấy authorization token
    const { authorizationToken, apiUrl } = await authorizeB2Account();

    // Bước 2: Lấy download authorization token với prefix
    const downloadAuthUrl = `${apiUrl}/b2api/v2/b2_get_download_authorization`;
    const response = await fetch(downloadAuthUrl, {
      method: 'POST',
      headers: {
        Authorization: authorizationToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId: B2_BUCKET_ID,
        fileNamePrefix: B2_FILE_PREFIX,
        validDurationInSeconds: 3600, // 1 hour
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to get B2 authorization';
      const errorText = await response.text();
      
      // Thử parse JSON từ error response
      try {
        const errorData = JSON.parse(errorText) as {
          code?: string;
          message?: string;
          status?: number;
        };
        // Backblaze B2 API trả về error với format { code, message, status }
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.code) {
          errorMessage = `B2 API error: ${errorData.code}`;
        }
        console.error('B2 API error:', errorData);
      } catch {
        // Nếu không parse được JSON, dùng text trực tiếp
        console.error('B2 API error (text):', errorText);
        if (errorText) {
          errorMessage = errorText;
        }
      }

      // Trả về status code từ B2 API (401, 403, etc.)
      return NextResponse.json(
        {
          error: errorMessage,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as B2DownloadAuthResponse;
    const downloadToken = data.authorizationToken;

    // Cache download token (expire sau 50 phút để đảm bảo an toàn)
    cachedDownloadToken = downloadToken;
    downloadTokenExpiry = now + 50 * 60 * 1000; // 50 minutes

    return NextResponse.json({ token: downloadToken });
  } catch (error) {
    console.error('Error fetching B2 token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function onRequest(context) {
  const url = new URL(context.request.url);
  const cookieHeader = context.request.headers.get('Cookie');
  const isAuthenticated = cookieHeader && cookieHeader.includes('guest_auth=1');

  // If already logged in, don't show the lock screen again; skip straight to home
  if (url.pathname === '/' && isAuthenticated) {
    return new Response('', { status: 302, headers: { 'Location': '/home' } });
  }

  // Allow unrestricted access to the lock screen, the login processor, and the page styles/images
  if (url.pathname === '/' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/assets/') || url.pathname.startsWith('/_astro/')) {
    return await context.next();
  }

  // If a guest tries to access /rsvp or /home without the secure cookie, block them
  if (!isAuthenticated) {
    return new Response('', { status: 302, headers: { 'Location': '/' } });
  }

  return await context.next();
}
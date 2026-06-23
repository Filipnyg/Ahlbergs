export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const password = formData.get('password');

  // Checks the submitted password against your hidden Cloudflare variable
  if (password === env.SITE_PASSWORD) {
    return new Response('', {
      status: 302,
      headers: {
        'Location': '/home',
        'Set-Cookie': `guest_auth=1; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000` // Keeps them logged in for 30 days
      }
    });
  } else {
    // If wrong, sends them back to the splash screen with an error flag
    return new Response('', {
      status: 302,
      headers: { 'Location': '/?error=1' }
    });
  }
}
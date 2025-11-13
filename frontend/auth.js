(function(){
  async function initClerk() {
    try {
      const res = await fetch('/config/public');
      const cfg = await res.json();
      const pk = cfg?.clerkPublishableKey;
      if (!pk) return null; // Clerk not configured
      // Wait for Clerk script to load
      let tries = 0;
      while (!window.Clerk && tries < 50) {
        await new Promise(r => setTimeout(r, 100));
        tries++;
      }
      if (!window.Clerk) return null;
      await window.Clerk.load({ publishableKey: pk });
      return window.Clerk;
    } catch {
      return null;
    }
  }

  async function setupAuthNav(Clerk) {
    const elSignIn = document.getElementById('nav-signin');
    const elSignUp = document.getElementById('nav-signup');
    const elUser = document.getElementById('nav-user');
    const elSignOut = document.getElementById('nav-signout');
    const signOutLink = document.getElementById('sign-out-link');
    if (!elSignIn && !elSignUp && !elUser && !elSignOut) return; // no nav on this page

    const isSignedIn = Clerk && (Clerk.isSignedIn || Clerk.user || Clerk.session);
    if (isSignedIn) {
      if (elSignIn) elSignIn.classList.add('d-none');
      if (elSignUp) elSignUp.classList.add('d-none');
      if (elUser) elUser.classList.remove('d-none');
      if (elSignOut) elSignOut.classList.remove('d-none');
      if (elUser && Clerk.mountUserButton) {
        // Clear and mount the user button UI
        elUser.innerHTML = '';
        Clerk.mountUserButton(elUser, { appearance: { elements: { userButtonAvatarBox: { marginRight: '0' } } } });
      }
      if (signOutLink) {
        signOutLink.onclick = async (e) => {
          e.preventDefault();
          try { await Clerk.signOut({ redirectUrl: '/' }); } catch {}
          window.location.href = '/';
        };
      }
    } else {
      if (elSignIn) elSignIn.classList.remove('d-none');
      if (elSignUp) elSignUp.classList.remove('d-none');
      if (elUser) elUser.classList.add('d-none');
      if (elSignOut) elSignOut.classList.add('d-none');
    }
  }

  async function init() {
    const Clerk = await initClerk();
    await setupAuthNav(Clerk);
    // Mount sign-in / sign-up forms if present
    try {
      const url = new URL(window.location.href);
      const redirectUrl = url.searchParams.get('redirect_url') || '/';
      const btnGoogle = document.getElementById('btn-google');
      if (btnGoogle && Clerk) {
        btnGoogle.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            // Trigger Google OAuth directly
            await Clerk.signIn.authenticateWithRedirect({
              strategy: 'oauth_google',
              redirectUrl: window.location.pathname,
              redirectUrlComplete: redirectUrl,
            });
          } catch (err) {
            console.error('Google OAuth start failed:', err);
          }
        });
      }
      const btnGoogleUp = document.getElementById('btn-google-up');
      if (btnGoogleUp && Clerk) {
        btnGoogleUp.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            if (Clerk.signUp && Clerk.signUp.authenticateWithRedirect) {
              await Clerk.signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: window.location.pathname,
                redirectUrlComplete: redirectUrl,
              });
            } else {
              await Clerk.signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: window.location.pathname,
                redirectUrlComplete: redirectUrl,
              });
            }
          } catch (err) {
            console.error('Google OAuth start failed:', err);
          }
        });
      }
      const signInEl = document.getElementById('sign-in');
      if (signInEl && Clerk && Clerk.mountSignIn) Clerk.mountSignIn(signInEl, { redirectUrl });
      const signUpEl = document.getElementById('sign-up');
      if (signUpEl && Clerk && Clerk.mountSignUp) Clerk.mountSignUp(signUpEl, { redirectUrl });
    } catch {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

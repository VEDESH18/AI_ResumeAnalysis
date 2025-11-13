(function(){
  async function initClerkAndMount() {
    try {
      const res = await fetch('/config/public');
      const cfg = await res.json();
      if (!cfg.clerkPublishableKey) {
        console.warn('Clerk publishable key not configured.');
        return;
      }
      // Wait for Clerk script to be available
      if (!window.Clerk) {
        await new Promise(r => setTimeout(r, 200));
      }
      await window.Clerk.load({ publishableKey: cfg.clerkPublishableKey });
      const url = new URL(window.location.href);
      const redirectUrl = url.searchParams.get('redirect_url') || '/';

      const signInEl = document.getElementById('sign-in');
      if (signInEl) {
        window.Clerk.mountSignIn(signInEl, { redirectUrl });
      }
      const signUpEl = document.getElementById('sign-up');
      if (signUpEl) {
        window.Clerk.mountSignUp(signUpEl, { redirectUrl });
      }
    } catch (e) {
      console.error('Failed to init Clerk:', e);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClerkAndMount);
  } else {
    initClerkAndMount();
  }
})();

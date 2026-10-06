/* Mailbus — simulated sign-up and sign-in.
   Everything here runs in the visitor's browser. Nothing is sent to a server
   and nothing is stored. Replace these handlers when the real service is live. */

(function () {
  'use strict';

  var DOMAIN = '@mailbus.xyz';
  // 3–30 characters: letters, numbers, dots, hyphens, underscores;
  // must start and end with a letter or number.
  var ADDRESS_PATTERN = /^[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$/;

  function cleanAddress(value) {
    var name = String(value || '').trim().toLowerCase();
    if (name.slice(-DOMAIN.length) === DOMAIN) {
      name = name.slice(0, -DOMAIN.length);
    }
    return name;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ----- "Get your address": always succeeds, then shows the coming-soon page ----- */

  var claimForm = document.querySelector('[data-claim-form]');

  if (claimForm) {
    var claimInput = claimForm.querySelector('input[name="address"]');
    var claimField = claimForm.querySelector('[data-claim-field]');
    var claimButton = claimForm.querySelector('[data-claim-button]');
    var claimError = document.getElementById('address-error');

    var showClaimError = function (message) {
      claimError.textContent = message;
      claimError.hidden = false;
      claimField.classList.add('is-invalid');
      claimInput.setAttribute('aria-invalid', 'true');
      claimInput.focus();
    };

    var clearClaimError = function () {
      claimError.hidden = true;
      claimError.textContent = '';
      claimField.classList.remove('is-invalid');
      claimInput.removeAttribute('aria-invalid');
    };

    claimInput.addEventListener('input', clearClaimError);

    claimForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = cleanAddress(claimInput.value);

      if (!name) {
        showClaimError('Type the name you want before @mailbus.xyz.');
        return;
      }
      if (!ADDRESS_PATTERN.test(name)) {
        showClaimError('Use 3 to 30 letters, numbers, dots, hyphens or underscores, starting and ending with a letter or number.');
        return;
      }

      clearClaimError();
      claimButton.disabled = true;
      claimButton.textContent = 'Getting your address…';

      window.setTimeout(function () {
        window.location.href = 'welcome.html?address=' + encodeURIComponent(name);
      }, 700);
    });

    // Restore the button if the visitor comes back with the browser's Back button.
    window.addEventListener('pageshow', function () {
      claimButton.disabled = false;
      claimButton.textContent = 'Get your address';
    });

    // Other "Get your address" buttons on the page lead to this form.
    document.querySelectorAll('[data-claim-link]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        claimForm.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'center'
        });
        claimInput.focus({ preventScroll: true });
      });
    });

    // Arriving from another page via index.html#claim.
    if (window.location.hash === '#claim') {
      claimInput.focus();
    }
  }

  /* ----- Coming-soon page: show the address that was chosen ----- */

  var soonAddress = document.querySelector('[data-soon-address]');

  if (soonAddress) {
    var chosen = cleanAddress(new URLSearchParams(window.location.search).get('address'));

    if (ADDRESS_PATTERN.test(chosen)) {
      soonAddress.textContent = chosen + DOMAIN;
      soonAddress.hidden = false;
      document.querySelector('[data-soon-title]').textContent = 'Good choice.';
      document.querySelector('[data-soon-text]').textContent =
        "Mailbus is coming soon. We're not open for sign-ups just yet, so check back shortly to make this address yours.";
    }
  }

  /* ----- Sign in: always fails as "not recognised", whatever is entered ----- */

  var signinForm = document.querySelector('[data-signin-form]');

  if (signinForm) {
    var signinButton = signinForm.querySelector('[data-signin-button]');
    var signinError = signinForm.querySelector('[data-signin-error]');
    var signinPassword = document.getElementById('signin-password');

    signinForm.addEventListener('submit', function (event) {
      event.preventDefault();
      signinError.hidden = true;
      signinButton.disabled = true;
      signinButton.textContent = 'Signing in…';

      window.setTimeout(function () {
        signinPassword.value = '';
        signinError.hidden = false;
        signinButton.disabled = false;
        signinButton.textContent = 'Sign in';
        signinPassword.focus();
      }, 900);
    });
  }
})();

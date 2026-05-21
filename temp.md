Now to test without sending emails, just add &test=true to the URL:

  contact.html?package=Drop-In+Session&price=40&test=true

  Fill the form → submit → skips email → goes straight to Stripe. No emails sent to
  anyone.

  When you go live, just remove &test=true and the real flow kicks in.
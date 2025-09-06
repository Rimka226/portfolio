/* Active nav link + mobile toggle */
const current = document.body.getAttribute('data-page');
document.querySelectorAll('.nav a').forEach(a => {
  if (a.dataset.nav === current) a.classList.add('active');
});

const btn = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (btn) {
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
}

/* Contact form validation */
const form = document.getElementById('contact-form');
if (form) {
  const fields = {
    prenom: { el: document.getElementById('prenom'), rules: ['required'] },
    nom: { el: document.getElementById('nom'), rules: ['required'] },
    email: { el: document.getElementById('email'), rules: ['required', 'email'] },
    sujet: { el: document.getElementById('sujet'), rules: ['required'] },
    message: { el: document.getElementById('message'), rules: ['required', { name: 'min', arg: 10 }] },
  };

  const showError = (el, msg) => {
    const small = el.parentElement.querySelector('.error');
    if (small) small.textContent = msg || '';
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  const validators = {
    required: (v) => v.trim().length > 0 || 'Ce champ est requis.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Email invalide.",
    min: (v, n) => v.trim().length >= n || `Minimum ${n} caractères.`,
  };

  const validateField = ({ el, rules }) => {
    for (const r of rules) {
      let name = typeof r === 'string' ? r : r.name;
      let arg = typeof r === 'object' ? r.arg : undefined;
      const res = validators[name](el.value, arg);
      if (res !== true) { showError(el, res); return false; }
    }
    showError(el, '');
    return true;
  };

  Object.values(fields).forEach(({ el }) => {
    el.addEventListener('input', () => validateField({ el, rules: fields[el.id].rules }));
    el.addEventListener('blur', () => validateField({ el, rules: fields[el.id].rules }));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = Object.values(fields).every(f => validateField(f));
    const success = document.getElementById('form-success');
    if (allValid) {
      success.textContent = "Merci ! Votre message a été validé (simulation).";
      form.reset();
      Object.values(fields).forEach(({ el }) => showError(el, ''));
    } else {
      success.textContent = "";
    }
  });
}

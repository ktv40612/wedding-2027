const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdxcaIF5SfiSmlkfq1H2kf6kvX-NeqHagYCuCxwRb1-MUyQzA/formResponse';

const ENTRY = {
  name: 'entry.1001058131',
  phone: 'entry.1245617761',
  email: 'entry.1645811181',
  lunchCount: 'entry.1224930740',
  kidsChair: 'entry.1414383604',
  veggieCount: 'entry.1620384439',
  specialDiet: 'entry.62874672',
  ceremonyCount: 'entry.1910510627',
  inviteMethod: 'entry.843419276',
  address: 'entry.1229085839',
  inviteEmail: 'entry.342019937',
};

const ceremonyRadios = document.querySelectorAll('input[name="ceremonyAttend"]');
const ceremonyCountWrap = document.getElementById('ceremonyCountWrap');
const ceremonyCountInput = document.getElementById('f-ceremony-count');

ceremonyRadios.forEach(r => r.addEventListener('change', () => {
  const yes = document.querySelector('input[name="ceremonyAttend"]:checked')?.value === 'yes';
  ceremonyCountWrap.style.display = yes ? 'block' : 'none';
  ceremonyCountInput.required = yes;
  if (!yes) ceremonyCountInput.value = '';
}));

const paperCheck = document.getElementById('f-invite-paper');
const eCheck = document.getElementById('f-invite-e');
const paperAddrWrap = document.getElementById('paperAddrWrap');
const eInviteEmailWrap = document.getElementById('eInviteEmailWrap');

paperCheck.addEventListener('change', () => {
  paperAddrWrap.style.display = paperCheck.checked ? 'block' : 'none';
});
eCheck.addEventListener('change', () => {
  eInviteEmailWrap.style.display = eCheck.checked ? 'block' : 'none';
});

const form = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');
const formError = document.getElementById('formError');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.style.display = 'none';

  if (!paperCheck.checked && !eCheck.checked) {
    formError.textContent = '請至少選擇一種喜帖寄送方式。';
    formError.style.display = 'block';
    return;
  }
  if (!form.reportValidity()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = '送 出 中...';

  const ceremonyYes = document.querySelector('input[name="ceremonyAttend"]:checked')?.value === 'yes';

  const data = new FormData();
  data.append(ENTRY.name, form.name.value.trim());
  data.append(ENTRY.phone, form.phone.value.trim());
  data.append(ENTRY.email, form.email.value.trim());
  data.append(ENTRY.lunchCount, form.lunchCount.value);
  data.append(ENTRY.kidsChair, form.kidsChair.value);
  data.append(ENTRY.veggieCount, form.veggieCount.value);
  data.append(ENTRY.specialDiet, form.specialDiet.value.trim());
  data.append(ENTRY.ceremonyCount, ceremonyYes ? ceremonyCountInput.value : '都不會參加【證婚儀式】，午宴見！');
  if (paperCheck.checked) data.append(ENTRY.inviteMethod, '請寄給我紙本喜帖');
  if (eCheck.checked) data.append(ENTRY.inviteMethod, '請寄給我電子喜帖');
  data.append(ENTRY.address, form.address.value.trim());
  data.append(ENTRY.inviteEmail, form.inviteEmail.value.trim());

  try {
    await fetch(GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: data });
    form.style.display = 'none';
    document.getElementById('rsvpSuccess').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    formError.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = '送 出 回 覆';
  }
});

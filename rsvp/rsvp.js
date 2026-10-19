const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdxcaIF5SfiSmlkfq1H2kf6kvX-NeqHagYCuCxwRb1-MUyQzA/formResponse';

const ENTRY = {
  name: 'entry.1001058131',
  phone: 'entry.1245617761',
  email: 'entry.1645811181',
  lunchCount: 'entry.1224930740',
  kidsChair: 'entry.1414383604',
  veggieCount: 'entry.1128587045',
  specialDiet: 'entry.62874672',
  ceremonyCount: 'entry.1910510627',
  address: 'entry.342019937',
};

const CEREMONY_NO = '都不會參加【證婚儀式】，午宴見！';

// Google 表單這幾題是單選＋「其他」；選項以外的數字必須用「其他」格式送出才會被收下
const CHOICES = {
  lunchCount: ['1', '2', '3', '4'],
  kidsChair: ['0', '1', '2', '3', '4'],
  veggieCount: ['0', '1', '2', '3', '4'],
  ceremonyCount: [CEREMONY_NO, '1', '2', '3', '4', '5'],
};

function appendChoice(data, key, value) {
  if (CHOICES[key].includes(value)) {
    data.append(ENTRY[key], value);
  } else {
    data.append(ENTRY[key], '__other_option__');
    data.append(ENTRY[key] + '.other_option_response', value);
  }
}

const ceremonyRadios = document.querySelectorAll('input[name="ceremonyAttend"]');
const ceremonyCountWrap = document.getElementById('ceremonyCountWrap');
const ceremonyCountInput = document.getElementById('f-ceremony-count');

ceremonyRadios.forEach(r => r.addEventListener('change', () => {
  const yes = document.querySelector('input[name="ceremonyAttend"]:checked')?.value === 'yes';
  ceremonyCountWrap.style.display = yes ? 'block' : 'none';
  ceremonyCountInput.required = yes;
  if (!yes) ceremonyCountInput.value = '';
}));

const form = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');
const formError = document.getElementById('formError');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.style.display = 'none';

  if (!form.reportValidity()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = '送 出 中...';

  const ceremonyYes = document.querySelector('input[name="ceremonyAttend"]:checked')?.value === 'yes';

  const data = new FormData();
  data.append(ENTRY.name, form.name.value.trim());
  data.append(ENTRY.phone, form.phone.value.trim());
  data.append(ENTRY.email, form.email.value.trim());
  appendChoice(data, 'lunchCount', String(form.lunchCount.value).trim());
  appendChoice(data, 'kidsChair', String(form.kidsChair.value).trim());
  appendChoice(data, 'veggieCount', String(form.veggieCount.value).trim());
  data.append(ENTRY.specialDiet, form.specialDiet.value.trim());
  appendChoice(data, 'ceremonyCount', ceremonyYes ? String(ceremonyCountInput.value).trim() : CEREMONY_NO);
  data.append(ENTRY.address, form.address.value.trim());

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

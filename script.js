const characters = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+[]{}|;:,.<>?/-='
};

const ui = {
  passwordOutput: document.getElementById('passwordOutput'),
  copyBtn: document.getElementById('copyBtn'),
  generateBtn: document.getElementById('generateBtn'),
  lengthSlider: document.getElementById('lengthSlider'),
  lengthValue: document.getElementById('lengthValue'),
  errorMsg: document.getElementById('errorMsg'),
  copiedToast: document.getElementById('copiedToast'),
  uppercase: document.getElementById('uppercase'),
  lowercase: document.getElementById('lowercase'),
  numbers: document.getElementById('numbers'),
  symbols: document.getElementById('symbols')
};

function getSelectedPools() {
  const pools = [];
  if (ui.uppercase.checked) pools.push(characters.uppercase);
  if (ui.lowercase.checked) pools.push(characters.lowercase);
  if (ui.numbers.checked) pools.push(characters.numbers);
  if (ui.symbols.checked) pools.push(characters.symbols);
  return pools;
}

function getRandomCharacter(pool) {
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function shuffleString(value) {
  const items = value.split('');

  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items.join('');
}

function clearError() {
  ui.errorMsg.textContent = '';
}

function showError(message) {
  ui.errorMsg.textContent = message;
}

function buildPassword(length, pools) {
  let output = '';

  pools.forEach((pool) => {
    output += getRandomCharacter(pool);
  });

  const allChars = pools.join('');

  while (output.length < length) {
    output += getRandomCharacter(allChars);
  }

  return shuffleString(output).slice(0, length);
}

function generatePassword() {
  const pools = getSelectedPools();
  const length = Number(ui.lengthSlider.value);

  if (!pools.length) {
    ui.passwordOutput.value = '';
    showError('Please select at least one character type.');
    return;
  }

  clearError();
  ui.passwordOutput.value = buildPassword(length, pools);
}

function showCopiedNotification() {
  ui.copiedToast.classList.add('show');
  setTimeout(() => {
    ui.copiedToast.classList.remove('show');
  }, 1200);
}

async function copyPassword() {
  if (!ui.passwordOutput.value) {
    showError('Generate a password before copying.');
    return;
  }

  try {
    await navigator.clipboard.writeText(ui.passwordOutput.value);
    clearError();
    showCopiedNotification();
  } catch {
    showError('Clipboard copy failed. Please copy manually.');
  }
}

function updateLengthLabel() {
  ui.lengthValue.textContent = ui.lengthSlider.value;
}

function bindEvents() {
  ui.lengthSlider.addEventListener('input', updateLengthLabel);
  ui.generateBtn.addEventListener('click', generatePassword);
  ui.copyBtn.addEventListener('click', copyPassword);
}

function init() {
  bindEvents();
  updateLengthLabel();
  generatePassword();
}

init();

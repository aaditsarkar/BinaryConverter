let currentMode = 'text';

// Initialize mode listeners
document.addEventListener('DOMContentLoaded', () => {
  const modeInputs = document.querySelectorAll('input[name="conversion-mode"]');
  modeInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      currentMode = e.target.value;
      updateUI();
    });
  });
  
  updateUI();
});

function updateUI() {
  const inputIcon = document.getElementById('input-icon');
  const inputTitle = document.getElementById('input-title');
  const inputField = document.getElementById('inputField');
  const inputHint = document.getElementById('input-hint');
  const outputType = document.getElementById('output-type');

  switch(currentMode) {
    case 'text':
      inputIcon.textContent = '📝';
      inputTitle.textContent = 'Text to Binary';
      inputField.placeholder = 'Enter your text here...';
      inputHint.textContent = 'Enter any text to convert to binary';
      outputType.textContent = 'Text';
      break;
    case 'alphanumeric':
      inputIcon.textContent = '🔤';
      inputTitle.textContent = 'Alphanumeric to Binary';
      inputField.placeholder = 'Enter alphanumeric text (letters and numbers)...';
      inputHint.textContent = 'Enter letters and numbers only (A-Z, a-z, 0-9)';
      outputType.textContent = 'Alphanumeric';
      break;
    case 'hex':
      inputIcon.textContent = '🔢';
      inputTitle.textContent = 'Hex to Binary';
      inputField.placeholder = 'Enter hex values (e.g., 48656C6C6F)...';
      inputHint.textContent = 'Enter hexadecimal values (0-9, A-F)';
      outputType.textContent = 'Hex';
      break;
  }

  // Clear outputs when mode changes
  document.getElementById('binaryOutput').innerHTML = '<button class="copy-btn" onclick="copyToClipboard(\'binaryOutput\')">Copy</button>';
  document.getElementById('convertedOutput').innerHTML = '<button class="copy-btn" onclick="copyToClipboard(\'convertedOutput\')">Copy</button>';
}

function convertToBinary() {
  const input = document.getElementById("inputField").value;
  const output = document.getElementById("binaryOutput");
  
  if (!input.trim()) {
    output.innerHTML = '<button class="copy-btn" onclick="copyToClipboard(\'binaryOutput\')">Copy</button>';
    output.className = 'output';
    return;
  }

  let binary = "";
  
  try {
    switch(currentMode) {
      case 'text':
        binary = textToBinary(input);
        break;
      case 'alphanumeric':
        if (!/^[A-Za-z0-9\s]*$/.test(input)) {
          throw new Error("Input contains non-alphanumeric characters!");
        }
        binary = textToBinary(input);
        break;
      case 'hex':
        binary = hexToBinary(input);
        break;
    }
    
    output.innerHTML = binary + '<button class="copy-btn" onclick="copyToClipboard(\'binaryOutput\')">Copy</button>';
    output.className = 'output success';
  } catch (e) {
    output.innerHTML = "⚠️ " + e.message + '<button class="copy-btn" onclick="copyToClipboard(\'binaryOutput\')">Copy</button>';
    output.className = 'output error';
  }
  
  // Add animation
  output.style.transform = 'scale(1.02)';
  setTimeout(() => output.style.transform = 'scale(1)', 200);
}

function convertFromBinary() {
  const binaryInput = document.getElementById("binaryInput").value.trim();
  const output = document.getElementById("convertedOutput");
  
  if (!binaryInput) {
    output.innerHTML = '<button class="copy-btn" onclick="copyToClipboard(\'convertedOutput\')">Copy</button>';
    output.className = 'output';
    return;
  }

  try {
    let result = "";
    
    switch(currentMode) {
      case 'text':
      case 'alphanumeric':
        result = binaryToText(binaryInput);
        if (currentMode === 'alphanumeric' && !/^[A-Za-z0-9\s]*$/.test(result)) {
          throw new Error("Binary converts to non-alphanumeric text!");
        }
        break;
      case 'hex':
        result = binaryToHex(binaryInput);
        break;
    }
    
    output.innerHTML = result + '<button class="copy-btn" onclick="copyToClipboard(\'convertedOutput\')">Copy</button>';
    output.className = 'output success';
  } catch (e) {
    output.innerHTML = "⚠️ " + e.message + '<button class="copy-btn" onclick="copyToClipboard(\'convertedOutput\')">Copy</button>';
    output.className = 'output error';
  }
  
  // Add animation
  output.style.transform = 'scale(1.02)';
  setTimeout(() => output.style.transform = 'scale(1)', 200);
}

function textToBinary(text) {
  let binary = "";
  for (let i = 0; i < text.length; i++) {
    binary += text.charCodeAt(i).toString(2).padStart(8, '0') + " ";
  }
  return binary.trim();
}

function binaryToText(binaryInput) {
  const binaryArray = binaryInput.split(/\s+/);
  let text = "";
  
  for (let bin of binaryArray) {
    if (!/^[01]+$/.test(bin)) {
      throw new Error("Invalid binary format! Use only 0s and 1s.");
    }
    if (bin.length > 16) {
      throw new Error("Binary sequence too long!");
    }
    text += String.fromCharCode(parseInt(bin, 2));
  }
  return text;
}

function hexToBinary(hex) {
  // Remove spaces and validate hex
  const cleanHex = hex.replace(/\s+/g, '');
  if (!/^[0-9A-Fa-f]*$/.test(cleanHex)) {
    throw new Error("Invalid hex format! Use only 0-9 and A-F.");
  }
  if (cleanHex.length === 0) {
    throw new Error("Please enter hex values!");
  }
  
  let binary = "";
  for (let i = 0; i < cleanHex.length; i++) {
    const hexDigit = cleanHex[i];
    const binDigit = parseInt(hexDigit, 16).toString(2).padStart(4, '0');
    binary += binDigit + " ";
  }
  return binary.trim();
}

function binaryToHex(binaryInput) {
  const binaryArray = binaryInput.split(/\s+/);
  let hex = "";
  
  for (let bin of binaryArray) {
    if (!/^[01]+$/.test(bin)) {
      throw new Error("Invalid binary format! Use only 0s and 1s.");
    }
    if (bin.length > 16) {
      throw new Error("Binary sequence too long!");
    }
    
    // Pad to multiple of 4 for proper hex conversion
    const paddedBin = bin.padStart(Math.ceil(bin.length / 4) * 4, '0');
    
    // Convert each 4-bit group to hex
    for (let i = 0; i < paddedBin.length; i += 4) {
      const fourBits = paddedBin.substr(i, 4);
      hex += parseInt(fourBits, 2).toString(16).toUpperCase();
    }
  }
  return hex;
}

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.innerText.replace('Copy', '').trim();
  
  if (!text || text.includes('Output will appear here') || text.includes('⚠️')) {
    return;
  }
  
  navigator.clipboard.writeText(text).then(() => {
    const btn = element.querySelector('.copy-btn');
    const originalText = btn.innerText;
    btn.innerText = '✓ Copied!';
    btn.style.background = 'var(--success-color)';
    
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  
  if (document.body.classList.contains('dark')) {
    icon.textContent = '☀️';
    text.textContent = 'Light Mode';
    localStorage.setItem('darkMode', 'true');
  } else {
    icon.textContent = '🌙';
    text.textContent = 'Dark Mode';
    localStorage.setItem('darkMode', 'false');
  }
}

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'true') {
    document.body.classList.add('dark');
    document.getElementById('theme-icon').textContent = '☀️';
    document.getElementById('theme-text').textContent = 'Light Mode';
  }
  
  // Add entrance animations
  const container = document.querySelector('.converter-container');
  container.style.opacity = '0';
  container.style.transform = 'translateY(30px)';
  setTimeout(() => {
    container.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 100);
});

// Add interactive effects
document.querySelectorAll('input, textarea').forEach(element => {
  element.addEventListener('input', (e) => {
    if (e.target.value.length > 0) {
      e.target.style.borderColor = '#667eea';
    } else {
      e.target.style.borderColor = '';
    }
  });
});
/**
 * Toyota Techstream Licensing Request System - Main Script
 * Handles form validation, Telegram integration, Mega links, and UI notifications.
 */

// Configuration Constants
const CONFIG = {
  TELEGRAM_BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE', // Replace with your Telegram Bot Token if using Bot API
  TELEGRAM_CHAT_ID: '@sunmengheang',         // Telegram Channel/Chat ID for Bot API
  ADMIN_TELEGRAM_USER: 'sunmengheang',       // Direct Telegram Username
  PHONE_NUMBER: '069 778 837'
};

// DOM Helper
const $ = (id) => document.getElementById(id);

/**
 * Toast Notification Utility
 * @param {string} message - Message to display
 * @param {boolean} isError - True if error notification
 */
function showStatus(message, isError = false) {
  const statusEl = $('status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.style.color = isError ? '#EF4444' : '#10B981';
  statusEl.style.opacity = '1';

  // Smooth fade-out effect after 3.5 seconds
  clearTimeout(statusEl.fadeTimeout);
  statusEl.fadeTimeout = setTimeout(() => {
    statusEl.style.opacity = '0';
    setTimeout(() => {
      if (statusEl.style.opacity === '0') {
        statusEl.textContent = '';
      }
    }, 300);
  }, 3500);
}

/**
 * Formats request details into a Telegram message
 */
function buildMessageText(sid, days, version, megaUrl) {
  let msg = `🔔 *Toyota Techstream Request*\n\n` +
            `🛠 *Version:* ${version}\n` +
            `🆔 *Software ID:* \`${sid}\`\n` +
            `📅 *Period:* ${days} days\n` +
            `📞 *Contact:* ${CONFIG.PHONE_NUMBER}`;

  if (megaUrl) {
    msg += `\n🔗 *Mega File:* ${megaUrl}`;
  }
  return msg;
}

/**
 * Validates Form Inputs
 */
function validateInputs(sid, period) {
  if (!sid) {
    showStatus('សូមបញ្ចូល Software ID! (Please enter Software ID)', true);
    if ($('sid')) $('sid').focus();
    return false;
  }
  if (!period || Number(period) <= 0) {
    showStatus('សូមបញ្ចូលចំនួនថ្ងៃត្រឹមត្រូវ! (Please enter a valid period)', true);
    if ($('period')) $('period').focus();
    return false;
  }
  return true;
}

/**
 * Opens Mega Link in new tab
 */
function handleOpenMega() {
  const megaUrlInput = $('megaUrl');
  const megaUrl = megaUrlInput ? megaUrlInput.value.trim() : '';

  if (!megaUrl) {
    showStatus('សូមបញ្ចូល Mega Link! (Please enter a Mega Link)', true);
    return;
  }

  window.open(megaUrl, '_blank', 'noopener,noreferrer');
  showStatus('បានបើក Mega Link រួចរាល់! 📁');
}

/**
 * Copies formatted request info to Clipboard
 */
function handleCopyInfo() {
  const sid = $('sid') ? $('sid').value.trim() : '';
  const days = $('period') ? $('period').value : '';
  const version = $('version') ? $('version').value : '';
  const megaUrl = $('megaUrl') ? $('megaUrl').value.trim() : '';

  if (!validateInputs(sid, days)) return;

  let textToCopy = `Toyota Techstream Request\nVersion: ${version}\nSoftware ID: ${sid}\nPeriod: ${days} days\nPhone: ${CONFIG.PHONE_NUMBER}`;
  if (megaUrl) {
    textToCopy += `\nMega Link: ${megaUrl}`;
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showStatus('បានចម្លងទិន្នន័យ (Copy) ដោយជោគជ័យ! 📋');
    }).catch(() => {
      fallbackCopyText(textToCopy);
    });
  } else {
    fallbackCopyText(textToCopy);
  }
}

/**
 * Fallback clipboard function using execCommand
 */
function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showStatus('បានចម្លងទិន្នន័យ (Copy) ដោយជោគជ័យ! 📋');
  } catch (err) {
    showStatus('បរាជ័យក្នុងការចម្លងទិន្នន័យ (Copy Failed)', true);
  }

  document.body.removeChild(textArea);
}

/**
 * Handles Form Submission to Telegram
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const sid = $('sid') ? $('sid').value.trim() : '';
  const days = $('period') ? $('period').value : '';
  const version = $('version') ? $('version').value : '';
  const megaUrl = $('megaUrl') ? $('megaUrl').value.trim() : '';

  if (!validateInputs(sid, days)) return;

  const messageText = buildMessageText(sid, days, version, megaUrl);
  showStatus('កំពុងផ្ញើ និងបើក Telegram...');

  // Bot API Send (Optional)
  if (CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE') {
    try {
      await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CONFIG.TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.warn('Telegram Bot send skipped or failed:', err);
    }
  }

  // Open Telegram Direct Chat
  const cleanMessage = messageText.replace(/\*/g, '').replace(/`/g, '');
  const encodedMessage = encodeURIComponent(cleanMessage);
  const telegramUrl = `https://t.me/${CONFIG.ADMIN_TELEGRAM_USER}?text=${encodedMessage}`;

  window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  showStatus('បានបើក Telegram រួចរាល់! ✅');
}

/**
 * Initialize Event Listeners
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = $('form');
  const openMegaBtn = $('openMegaBtn');
  const copyBtn = $('copyBtn');

  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  if (openMegaBtn) {
    openMegaBtn.addEventListener('click', handleOpenMega);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', handleCopyInfo);
  }
});
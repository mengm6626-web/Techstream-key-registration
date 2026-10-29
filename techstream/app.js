const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
  const TELEGRAM_CHAT_ID = '@sunmengheang';
  const ADMIN_TELEGRAM_USER = 'sunmengheang';

  const $ = id => document.getElementById(id);

  function buildMessageText(sid, days, version) {
    return `🔔 **Toyota Techstream Request**\n\n` +
           `🛠 **Version:** ${version}\n` +
           `🆔 **Software ID:** \`${sid}\`\n` +
           `📅 **Period:** ${days} days\n` +
           `📞 **Contact:** 069778837`;
  }

  // 1. Submit Form & Send via Telegram API + Open Direct Telegram Chat
  $('form').addEventListener('submit', async e => {
    e.preventDefault();
    
    let sid = $('sid').value.trim();
    let days = $('period').value;
    let version = $('version').value;

    let messageText = buildMessageText(sid, days, version);

    $('status').textContent = 'កំពុងផ្ញើ និងបើក Telegram...';

    // ផ្ញើតាម Bot API (ប្រសិនបើមានរៀបចំ Token)
    if(TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE') {
      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: messageText,
            parse_mode: 'Markdown'
          })
        });
      } catch (err) {
        console.log("Bot send skipped or failed:", err);
      }
    }

    // បើក Telegram Direct Chat ទៅកាន់ @sunmengheang ជាមួយសារដែលរៀបចំរួច
    let encodedMessage = encodeURIComponent(messageText.replace(/\*/g, '').replace(/`/g, ''));
    let telegramUrl = `https://t.me/${ADMIN_TELEGRAM_USER}?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');
    $('status').textContent = 'បានបើក Telegram រួចរាល់! ✅';
  });

  // 2. Copy Info Button
  $('copyBtn').addEventListener('click', () => {
    let sid = $('sid').value.trim();
    let days = $('period').value;
    let version = $('version').value;

    if (!sid) {
      alert('សូមបញ្ចូល Software ID ជាមុនសិន!');
      return;
    }

    let textToCopy = `Toyota Techstream Request\nVersion: ${version}\nSoftware ID: ${sid}\nPeriod: ${days} days\nPhone: 069778837`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      $('status').textContent = 'បានចម្លងទិន្នន័យ (Copy) ដោយជោគជ័យ! 📋';
      setTimeout(() => { $('status').textContent = ''; }, 3000);
    });
  });
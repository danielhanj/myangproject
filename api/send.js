const webpush = require('web-push');

module.exports = async (req, res) => {
  if (process.env.CRON_SECRET) {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      res.status(401).end('Unauthorized');
      return;
    }
  }

  if (!process.env.PUSH_SUBSCRIPTION) {
    res.status(500).json({ ok: false, error: 'PUSH_SUBSCRIPTION env var not set yet' });
    return;
  }

  const subscription = JSON.parse(process.env.PUSH_SUBSCRIPTION);

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const payload = JSON.stringify({
    title: '먕먕이',
    body: '일어났어? 오늘도 화이팅!',
    icon: '/icon-kakao.png',
  });

  try {
    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

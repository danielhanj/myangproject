const webpush = require('web-push');

const MESSAGES = [
  '일어났어? 오늘도 화이팅!',
  '굿모닝~ 오늘 하루도 잘 보내!',
  '일어나 일어나! 해 떴다!',
  '오늘도 좋은 일만 가득하길 바라!',
  '잘 잤어? 이불 밖은 위험해도 나가자!',
  '좋은 아침! 커피 한 잔 하고 시작해~',
  '오늘 하루도 네가 최고야!',
  '일어날 시간이야~ 눈 떠!',
  '굿모닝! 오늘도 힘내자!',
  '밥 챙겨 먹고 하루 시작해!',
];

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

  const body = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  const payload = JSON.stringify({
    title: '먕먕이',
    body,
    icon: '/icon-kakao.png',
  });

  try {
    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

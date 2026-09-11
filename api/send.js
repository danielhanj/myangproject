const webpush = require('web-push');

const INTERJECTIONS = ['애긔', '애기야', '자기야', '흐앙', '뿌우', '우쭈쭈', '냥냥', '쀼잉', '헤헹'];
const GREETINGS = ['굳모닝', '굳뭐닝', '굿모닝', '구우웃모닝', '모닝이양', '모닝이당'];
const WAKE_PHRASES = ['잘잤오', '일어났오', '일어났어', '자쟀어염', '일어나쒀', '눈떴오'];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomPunct() {
  const chars = ['?', '!'];
  const length = Math.floor(Math.random() * 4) + 1;
  let out = '';
  for (let i = 0; i < length; i++) out += pick(chars);
  return out;
}

function buildMessage() {
  const interj = pick(INTERJECTIONS);
  const greeting = pick(GREETINGS);
  const wake1 = pick(WAKE_PHRASES);
  const wake2 = pick(WAKE_PHRASES);
  return `${interj}! ${greeting}, ${wake1}${randomPunct()}, ${wake2}${randomPunct()}`;
}

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

  const body = buildMessage();

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

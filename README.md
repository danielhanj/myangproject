# 먕먕이 — daily 8am push with a custom icon

A tiny installable web app (PWA) that sends one push notification every morning at 8am KST,
with whatever icon image you drop in — including a KakaoTalk-style one.

Generated VAPID keys (already baked into `public/index.html` for the public one):

```
VAPID_PUBLIC_KEY=BG-ygWaW4epg8ApDPF_-pCdQmG_nTHqI3RpFvlZCPPwYZ-yk8R_OZpeMi8VXt-jewFZKaqe9DiBQN8JKcn8BezU
VAPID_PRIVATE_KEY=8yjOo_403ZiZXkk5TzTRlfVLOKUBIzdYwBHzqn01xco
```

Keep the private key secret — never commit it to a public repo, only put it in Vercel's
Environment Variables.

## 1. Add the icon

Save a KakaoTalk-style icon PNG (square, ~512x512 works for everything) as:

```
public/icon-kakao.png
```

## 2. Push to GitHub and import into Vercel

```
git init
git add .
git commit -m "init"
```

Push to a **private** GitHub repo, then in the Vercel dashboard: New Project → import that repo.

## 3. Set environment variables (Vercel dashboard → Project → Settings → Environment Variables)

| Name | Value |
|---|---|
| `VAPID_PUBLIC_KEY` | `BG-ygWaW4epg8ApDPF_-pCdQmG_nTHqI3RpFvlZCPPwYZ-yk8R_OZpeMi8VXt-jewFZKaqe9DiBQN8JKcn8BezU` |
| `VAPID_PRIVATE_KEY` | `8yjOo_403ZiZXkk5TzTRlfVLOKUBIzdYwBHzqn01xco` |
| `VAPID_SUBJECT` | `mailto:your-own-email@example.com` (your contact — required by the push spec, only ever seen by Apple's push service, never by the recipient's phone) |
| `CRON_SECRET` | any random string you make up, e.g. `openssl rand -hex 16` output — protects `/api/send` from being triggered by randoms |
| `PUSH_SUBSCRIPTION` | leave empty for now, filled in step 5 |

Deploy.

## 4. Have your friend "install" it (this is the one step that needs their phone)

On their iPhone, in **Safari** (must be Safari, not Chrome):

1. Open your deployed URL (e.g. `https://your-project.vercel.app`)
2. Tap Share → **Add to Home Screen**
3. Close Safari, open the app from the **new home screen icon** (this part matters — push only works from the installed icon, not a normal Safari tab)
4. Tap **알림 켜기** → allow notifications when prompted
5. A block of text (their push subscription) appears in the box on screen — copy all of it

## 5. Wire the subscription back in

Paste what they copied as the value of `PUSH_SUBSCRIPTION` in Vercel's env vars, then
**redeploy** (env var changes need a redeploy to take effect).

## 6. Test it immediately (don't wait for 8am)

```
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-project.vercel.app/api/send
```

Should return `{"ok":true}` and a notification should land on their phone within seconds,
showing your icon, `먕먕이` as the title, and `일어났어? 오늘도 화이팅!` as the body.

## How the schedule works

`vercel.json` runs `/api/send` at `23:00 UTC` daily = `08:00 KST` daily (Vercel Cron always
uses UTC). Nothing else to configure — it just fires every morning from then on.

## To change the message later

Edit the `payload` object in `api/send.js` and redeploy.

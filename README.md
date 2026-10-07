

Readme · MD
# Touchline
 
Touchline is a small football streaming website I put together for showing live matches, replaying old games and selling premium passes through Mobile Money. It's plain HTML, CSS and JavaScript. No framework, no build step, no database. Open it in a browser and it works.
 
Right now it's a working front end with demo data. It looks and behaves like the real thing, but a few parts are placeholders until you plug in your own stream, videos and a payment check. I've been upfront about those below so nothing surprises you.
 
## What's on the page
 
- **Live player** with a scorebug (teams, score, match clock) sitting over the video.
- **Free preview.** Visitors get 2 minutes of the live stream. After that the video pauses and a "Your free preview has ended" screen covers it.
- **"On today" list.** Click a fixture and the scorebug updates to that match.
- **Past games.** A grid of replays you can filter by competition (All, Premier League, Cup, Highlights). Some are free, some are marked Premium.
- **Matchday gallery.** A mixed-size photo grid. The images are generated placeholders for now.
- **Premium passes.** Three plans: Match day pass, Monthly and Season.
- **Payment pop-up.** A three-step dialog: pick a pass and enter your name and number, then see the Mobile Money instructions with a unique reference, then confirm and unlock.
## Files
 
```
index.html   the page structure
styles.css   all the styling (dark green pitch theme, gold accents)
script.js    content, player logic, filters and the payment flow
```
 
Fonts (Big Shoulders Display and Figtree) load from Google Fonts. The video library, hls.js, loads from the jsDelivr CDN. So you need an internet connection the first time you open it.
 
## Running it
 
The easy way: double-click `index.html`.
 
If something acts strangely (some browsers are picky about video from local files), run a tiny local server instead:
 
```
python -m http.server 8000
```
 
Then go to `http://localhost:8000`.
 
## Changing things
 
Almost everything you'd want to edit sits at the top of `script.js`.
 
**`CONFIG`**
- `payNumber`: the Mobile Money number.
- `previewSeconds`: how long the free preview lasts. It's 120 (two minutes).
- `liveSrc`: the live stream address. It currently points to a public test stream, so replace it with your own `.m3u8` (HLS) or `.mp4` link.
- `demoUnlock`: leave it `true` while testing. Read the payments section before you ever set it live.
**`PLANS`** holds the pass names, prices (in UGX) and the perks listed on each card.
 
**`FIXTURES`** is the "On today" list: teams, score, kickoff time or minute, and which match is live.
 
**`REPLAYS`** is the past games list. Each one has a title, competition, date, length, a `premium` true/false and a colour for its placeholder thumbnail.
 
**`GALLERY`** is just a list of captions. To use real photos, swap the `art(...)` call inside the gallery section for an `<img src="photos/yourpic.jpg">`.
 
A heads up: the payment number also appears directly in `index.html`, in the "Pick a pass" note, the payment steps and the footer. If you change the number, change it in `script.js` and in those spots too.
 
## Things that are still placeholders
 
1. **Live stream.** Uses a public test stream until you set `liveSrc`.
2. **Replay videos.** Every replay card plays the same sample video (Big Buck Bunny). Replace `SAMPLE_VIDEO`, or better, give each replay its own video link.
3. **Match data.** Teams, scores and clock are typed in by hand. They don't update on their own.
4. **Prices.** The amounts are examples.
5. **Thumbnails and gallery.** Generated artwork, not real pictures.
## Payments: please read this
 
This is the most important section.
 
Right now, when someone presses **I've paid**, the site simply believes them and unlocks premium. Nothing checks that money actually arrived. The unlock is also saved in the browser's local storage, which means anyone who knows how to open the browser tools can give themselves premium for free.
 
That's fine for a demo or a design review. It is **not** safe for real money.
 
To go live properly you need a small backend that:
 
1. Takes the payment through a Mobile Money collection service (MTN MoMo, Airtel Money, or an aggregator such as Flutterwave or Pesapal).
2. Confirms the payment using the reference.
3. Only then gives the user a premium token the server can verify.
After that, set `CONFIG.demoUnlock` to `false`. The same goes for the free preview and the locked replays. They're enforced in the browser, so a determined person can get around them. Real protection means checking access on the server and serving protected video only to people who've paid.
 
## Known limitations
 
- Premium status lives in one browser on one device. Clearing the site data or switching phones loses it.
- There are no user accounts or logins.
- The preview timer counts seconds of playback in the page, so it's easy to reset by refreshing.
- The scoreboard is manual.
## Browser support
 
Works in current Chrome, Edge, Firefox and Safari. The payment pop-up uses the native `<dialog>` element, so very old browsers won't show it properly.
 
## Ideas for later
 
- Real accounts and server-side payment checks
- Live score feed instead of typed-in numbers
- Real match videos and photos
- A proper admin page so you don't have to edit `script.js` to update fixtures
 

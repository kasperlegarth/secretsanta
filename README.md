# Secret Santa Email App 🎅

En simpel Nuxt 3 applikation med juletema til at sende emails med fil-vedhæftninger via Resend API.

## Features

- ✉️ Send emails med custom beskeder
- 📎 Vedhæft op til 3 filer
- 🎄 Juletema design med snefnug og dekorationer
- 🎅 Julemands logo og festligt UI
- 📱 Fuldt responsivt design

## Setup

### 1. Installer dependencies

```bash
npm install
```

### 2. Konfigurer Resend API Key

1. Opret en konto på [resend.com](https://resend.com)
2. Generer en API key i Resend dashboard
3. Åbn `.env` filen og tilføj din API key:

```env
RESEND_API_KEY=re_din_api_key_her
```

### 3. Kør development server

```bash
npm run dev
```

Applikationen vil være tilgængelig på: <http://localhost:3000> (eller 3001 hvis port 3000 er optaget)

## Email Afsender

### Midlertidig udvikling

Under udvikling bruger applikationen Resend's test email: `onboarding@resend.dev`

Dette virker uden domain verificering og lader dig teste funktionaliteten med det samme.

### Production (når dit domæne er klar)

Når du har købt dit domæne (`drillenisse.dk` eller `drille-nisse.dk`):

1. Gå til Resend dashboard
2. Tilføj og verificer dit domæne (følg DNS setup guide)
3. Åbn `server/api/send-email.post.ts`
4. Skift linjen:
   ```typescript
   from: 'onboarding@resend.dev',
   ```
   til:
   ```typescript
   from: 'din@dit-domain.dk',
   ```

## Deployment til Vercel

### 1. Push til Git

```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy via Vercel

1. Gå til [vercel.com](https://vercel.com)
2. Import dit Git repository
3. Vercel vil automatisk detectere Nuxt 3
4. Tilføj environment variable:
   - Key: `RESEND_API_KEY`
   - Value: `re_din_api_key`
5. Deploy!

## Projekt Struktur

```
secretsanta/
├── server/
│   └── api/
│       └── send-email.post.ts  # API endpoint med fil upload
├── components/
│   ├── EmailForm.vue           # Hovedformular
│   ├── FeedbackMessage.vue     # Success/error beskeder
│   └── SecretSantaLogo.vue     # SVG logo
├── public/
│   └── julemand.png            # Julemands ikon
├── app.vue                     # Root layout
├── nuxt.config.ts              # Nuxt konfiguration
└── tailwind.config.js          # Tailwind custom farver
```

## Teknologier

- **Nuxt 3** - Vue.js framework
- **Tailwind CSS** - Styling
- **Resend** - Email service
- **Vercel** - Hosting

## Support

Hvis du oplever problemer, tjek:
- At RESEND_API_KEY er sat korrekt i `.env`
- At dit domæne er verificeret i Resend (for production)
- Vercel deployment logs for fejl

God jul! 🎄

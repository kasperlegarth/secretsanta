# Deployment Guide - Secret Santa til Vercel

## Trin 1: Forbered Git Repository

1. Initialiser git (hvis ikke allerede gjort):
```bash
git init
git add .
git commit -m "Initial commit - Secret Santa app"
```

2. Opret et nyt repository på GitHub/GitLab/Bitbucket og push:
```bash
git remote add origin https://github.com/dit-brugernavn/secretsanta.git
git branch -M main
git push -u origin main
```

## Trin 2: Deploy til Vercel

### Via Vercel Dashboard (Anbefalet):

1. Gå til [vercel.com](https://vercel.com)
2. Log ind med GitHub/GitLab/Bitbucket
3. Klik på "Add New Project"
4. Import dit "secretsanta" repository
5. Vercel detecterer automatisk at det er en Nuxt app
6. **Konfigurer Environment Variables:**
   - Klik på "Environment Variables"
   - Tilføj: `RESEND_API_KEY` = `din_resend_api_key`
   - Vælg "Production, Preview, Development" (alle miljøer)
7. Klik "Deploy"

### Via Vercel CLI:

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Følg prompten og tilføj environment variable når spurgt
```

## Trin 3: Tilføj Environment Variables

Efter deployment, gå til:
1. Vercel Dashboard → Dit projekt → Settings → Environment Variables
2. Tilføj:
   - **Key:** `RESEND_API_KEY`
   - **Value:** Din Resend API key
   - **Environment:** Production, Preview, Development

3. Redeploy projektet for at environment variablen træder i kraft:
   - Gå til Deployments
   - Klik "..." på seneste deployment
   - Vælg "Redeploy"

## Trin 4: Verificer Deployment

1. Åbn din Vercel URL (f.eks. `secretsanta.vercel.app`)
2. Test formularen:
   - Udfyld modtager email
   - Skriv en testbesked
   - Upload evt. filer (maks 3)
   - Send
3. Tjek modtagers inbox

## Trin 5: Custom Domain (Valgfrit)

Hvis du vil bruge dit eget domæne (f.eks. drillenisse.dk):

1. Gå til Vercel Dashboard → Dit projekt → Settings → Domains
2. Tilføj dit domæne
3. Følg instruktionerne for at opdatere DNS records hos din domain provider
4. Vent på DNS propagering (kan tage op til 48 timer)

## Funktioner der virker efter deployment:

✅ Email sending via Resend API
✅ File uploads (maks 3 filer)
✅ Sne animation med physics
✅ Kontrolpanel til sne-indstillinger
✅ Responsive design

## Vigtigt:

- **API Key:** Hold din Resend API key hemmelig - ALDRIG commit .env filen til git!
- **Email limits:** Resend gratis tier har 100 emails/dag, 3000/måned

## Fejlfinding:

**Email virker ikke:**
- Tjek at `RESEND_API_KEY` er sat korrekt i Vercel
- Tjek at domænet `drillenisse.dk` er verificeret i Resend
- Tjek Vercel Function logs under Deployments → Function Logs

**Sne virker ikke:**
- Tjek browser console for JavaScript fejl
- Prøv at disable browser extensions (ad blockers)

## Support

Hvis du har problemer:
1. Tjek Vercel deployment logs
2. Tjek browser console for fejl
3. Tjek Resend dashboard for email status

God jul! 🎄🎅

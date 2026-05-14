# Implementation Instructions for amilydata.com

## 1. Test the site first

1. Unzip `amilydata-final-site.zip`.
2. Open the folder.
3. Double-click `index.html`.
4. Test these items:
   - Logo loads correctly.
   - Your photo loads correctly.
   - Mobile menu opens and closes.
   - Service cards update the selected service panel.
   - Sample work carousel moves on desktop.
   - “Refresh sample charts” changes the sample charts.
   - Copy email button works.
   - Contact form opens your email app.

## 2. Upload to your current website host

Use this option if `amilydata.com` already has hosting.

1. Sign in to your website hosting account.
2. Open File Manager, FTP, or SFTP.
3. Find the public website folder. Common names are:
   - `public_html`
   - `www`
   - `htdocs`
4. Back up the current site files first.
5. Upload these files and folders into the public website folder:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `assets/`
   - `client-intake-template.csv` if you want it online
6. Make sure the file is named exactly `index.html`.
7. Visit `https://amilydata.com`.
8. Refresh the page. You may need to clear your browser cache.

## 3. Use a static website host instead

Use this option if you do not have hosting yet.

Good fit for this site:

- Netlify
- Cloudflare Pages
- GitHub Pages
- Vercel

Basic process:

1. Create a new site/project.
2. Upload this folder or connect it to a GitHub repository.
3. Set the publish folder to the folder that contains `index.html`.
4. Add your custom domain: `amilydata.com`.
5. Follow the DNS instructions from the host.
6. Wait for HTTPS/SSL to finish setting up.
7. Test the live site.

## 4. Connect the domain

Your website host will give you DNS records. Add those records wherever your domain is managed.

Common records are:

- `A` record for the root domain: `amilydata.com`
- `CNAME` record for `www.amilydata.com`

Use the exact records your host gives you.

## 5. Make the contact form real later

Right now the contact form opens the visitor’s email app.

That is okay for a starter site.

Later, connect the form to a real form handler so messages are sent directly from the website.

## 6. What to replace later

Once you finish real projects, update:

- Sample dashboard cards
- Numbers shown in the mock dashboard panels
- About section if you want more detail
- Volunteer or low-cost project wording
- Any new services you want to offer

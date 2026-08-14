# ANVECAN — Final Website

Bu paket GitHub, GitHub Pages veya Netlify üzerinde yayınlanmaya hazır statik web sitesidir.

## Dosyalar
- `index.html` — ana sayfa
- `styles.css` — tüm tasarım ve responsive yapı
- `script.js` — menü, animasyon, modal, proje slider, form etkileşimleri
- `assets/favicon.svg` — site ikonu
- `netlify.toml` — Netlify ayarları
- `CNAME` — GitHub Pages custom domain için `anvecan.com`

## GitHub'a yükleme
1. GitHub'da yeni repo oluşturun.
2. Bu klasörün **içindeki dosyaların tamamını** repo kök dizinine yükleyin.
3. Commit edin.

## Netlify'a GitHub üzerinden bağlama (önerilen mevcut akış)
1. Netlify > Add new site > Import an existing project.
2. GitHub'ı seçin ve repo'yu bağlayın.
3. Build command boş bırakın.
4. Publish directory: `.`
5. Deploy edin.
6. Domain Management bölümünde mevcut `anvecan.com` domainini bu siteye bağlayın.

Form `Netlify Forms` ile çalışacak şekilde işaretlenmiştir. Netlify dışındaki statik hostlarda form otomatik olarak `info@anvecan.com` adresine mailto fallback kullanır.

## GitHub Pages ile yayınlama
Settings > Pages > Deploy from a branch > `main` / `/root` seçin. `CNAME` dosyası custom domaini `anvecan.com` olarak ayarlar. DNS kayıtları ayrıca GitHub Pages'e yönlendirilmelidir.

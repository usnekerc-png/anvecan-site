(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Year
  $('#year').textContent = new Date().getFullYear();

  // Mobile menu
  const menuBtn = $('#menuBtn');
  const nav = $('#mainNav');
  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });
  $$('.nav-link').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));

  // Active navigation
  const sections = ['top','hizmetler','projeler','surec','iletisim']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = $$('.nav-link');
  const activateNav = () => {
    const y = window.scrollY + 140;
    let activeId = 'top';
    for (const section of sections) if (section.offsetTop <= y) activeId = section.id;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`));
  };
  window.addEventListener('scroll', activateNav, {passive:true});
  activateNav();

  // Reveal animation
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.delay || 0);
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Mouse ambient glow + subtle 3D hero movement
  const glow = $('#cursorGlow');
  const scene = $('#heroScene');
  window.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width/2)) / r.width;
    const y = (e.clientY - (r.top + r.height/2)) / r.height;
    scene.style.transform = `perspective(1400px) rotateY(${x * 2.2}deg) rotateX(${-y * 1.5}deg)`;
  }, {passive:true});
  scene.addEventListener('pointerleave', () => {
    if (!window.matchMedia('(max-width: 900px)').matches) scene.style.transform = '';
  });

  // Project carousel
  const carousel = $('#projectCarousel');
  const step = () => carousel.querySelector('.project-card').getBoundingClientRect().width + 14;
  $('#projectNext').addEventListener('click', () => carousel.scrollBy({left:step(), behavior:'smooth'}));
  $('#projectPrev').addEventListener('click', () => carousel.scrollBy({left:-step(), behavior:'smooth'}));
  $('#allProjects').addEventListener('click', () => carousel.scrollTo({left:carousel.scrollWidth, behavior:'smooth'}));

  // Modals
  const offerModal = $('#offerModal');
  const detailModal = $('#detailModal');
  const setModal = (modal, open) => {
    modal.classList.toggle('open', open);
    modal.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  $$('[data-open-offer]').forEach(btn => btn.addEventListener('click', () => setModal(offerModal, true)));
  $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => setModal(offerModal, false)));
  $$('[data-close-detail]').forEach(btn => btn.addEventListener('click', () => setModal(detailModal, false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { setModal(offerModal, false); setModal(detailModal, false); }
  });

  const details = {
    stock:{title:'Akıllı Depo Stok Sayımı', text:'Depo operasyonunu tek merkezden yönetmek için tasarlanan stok sistemi; ürün hareketlerini, kritik seviyeleri ve SKT takibini sade bir arayüzde birleştirir.', features:['Minimum stok uyarısı','Zorunlu ürün adı / görsel / SKT','Depolar arası transfer','Ürün giriş-çıkış hareketleri','Sayım ve raporlama','Mobil uyumlu yönetim']},
    pos:{title:'Cafe Adisyon & POS', text:'Cafe operasyonunda siparişten ödemeye kadar olan akışı hızlandıran, masa ve ürün yönetimini tek ekranda toplayan dijital sistem.', features:['Masa / adisyon yönetimi','Hızlı ürün ekleme','Ödeme akışı','Menü ve fiyat yönetimi','Satış özeti','Responsive kasa ekranı']},
    dashboard:{title:'Yönetim & Raporlama Paneli', text:'Farklı operasyon verilerini anlaşılır grafikler, KPI kartları ve aksiyon alınabilir içgörüler halinde sunan modern yönetim paneli.', features:['Canlı KPI kartları','Filtrelenebilir raporlar','Kritik uyarılar','Rol bazlı ekranlar','Mobil görünüm','API entegrasyonları']},
    web:{title:'Premium Kurumsal Web Experience', text:'Markanın teknoloji yetkinliğini ilk saniyede hissettiren; 3D hissi, mikro animasyonlar ve güçlü içerik hiyerarşisiyle tasarlanan web deneyimi.', features:['Premium UI tasarımı','Mikro animasyonlar','Responsive yapı','Hız optimizasyonu','SEO altyapısı','Form / CTA akışları']}
  };

  const openDetail = (data) => {
    $('#detailTitle').textContent = data.title;
    $('#detailText').textContent = data.text;
    $('#detailFeatures').innerHTML = data.features.map(f => `<span>${f}</span>`).join('');
    setModal(detailModal, true);
  };
  $$('[data-project-open]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.closest('[data-project]').dataset.project;
    openDetail(details[key]);
  }));
  $$('[data-service-open]').forEach(btn => btn.addEventListener('click', () => {
    const name = btn.closest('[data-service]').dataset.service;
    openDetail({title:name, text:`${name} ihtiyacını işletmenizin gerçek akışına göre özel olarak tasarlayıp geliştirebiliriz.`, features:['İhtiyaca özel tasarım','Responsive arayüz','Yönetim ekranı','Entegrasyon seçenekleri','Test ve optimizasyon','Canlıya alma desteği']});
  }));
  $('#detailOffer').addEventListener('click', () => { setModal(detailModal, false); setModal(offerModal, true); });

  // Toast
  let toastTimer;
  const showToast = msg => {
    const toast = $('#toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  // Netlify form with mailto fallback on non-Netlify/static hosts
  const offerForm = $('#offerForm');
  offerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const status = $('#formStatus');
    const data = new FormData(offerForm);
    status.textContent = 'Gönderiliyor…';
    try {
      const body = new URLSearchParams(data);
      const res = await fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:body.toString()});
      if (!res.ok) throw new Error('host-no-form');
      offerForm.reset();
      status.textContent = 'Talebiniz alındı. Teşekkürler.';
      showToast('Proje talebi başarıyla gönderildi.');
      setTimeout(() => setModal(offerModal, false), 1100);
    } catch (err) {
      const subject = encodeURIComponent(`ANVECAN Proje Talebi — ${data.get('type')}`);
      const message = encodeURIComponent(`Ad: ${data.get('name')}\nE-posta: ${data.get('email')}\nProje: ${data.get('type')}\n\n${data.get('message')}`);
      status.textContent = 'E-posta uygulamanız açılıyor…';
      window.location.href = `mailto:info@anvecan.com?subject=${subject}&body=${message}`;
    }
  });

  $('#newsletterForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#newsletterEmail').value.trim();
    if (!email) return;
    showToast('E-posta adresiniz alındı.');
    $('#newsletterEmail').value = '';
    window.location.href = `mailto:info@anvecan.com?subject=${encodeURIComponent('ANVECAN Bülten Talebi')}&body=${encodeURIComponent(`Bültene katılmak istiyorum: ${email}`)}`;
  });
})();

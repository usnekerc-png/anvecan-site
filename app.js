(() => {
  const canvas = document.getElementById('network');
  const ctx = canvas.getContext('2d', { alpha: true });
  const spotlight = document.getElementById('spotlight');
  const pulseText = document.getElementById('pulseText');
  const progressValue = document.getElementById('progressValue');
  const clock = document.getElementById('clock');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let nodes = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(24, Math.min(70, Math.round((width * height) / 25000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.13,
      vy: (Math.random() - 0.5) * 0.13,
      r: Math.random() * 1.5 + 0.45
    }));
  }

  function drawNetwork() {
    ctx.clearRect(0, 0, width, height);

    const grid = 72;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    for (const node of nodes) {
      if (!reducedMotion) {
        node.x += node.vx;
        node.y += node.vy;
      }
      if (node.x < -10) node.x = width + 10;
      if (node.x > width + 10) node.x = -10;
      if (node.y < -10) node.y = height + 10;
      if (node.y > height + 10) node.y = -10;
    }

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 135) {
          const alpha = (1 - distance / 135) * 0.13;
          ctx.strokeStyle = `rgba(105,247,255,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const node of nodes) {
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 5);
      gradient.addColorStop(0, 'rgba(202,252,255,.75)');
      gradient.addColorStop(1, 'rgba(105,247,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reducedMotion) requestAnimationFrame(drawNetwork);
  }

  function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  const phrases = ['Sinyal kuruluyor', 'Sistem tasarlanıyor', 'Deneyim üretiliyor', 'Yapay zekâ aktif'];
  let phraseIndex = 0;
  window.setInterval(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    pulseText.animate(
      [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-5px)' }],
      { duration: 180, fill: 'forwards' }
    ).finished.then(() => {
      pulseText.textContent = phrases[phraseIndex];
      pulseText.animate(
        [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 240, fill: 'forwards' }
      );
    });
  }, 2600);

  let progress = 72;
  window.setInterval(() => {
    progress += 1;
    if (progress > 89) progress = 72;
    progressValue.textContent = `${progress}%`;
  }, 4200);

  window.addEventListener('pointermove', (event) => {
    if (!spotlight || reducedMotion) return;
    spotlight.style.left = `${event.clientX}px`;
    spotlight.style.top = `${event.clientY}px`;
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
  drawNetwork();
  updateClock();
  window.setInterval(updateClock, 1000);
})();


(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const clock = document.getElementById('clock');
  const setClock = () => {
    try {
      const t = new Intl.DateTimeFormat('tr-TR', {
        timeZone:'Europe/Istanbul',
        hour:'2-digit', minute:'2-digit', hour12:false
      }).format(new Date());
      clock.textContent = `IST — ${t}`;
    } catch { clock.textContent = 'IST'; }
  };
  setClock();
  setInterval(setClock, 30000);

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        reveal.unobserve(e.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  const spot = document.getElementById('spotlight');
  window.addEventListener('pointermove', e => {
    if (!spot) return;
    spot.style.left = e.clientX + 'px';
    spot.style.top = e.clientY + 'px';
  }, {passive:true});

  // Lightweight animated network background
  const canvas = document.getElementById('network');
  const ctx = canvas.getContext('2d');
  let w=0,h=0,dpr=1;
  let nodes=[];
  const resize=()=>{
    dpr=Math.min(window.devicePixelRatio||1,2);
    w=window.innerWidth; h=window.innerHeight;
    canvas.width=w*dpr; canvas.height=h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(64,Math.max(26,Math.floor(w*h/26000)));
    nodes=Array.from({length:count},()=>({
      x:Math.random()*w,y:Math.random()*h,
      vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,
      r:Math.random()*1.2+.4
    }));
  };
  window.addEventListener('resize',resize);
  resize();

  const draw=()=>{
    ctx.clearRect(0,0,w,h);
    for(const n of nodes){
      n.x+=n.vx;n.y+=n.vy;
      if(n.x<0||n.x>w)n.vx*=-1;
      if(n.y<0||n.y>h)n.vy*=-1;
      ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle='rgba(210,255,170,.48)';ctx.fill();
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j];
        const dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
        if(d<135){
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(190,220,200,${(1-d/135)*.09})`;
          ctx.lineWidth=.7;ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  draw();
})();

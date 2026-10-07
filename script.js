(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('#theme-toggle');
  const setTheme = (dark) => {
    root.dataset.theme = dark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  try { setTheme(localStorage.getItem('jz-theme') === 'dark'); } catch { setTheme(false); }
  themeButton.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    setTheme(dark);
    try { localStorage.setItem('jz-theme', dark ? 'dark' : 'light'); } catch { /* theme remains functional without storage */ }
  });
  const papers = [...document.querySelectorAll('.publication')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(other => {
      const selected = other === button;
      other.classList.toggle('selected', selected);
      other.setAttribute('aria-pressed', String(selected));
    });
    const filter = button.dataset.filter;
    papers.forEach(paper => { paper.hidden = filter !== 'all' && paper.dataset.category !== filter; });
    const count = papers.filter(paper => !paper.hidden).length;
    document.querySelector('#publication-status').textContent = `${count} publications shown.`;
  }));
  const navigation = [...document.querySelectorAll('nav a')];
  navigation.forEach(link => link.addEventListener('click', () => {
    navigation.forEach(other => other.classList.toggle('active', other === link));
  }));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const active = `#${visible[0].target.id}`;
      navigation.forEach(link => {
        const selected = link.getAttribute('href') === active;
        link.classList.toggle('active', selected);
        if (selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }, {rootMargin:'-5% 0px -60% 0px',threshold:0});
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
})();

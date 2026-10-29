// 사이트 공통 스크립트
(function () {
  var root = document.documentElement;

  // 1. 푸터의 연도를 자동으로 표시합니다.
  var y = document.getElementById('year');
  if (y) { y.textContent = new Date().getFullYear(); }

  // 2. 다크 모드: 저장된 설정 > 시스템 설정 순서로 적용합니다.
  var themeBtn = document.getElementById('theme-toggle');
  function getSaved() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeBtn.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    }
  }
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(getSaved() || (prefersDark ? 'dark' : 'light'));
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // 3. 모바일 메뉴 열기/닫기
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.querySelector('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.textContent = open ? '✕' : '☰';
    });
  }

  // 4. 스크롤하면 카드가 부드럽게 나타납니다.
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  // 5. 홈 화면 타이핑 효과
  var typing = document.querySelector('.typing');
  if (typing) {
    var words = JSON.parse(typing.getAttribute('data-words'));
    var w = 0, c = 0, deleting = false;
    (function tick() {
      var word = words[w];
      c += deleting ? -1 : 1;
      typing.textContent = word.slice(0, c);
      var delay = deleting ? 50 : 110;
      if (!deleting && c === word.length) { deleting = true; delay = 1600; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
      setTimeout(tick, delay);
    })();
  }

  // 6. 이메일 복사 버튼
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      if (!navigator.clipboard) { return; }
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = '복사됨!';
        setTimeout(function () { btn.textContent = '복사'; }, 1500);
      });
    });
  });

  // 7. 문의 폼: 입력값을 확인한 뒤 메일 앱으로 보냅니다.
  var form = document.querySelector('.contact-form');
  if (form) {
    var msg = form.querySelector('.form-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name;
      var message = form.elements.message;
      name.classList.remove('field-error');
      message.classList.remove('field-error');

      var empty = [name, message].filter(function (el) { return !el.value.trim(); });
      if (empty.length) {
        empty.forEach(function (el) { el.classList.add('field-error'); });
        empty[0].focus();
        msg.className = 'form-msg error';
        msg.textContent = '이름과 메시지를 모두 입력해 주세요.';
        return;
      }

      var subject = '[홈페이지 문의] ' + name.value.trim() + '님의 메시지';
      window.location.href = 'mailto:' + form.getAttribute('data-to') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(message.value.trim());
      msg.className = 'form-msg ok';
      msg.textContent = '메일 앱이 열렸어요. 내용을 확인하고 보내 주세요!';
      form.reset();
    });
  }
})();

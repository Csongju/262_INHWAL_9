// 사이트 공통 스크립트 (home / about / portfolio / contact)
(function () {
  // 1. 사이드바의 연도를 자동으로 표시합니다.
  var y = document.getElementById('year');
  if (y) { y.textContent = new Date().getFullYear(); }

  // 2. 모바일 메뉴 열기/닫기 (좁은 화면에서 사이드바가 상단바로 바뀝니다)
  var menuBtn = document.getElementById('menu-toggle');
  var sidebar = document.querySelector('.sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      menuBtn.textContent = open ? '✕' : '☰';
    });
  }

  // 3. 스크롤하면 블록이 부드럽게 나타납니다.
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

  // 4. 이메일 복사 버튼
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

  // 5. 문의 폼: 입력값을 확인한 뒤 메일 앱으로 보냅니다.
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

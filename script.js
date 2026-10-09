// ==========================================================================
// SCRIPT.JS - INTERACTIVE LOGIC & ANIMATIONS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Dark / Light)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  // Kiểm tra lưu trữ trước đó hoặc hệ thống
  const savedTheme = localStorage.getItem('eduhub_test_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('eduhub_test_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(newTheme === 'dark' ? '🌙 Đã kích hoạt Chế độ Tối' : '☀️ Đã kích hoạt Chế độ Sáng');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      themeIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }

  // 2. Animated Number Counters
  const counterElements = document.querySelectorAll('.counter-val');
  counterElements.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const speed = 25;
    const step = Math.ceil(target / 40);

    const updateCount = () => {
      count += step;
      if (count < target) {
        counter.innerText = count.toLocaleString('vi-VN');
        setTimeout(updateCount, speed);
      } else {
        counter.innerText = target.toLocaleString('vi-VN');
      }
    };
    updateCount();
  });

  // 3. Filter Tabs (Danh mục dự án / sự kiện)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Bỏ active ở các nút khác
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Accordion FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Đóng tất cả các item khác
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      // Mở/đóng item hiện tại
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 5. Interactive Demo Form (Bộ tính toán / Trắc nghiệm / Đăng ký thử)
  const demoForm = document.getElementById('demo-register-form');
  const liveFeedbackBox = document.getElementById('live-feedback-box');

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('demo-name').value.trim();
      const club = document.getElementById('demo-club').value;
      const role = document.getElementById('demo-role').value;

      if (!name || !club) {
        showToast('⚠️ Vui lòng nhập đầy đủ họ tên và chọn CLB!');
        return;
      }

      // Giả lập xử lý thành công
      if (liveFeedbackBox) {
        liveFeedbackBox.style.display = 'block';
        liveFeedbackBox.innerHTML = `
          <strong>🎉 Đăng ký thành công!</strong><br>
          Chào mừng sinh viên <strong>${escapeHtml(name)}</strong> đã ghi danh vào <strong>${escapeHtml(club)}</strong> với nguyện vọng <strong>${escapeHtml(role)}</strong>.<br>
          <small>Hệ thống đã tạo mã dự thưởng: #${Math.floor(100000 + Math.random() * 900000)}</small>
        `;
      }

      showToast('🚀 Dữ liệu thử nghiệm đã được ghi nhận!');
      demoForm.reset();
    });
  }

  // 6. Toast Notification Helper
  function showToast(message) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Utility to prevent XSS in demo
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }
});

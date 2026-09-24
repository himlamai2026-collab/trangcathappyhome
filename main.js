// trangcathappyhome.com — form đăng ký + xem ảnh lớn.
// Form gửi về cùng Apps Script của ongchunoxh.com (tools/apps-script-nhan-lead.js): ghi Sheet + bắn Telegram.
(function () {
  var NOI_NHAN = 'https://script.google.com/macros/s/AKfycbwZN0KZv3CF1UcVUZpRk7nMPQrg6i9wns3EicIWlKLgX0s0lFxBUwI15aRygP-tziHKgQ/exec';
  var ZALO = '0879 388 988';

  // ── Meta Pixel: điền mã tập dữ liệu (dataset ID) của tài khoản chạy quảng cáo. Để trống = không nạp gì ──
  var PIXEL = '3013589955699507';
  if (PIXEL) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL);
    fbq('track', 'PageView');
  }
  var dem = function (suKien, thongTin) { if (PIXEL && window.fbq) fbq('track', suKien, thongTin); };

  // Bấm Gọi / Zalo ở bất kỳ chỗ nào = một lượt Liên hệ
  document.querySelectorAll('a[href^="tel:"], a[href*="zalo.me"]').forEach(function (a) {
    a.addEventListener('click', function () {
      dem('Contact', { content_name: a.href.indexOf('tel:') === 0 ? 'Gọi' : 'Zalo' });
    });
  });

  // ── Chọn nhu cầu ──
  var chon = document.querySelectorAll('.chon button');
  var batDau = document.querySelector('.chon button.on');
  var nhuCau = batDau ? batDau.getAttribute('data-v') : 'Tìm hiểu dự án';
  chon.forEach(function (b) {
    b.addEventListener('click', function () {
      chon.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      nhuCau = b.getAttribute('data-v');
    });
  });

  // ── Gửi form ──
  var form = document.getElementById('form-dk');
  var loi = document.getElementById('loi');
  var nut = document.getElementById('nut-gui');
  var thamSo = new URLSearchParams(location.search);
  // Không có ?n= mà có fbclid = khách bấm từ Facebook (quảng cáo hoặc bài thường)
  var kenh = (thamSo.get('n') || (thamSo.get('fbclid') ? 'fb' : '')).replace(/[^\w-]/g, '').slice(0, 40);

  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    loi.textContent = '';
    var ten = form.ten.value.trim().replace(/\s+/g, ' ');
    var sdt = form.sdt.value.replace(/[\s.\-()]/g, '').replace(/^\+?84/, '0');
    if (ten.length < 2) { loi.textContent = 'Nhà mình điền giúp họ tên nhé.'; form.ten.focus(); return; }
    if (!/^0\d{9}$/.test(sdt)) { loi.textContent = 'Số điện thoại chưa đúng, nhà mình kiểm tra lại giúp (10 số, bắt đầu bằng 0).'; form.sdt.focus(); return; }

    var xong = function () {
      form.innerHTML = '<div class="xong"><p class="to">✅ Đã nhận thông tin của nhà mình</p>' +
        '<p>Mình sẽ liên hệ lại sớm nhất. Cần gấp thì nhắn Zalo <a href="https://zalo.me/0879388988" target="_blank" rel="noopener">' + ZALO + '</a>.</p></div>';
    };
    if (form.web.value) { xong(); return; } // bẫy máy spam

    var ghi = form.ghi.value.trim().slice(0, 500);
    var goi = {
      ten: ten.slice(0, 80),
      sdt: sdt,
      duAn: 'trang-cat',
      nhanVien: 'nam',
      nguon: 'trangcathappyhome.com' + (kenh ? ' · ' + kenh : ''),
      ketQua: '',
      phanLoai: nhuCau,
      tomTat: 'Nhu cầu: ' + nhuCau + (ghi ? '\nGhi thêm: ' + ghi : '') + '\nTrang: trangcathappyhome.com' + location.pathname + location.search,
      traLoi: '',
      thoiDiem: new Date().toISOString()
    };

    nut.disabled = true;
    nut.textContent = 'Đang gửi…';
    fetch(NOI_NHAN, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(goi)
    }).then(function () {
      dem('CompleteRegistration', { content_name: 'Đăng ký Tràng Cát', content_category: nhuCau });
      xong();
    }).catch(function () {
      nut.disabled = false;
      nut.textContent = 'Gửi thông tin';
      loi.textContent = 'Chưa gửi được. Kiểm tra mạng rồi thử lại, hoặc nhắn Zalo ' + ZALO + '.';
    });
  });

  // ── Xem ảnh lớn ──
  var hop = document.getElementById('xem-anh');
  if (hop && typeof hop.showModal === 'function') {
    var anh = hop.querySelector('img');
    document.querySelectorAll('a.mo-lon').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        anh.src = a.getAttribute('href');
        anh.alt = (a.querySelector('img') || {}).alt || '';
        hop.showModal();
      });
    });
    hop.addEventListener('click', function () { hop.close(); });
  }
})();

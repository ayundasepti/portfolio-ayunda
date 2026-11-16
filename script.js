/* =========================================================
   script.js : semua gerakan dan interaksi website
   ========================================================= */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 1. MENU: scroll halus + tanda menu aktif ---------- */
  var nav = document.getElementById("nav");
  var links = Array.prototype.slice.call(nav.querySelectorAll("a"));

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    });
  });

  document.querySelector(".brand").addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  var ids = links.map(function (a) {
    return a.getAttribute("href").slice(1);
  });
  var current = "";

  function onScroll() {
    var y = window.scrollY + 120;
    var cur = ids[0];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= y) cur = id;
    });
    if (cur === current) return;
    current = cur;
    links.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + cur;
      a.classList.toggle("on", on);
      if (on && nav.scrollWidth > nav.clientWidth) {
        var left = a.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft;
        nav.scrollLeft = left - (nav.clientWidth - a.offsetWidth) / 2;
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. COVER: foto 3D mengikuti mouse ---------- */
  var stage = document.getElementById("stage");
  var stack = document.getElementById("stack");

  if (!reduce) {
    stage.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var r = stage.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      stack.style.setProperty("--ry", -14 + x * 16 + "deg");
      stack.style.setProperty("--rx", 5 - y * 12 + "deg");
      stage.style.setProperty("--mx", x.toFixed(3));
      stage.style.setProperty("--my", y.toFixed(3));
    });
    stage.addEventListener("pointerleave", function () {
      stack.style.removeProperty("--ry");
      stack.style.removeProperty("--rx");
      stage.style.setProperty("--mx", 0);
      stage.style.setProperty("--my", 0);
    });
  }

  /* ---------- 3. KARTU: miring sedikit saat disentuh mouse ---------- */
  if (fine && !reduce) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateX(" + (-y * 7).toFixed(2) + "deg) rotateY(" + (x * 9).toFixed(2) + "deg) translateY(-3px)";
        el.classList.add("live");
      });
      el.addEventListener("pointerleave", function () {
        el.style.transform = "";
        el.classList.remove("live");
      });
    });
  }

  /* ---------- 4. ISI PENJELASAN IKON APLIKASI ----------
     Mau ubah penjelasan? Edit teks di bawah ini.
     key  = nama di data-key pada index.html
     name = judul, tag = label kecil, p = daftar paragraf
     shot = teks kotak screenshot (hanya untuk proyek)
  ------------------------------------------------------- */
  var DATA = {
    tools: {
      html: {
        name: "HTML",
        tag: "Struktur halaman",
        p: ["HTML (HyperText Markup Language) adalah bahasa markup untuk menyusun struktur dan isi sebuah halaman website, seperti judul, paragraf, gambar, dan tautan.", "Setiap halaman web, termasuk portofolio ini, dimulai dari HTML."],
      },
      css: { name: "CSS", tag: "Tampilan halaman", p: ["CSS (Cascading Style Sheets) mengatur tampilan website: warna, ukuran, tata letak, sampai animasi.", "Kalau HTML adalah kerangkanya, CSS adalah dandanannya."] },
      php: {
        name: "PHP",
        tag: "Sisi server",
        p: ["PHP (Hypertext Preprocessor) adalah bahasa pemrograman yang berjalan di sisi server. Dengan PHP, website bisa memproses data, misalnya membaca isi formulir atau mengambil data dari database."],
      },
      db: { name: "Database", tag: "Penyimpanan data", p: ["Database dipakai untuk menyimpan, mengelola, dan mengakses data dalam sebuah aplikasi.", "Saya belajar mengelola database, mulai dari membuat tabel sampai mengolah datanya."] },
      xampp: { name: "XAMPP", tag: "Server lokal", p: ["XAMPP menyediakan lingkungan server lokal di komputer untuk menjalankan dan menguji aplikasi web, termasuk PHP dan MySQL/MariaDB, tanpa perlu diunggah ke internet dulu."] },
      flutter: {
        name: "Flutter",
        tag: "Aplikasi mobile",
        p: ["Flutter adalah framework untuk mengembangkan aplikasi dengan satu basis kode yang dapat dipakai di berbagai platform.", "Saya memakainya untuk proyek News Reader dan Notes App."],
      },
      figma: { name: "Figma", tag: "Desain antarmuka", p: ["Figma adalah aplikasi desain antarmuka untuk merancang tampilan website dan aplikasi sebelum dikodekan."] },
      vscode: { name: "Visual Studio Code", tag: "Code editor", p: ["Visual Studio Code adalah code editor untuk menulis, mengedit, dan mengelola kode program."] },
    },
    proj: {
      news: { name: "News Reader", tag: "Flutter", p: ["Proyek pengembangan aplikasi pembaca berita menggunakan Flutter."], shot: "Screenshot News Reader menyusul" },
      notes: { name: "Notes App", tag: "Flutter", p: ["Proyek pembuatan aplikasi catatan digital untuk menyimpan dan mengelola catatan, dibuat dengan Flutter."], shot: "Screenshot Notes App menyusul" },
      dbp: { name: "Praktik Database", tag: "Database", p: ["Praktik mengelola database, mulai dari pembuatan tabel hingga pengolahan data."], shot: "Dokumentasi database menyusul" },
      ui: { name: "Desain Figma", tag: "UI Design", p: ["Membuat rancangan antarmuka aplikasi menggunakan Figma."], shot: "Rancangan Figma menyusul" },
      other: { name: "Tugas Lainnya", tag: "Sekolah", p: ["Project atau tugas sekolah lainnya akan ditambahkan di sini."], shot: "Dokumentasi menyusul" },
    },
  };

  /* ---------- 5. IKON APLIKASI: ketuk, penjelasan muncul ---------- */
  document.querySelectorAll(".phone").forEach(function (phone) {
    var set = DATA[phone.getAttribute("data-set")];
    var sheet = phone.querySelector(".sheet");
    var scrim = phone.querySelector(".scrim");
    var closeBtn = phone.querySelector(".close");
    var body = sheet.querySelector(".body");
    var opener = null;

    function open(btn) {
      var d = set[btn.getAttribute("data-key")];
      if (!d) return;
      opener = btn;

      var src = btn.querySelector(".ico");
      var ico = sheet.querySelector(".sheet-head .ico");
      ico.className = src.className;
      ico.innerHTML = src.innerHTML;

      sheet.querySelector("h4").textContent = d.name;
      sheet.querySelector(".tag").textContent = d.tag;

      body.textContent = "";
      d.p.forEach(function (t) {
        var p = document.createElement("p");
        p.className = "txt";
        p.textContent = t;
        body.appendChild(p);
      });
      if (d.shot) {
        var s = document.createElement("div");
        s.className = "shot";
        s.textContent = d.shot;
        body.appendChild(s);
      }

      sheet.scrollTop = 0;
      sheet.removeAttribute("inert");
      sheet.classList.add("open");
      scrim.classList.add("open");
      closeBtn.focus({ preventScroll: true });
    }

    function close() {
      sheet.classList.remove("open");
      scrim.classList.remove("open");
      sheet.setAttribute("inert", "");
      if (opener) {
        opener.focus({ preventScroll: true });
        opener = null;
      }
    }

    phone.querySelectorAll(".app").forEach(function (b) {
      b.addEventListener("click", function () {
        open(b);
      });
    });
    closeBtn.addEventListener("click", close);
    scrim.addEventListener("click", close);
    phone.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  });

  /* ---------- 6. TOMBOL SALIN EMAIL ---------- */
  var btn = document.getElementById("copy");
  var mail = document.getElementById("mail");

  btn.addEventListener("click", function () {
    function done(ok) {
      btn.textContent = ok ? "Tersalin" : "Pilih teks";
      setTimeout(function () {
        btn.textContent = "Salin";
      }, 1800);
    }
    function pick() {
      var range = document.createRange();
      range.selectNodeContents(mail);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      done(false);
    }
    try {
      navigator.clipboard.writeText(mail.textContent.trim()).then(function () {
        done(true);
      }, pick);
    } catch (e) {
      pick();
    }
  });
})();

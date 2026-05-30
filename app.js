/*
  مدرسة عباد الرحمن لتحفيظ القرآن الكريم وتجويده
  مشروع Static: HTML + CSS + JavaScript فقط.
  ملاحظة مهمة: أي رفع ملفات من داخل المتصفح يبقى على نفس الجهاز/المتصفح عبر IndexedDB.
  للنشر العام: ضع التسجيلات وملفات PDF داخل مجلد media أو استخدم روابط مباشرة، ثم أضفها من لوحة الإدارة وصدّر JSON.
*/

const APP_KEY = "ibadRahmanQuranApp.v1";
const ADMIN_KEY = "ibadRahmanAdminUnlocked.v1";
const DEFAULT_ADMIN_PASSWORD = "1234";
const DB_NAME = "ibadRahmanQuranFiles";
const DB_VERSION = 1;
const STORE = "files";

const juzList = [
  { id: 1, name: "الجزء الأول", range: "الفاتحة - البقرة 141" },
  { id: 2, name: "الجزء الثاني", range: "البقرة 142 - البقرة 252" },
  { id: 3, name: "الجزء الثالث", range: "البقرة 253 - آل عمران 92" },
  { id: 4, name: "الجزء الرابع", range: "آل عمران 93 - النساء 23" },
  { id: 5, name: "الجزء الخامس", range: "النساء 24 - النساء 147" },
  { id: 6, name: "الجزء السادس", range: "النساء 148 - المائدة 81" },
  { id: 7, name: "الجزء السابع", range: "المائدة 82 - الأنعام 110" },
  { id: 8, name: "الجزء الثامن", range: "الأنعام 111 - الأعراف 87" },
  { id: 9, name: "الجزء التاسع", range: "الأعراف 88 - الأنفال 40" },
  { id: 10, name: "الجزء العاشر", range: "الأنفال 41 - التوبة 92" },
  { id: 11, name: "الجزء الحادي عشر", range: "التوبة 93 - هود 5" },
  { id: 12, name: "الجزء الثاني عشر", range: "هود 6 - يوسف 52" },
  { id: 13, name: "الجزء الثالث عشر", range: "يوسف 53 - إبراهيم 52" },
  { id: 14, name: "الجزء الرابع عشر", range: "الحجر - النحل" },
  { id: 15, name: "الجزء الخامس عشر", range: "الإسراء - الكهف 74" },
  { id: 16, name: "الجزء السادس عشر", range: "الكهف 75 - طه 135" },
  { id: 17, name: "الجزء السابع عشر", range: "الأنبياء - الحج" },
  { id: 18, name: "الجزء الثامن عشر", range: "المؤمنون - الفرقان 20" },
  { id: 19, name: "الجزء التاسع عشر", range: "الفرقان 21 - النمل 55" },
  { id: 20, name: "الجزء العشرون", range: "النمل 56 - العنكبوت 45" },
  { id: 21, name: "الجزء الحادي والعشرون", range: "العنكبوت 46 - الأحزاب 30" },
  { id: 22, name: "الجزء الثاني والعشرون", range: "الأحزاب 31 - يس 27" },
  { id: 23, name: "الجزء الثالث والعشرون", range: "يس 28 - الزمر 31" },
  { id: 24, name: "الجزء الرابع والعشرون", range: "الزمر 32 - فصلت 46" },
  { id: 25, name: "الجزء الخامس والعشرون", range: "فصلت 47 - الجاثية 37" },
  { id: 26, name: "الجزء السادس والعشرون", range: "الأحقاف - الذاريات 30" },
  { id: 27, name: "الجزء السابع والعشرون", range: "الذاريات 31 - الحديد 29" },
  { id: 28, name: "الجزء الثامن والعشرون", range: "المجادلة - التحريم" },
  { id: 29, name: "الجزء التاسع والعشرون", range: "الملك - المرسلات" },
  { id: 30, name: "الجزء الثلاثون", range: "النبأ - الناس" }
];

const tajweedTopics = [
  "تلاوة مرتلة",
  "تصحيح تلاوة",
  "أحكام النون الساكنة والتنوين",
  "أحكام الميم الساكنة",
  "المدود",
  "مخارج الحروف",
  "صفات الحروف",
  "القلقلة",
  "التفخيم والترقيق",
  "الوقف والابتداء",
  "مراجعة حفظ"
];

const defaultState = {
  schoolName: "مدرسة عباد الرحمن لتحفيظ القرآن الكريم وتجويده",
  adminPassword: DEFAULT_ADMIN_PASSWORD,
  recordings: [
    {
      id: makeId("rec"),
      juz: 30,
      title: "مثال: تلاوة وتعليم سورة النبأ",
      teacher: "إدارة المدرسة",
      topic: "تلاوة مرتلة",
      riwaya: "حفص عن عاصم",
      notes: "هذا مثال تجريبي. احذفه من لوحة الإدارة وأضف تسجيلاتك الحقيقية.",
      url: "",
      fileId: "",
      createdAt: new Date().toISOString()
    }
  ],
  materials: [
    {
      id: makeId("mat"),
      title: "مثال: ملخص أحكام التجويد",
      category: "التجويد",
      description: "أضف ملفات PDF الخاصة بالمدرسة من لوحة الإدارة أو ضعها في مجلد media/pdf واربطها كرابط مباشر.",
      url: "",
      fileId: "",
      createdAt: new Date().toISOString()
    }
  ],
  progress: []
};

let state = loadState();
let activeObjectUrls = [];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function numberAr(value) {
  return new Intl.NumberFormat("ar").format(value);
}

function dateAr(value) {
  try {
    return new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return "غير محدد";
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(APP_KEY);
    if (!raw) return cloneData(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...cloneData(defaultState),
      ...parsed,
      recordings: Array.isArray(parsed.recordings) ? parsed.recordings : [],
      materials: Array.isArray(parsed.materials) ? parsed.materials : [],
      progress: Array.isArray(parsed.progress) ? parsed.progress : []
    };
  } catch {
    return cloneData(defaultState);
  }
}

function saveState() {
  localStorage.setItem(APP_KEY, JSON.stringify(state));
}

function setRoute(route) {
  location.hash = route;
}

function currentRoute() {
  return location.hash.replace(/^#\/?/, "") || "home";
}

function cleanupObjectUrls() {
  activeObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  activeObjectUrls = [];
}

function pageShell(title, subtitle, body, crumbs = []) {
  const breadcrumbHtml = crumbs.length
    ? `<div class="breadcrumbs">${crumbs.map((c, idx) => c.href ? `<a href="${c.href}">${escapeHtml(c.label)}</a>${idx < crumbs.length - 1 ? "<span>›</span>" : ""}` : `<span>${escapeHtml(c.label)}</span>`).join("")}</div>`
    : "";

  return `
    <section class="page-head">
      ${breadcrumbHtml}
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
    </section>
    ${body}
  `;
}

function updateNav() {
  const route = currentRoute().split("/")[0] || "home";
  $$('[data-nav]').forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === route);
  });
}

function render() {
  cleanupObjectUrls();
  const route = currentRoute();
  const [page, param] = route.split("/");
  const app = $("#app");
  updateNav();
  closeMobileNav();

  if (page === "recordings") app.innerHTML = renderRecordings();
  else if (page === "juz") app.innerHTML = renderJuzPage(Number(param));
  else if (page === "materials") app.innerHTML = renderMaterials();
  else if (page === "progress") app.innerHTML = renderProgress();
  else if (page === "admin") app.innerHTML = renderAdmin();
  else app.innerHTML = renderHome();

  bindPageEvents();
  attachStoredFiles();
  app.focus({ preventScroll: true });
}

function renderHome() {
  const totalRecordings = state.recordings.length;
  const totalMaterials = state.materials.length;
  const totalProgress = state.progress.length;

  return `
    <section class="hero" aria-labelledby="heroTitle">
      <div class="hero-content">
        <span class="kicker">۞ منصة قرآنية تعليمية</span>
        <h1 id="heroTitle">${escapeHtml(state.schoolName)}</h1>
        <p>
          منصة بسيطة وجميلة لتجميع تسجيلات التلاوة والتجويد، رفع مواد PDF،
          وتنظيم متابعة الحفظ والمراجعة بما يناسب الطلاب وأولياء الأمور على الجوال والكمبيوتر.
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/recordings">ابدأ من الأجزاء الثلاثين</a>
          <a class="btn btn-soft" href="#/materials">عرض مواد التجويد</a>
        </div>
      </div>
      <aside class="hero-card" aria-label="آية وشعار">
        <div class="ayah-box">
          <div class="bismillah">بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
          <p>﴿وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا﴾</p>
          <p class="helper">هدفنا: تلاوة صحيحة، حفظ متقن، ومراجعة مستمرة.</p>
        </div>
      </aside>
    </section>

    <section class="stats-grid" aria-label="إحصائيات المنصة">
      <div class="stat-card"><b>${numberAr(30)}</b><span>جزء من القرآن الكريم</span></div>
      <div class="stat-card"><b>${numberAr(totalRecordings)}</b><span>تسجيل مضاف</span></div>
      <div class="stat-card"><b>${numberAr(totalMaterials)}</b><span>ملف أو مادة PDF</span></div>
      <div class="stat-card"><b>${numberAr(totalProgress)}</b><span>سجل متابعة حفظ</span></div>
    </section>

    <section class="section">
      <div class="section-head">
        <div>
          <h2>ماذا تقدّم المنصة؟</h2>
          <p>بنية واضحة، سهلة التصفح، وتناسب استخدام الطلاب من الهاتف.</p>
        </div>
      </div>
      <div class="feature-grid">
        <article class="feature-card">
          <div class="icon-bubble">🎧</div>
          <h3>تسجيلات حسب الجزء</h3>
          <p>كل جزء له صفحة مستقلة، وبداخلها تسجيلات التلاوة والتصحيح وأحكام التجويد.</p>
        </article>
        <article class="feature-card">
          <div class="icon-bubble">📚</div>
          <h3>مواد PDF</h3>
          <p>ارفع ملخصات، أوراق عمل، خطط حفظ، أو كتب تجويد واعرضها مباشرة داخل الموقع.</p>
        </article>
        <article class="feature-card">
          <div class="icon-bubble">✅</div>
          <h3>متابعة حفظ</h3>
          <p>سجل اسم الطالب، الجزء، الحالة، والملاحظات لتسهيل المتابعة اليومية.</p>
        </article>
      </div>
    </section>
  `;
}

function renderRecordings() {
  const search = getParam("q").trim();
  const topic = getParam("topic").trim();
  const juzCards = juzList.map((juz) => {
    const count = state.recordings.filter((r) => Number(r.juz) === juz.id).length;
    return `
      <a class="juz-card" href="#/juz/${juz.id}" aria-label="فتح ${juz.name}">
        <div>
          <div class="juz-number">${numberAr(juz.id)}</div>
          <h3>${escapeHtml(juz.name)}</h3>
          <p>${escapeHtml(juz.range)}</p>
        </div>
        <div class="badge-row">
          <span class="badge">${numberAr(count)} تسجيل</span>
          <span class="badge">افتح الجزء ←</span>
        </div>
      </a>
    `;
  }).join("");

  const filtered = filterRecordings(search, topic, 0);
  const resultHtml = search || topic ? `
    <section class="section">
      <div class="section-head">
        <div>
          <h2>نتائج البحث</h2>
          <p>تم العثور على ${numberAr(filtered.length)} تسجيل.</p>
        </div>
      </div>
      ${renderLessonList(filtered)}
    </section>` : "";

  return pageShell(
    "تسجيلات تجويد القرآن الكريم",
    "اختر الجزء المطلوب من الأجزاء الثلاثين، أو استخدم البحث للوصول إلى تسجيل محدد بسرعة.",
    `
      <section class="search-panel">
        <form id="recordingSearch" class="filters">
          <div class="field">
            <label for="q">بحث</label>
            <input id="q" name="q" value="${escapeHtml(search)}" placeholder="مثال: المدود، سورة النبأ، الشيخ..." />
          </div>
          <div class="field">
            <label for="topic">نوع الدرس</label>
            <select id="topic" name="topic">
              <option value="">كل الأنواع</option>
              ${tajweedTopics.map((t) => `<option value="${escapeHtml(t)}" ${topic === t ? "selected" : ""}>${escapeHtml(t)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="juzJump">انتقال سريع</label>
            <select id="juzJump">
              <option value="">اختر جزء</option>
              ${juzList.map((j) => `<option value="${j.id}">${numberAr(j.id)} - ${escapeHtml(j.name)}</option>`).join("")}
            </select>
          </div>
          <button class="btn btn-dark" type="submit">بحث</button>
        </form>
      </section>
      <section class="juz-grid" aria-label="قائمة الأجزاء الثلاثين">${juzCards}</section>
      ${resultHtml}
    `,
    [{ label: "الرئيسية", href: "#/home" }, { label: "التسجيلات" }]
  );
}

function renderJuzPage(juzNumber) {
  const juz = juzList.find((j) => j.id === juzNumber) || juzList[0];
  const lessons = state.recordings
    .filter((r) => Number(r.juz) === juz.id)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return pageShell(
    `${juz.name}: ${juz.range}`,
    "استمع للتسجيلات التعليمية الخاصة بهذا الجزء، مع ملاحظات التجويد والرواية والشيخ/المعلم.",
    `
      <section class="panel quran-frame">
        <div class="section-head">
          <div>
            <h2>تسجيلات ${escapeHtml(juz.name)}</h2>
            <p>عدد التسجيلات في هذا الجزء: ${numberAr(lessons.length)}</p>
          </div>
          <div class="row-actions">
            <a class="btn btn-outline" href="#/recordings">رجوع للأجزاء</a>
            <a class="btn btn-dark" href="#/admin">إضافة تسجيل</a>
          </div>
        </div>
        ${renderLessonList(lessons)}
      </section>
    `,
    [
      { label: "الرئيسية", href: "#/home" },
      { label: "التسجيلات", href: "#/recordings" },
      { label: juz.name }
    ]
  );
}

function filterRecordings(search = "", topic = "", juz = 0) {
  const q = search.trim().toLowerCase();
  return state.recordings.filter((r) => {
    const matchesJuz = !juz || Number(r.juz) === Number(juz);
    const matchesTopic = !topic || r.topic === topic;
    const haystack = [r.title, r.teacher, r.topic, r.riwaya, r.notes, r.url].join(" ").toLowerCase();
    const matchesQ = !q || haystack.includes(q);
    return matchesJuz && matchesTopic && matchesQ;
  });
}

function renderLessonList(lessons) {
  if (!lessons.length) {
    return `
      <div class="empty-state">
        <strong>لا توجد تسجيلات بعد</strong>
        أضف التسجيلات من لوحة الإدارة، أو ضع الملفات في مجلد <code>media/audio</code> واربطها كرابط مباشر.
      </div>
    `;
  }

  return `<div class="lesson-list">${lessons.map((lesson) => {
    const audioSrc = lesson.url ? escapeHtml(lesson.url) : "";
    const fileAttr = lesson.fileId ? `data-file-id="${escapeHtml(lesson.fileId)}"` : "";
    return `
      <article class="lesson-card">
        <div class="lesson-top">
          <div>
            <h3>${escapeHtml(lesson.title || "تسجيل بدون عنوان")}</h3>
            <div class="meta">
              <span>${escapeHtml(juzList.find((j) => j.id === Number(lesson.juz))?.name || "جزء غير محدد")}</span>
              <span>${escapeHtml(lesson.topic || "غير مصنف")}</span>
              <span>${escapeHtml(lesson.riwaya || "حفص عن عاصم")}</span>
              <span>${escapeHtml(lesson.teacher || "غير محدد")}</span>
            </div>
          </div>
          <span class="badge">${dateAr(lesson.createdAt)}</span>
        </div>
        ${lesson.notes ? `<p class="helper">${escapeHtml(lesson.notes)}</p>` : ""}
        ${audioSrc || lesson.fileId ? `<audio controls preload="none" src="${audioSrc}" ${fileAttr}>متصفحك لا يدعم تشغيل الصوت.</audio>` : `<div class="empty-state"><strong>لا يوجد ملف صوتي</strong>أضف رابط MP3 أو ارفع ملف صوت من لوحة الإدارة.</div>`}
        ${isAdminUnlocked() ? `<div class="row-actions"><button class="btn btn-danger" data-delete-recording="${escapeHtml(lesson.id)}">حذف التسجيل</button></div>` : ""}
      </article>
    `;
  }).join("")}</div>`;
}

function renderMaterials() {
  const category = getParam("category").trim();
  const search = getParam("q").trim().toLowerCase();
  const categories = [...new Set(state.materials.map((m) => m.category).filter(Boolean))];
  const materials = state.materials.filter((m) => {
    const matchesCategory = !category || m.category === category;
    const haystack = [m.title, m.category, m.description, m.url].join(" ").toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    return matchesCategory && matchesSearch;
  }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const body = `
    <section class="search-panel">
      <form id="materialSearch" class="filters">
        <div class="field">
          <label for="materialQ">بحث في المواد</label>
          <input id="materialQ" name="q" value="${escapeHtml(getParam("q"))}" placeholder="مثال: المدود، مخارج الحروف، خطة حفظ..." />
        </div>
        <div class="field">
          <label for="materialCategory">التصنيف</label>
          <select id="materialCategory" name="category">
            <option value="">كل التصنيفات</option>
            ${categories.map((c) => `<option value="${escapeHtml(c)}" ${category === c ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>إضافة مواد</label>
          <a class="btn btn-outline" href="#/admin">لوحة الإدارة</a>
        </div>
        <button class="btn btn-dark" type="submit">بحث</button>
      </form>
    </section>
    ${renderMaterialList(materials)}
  `;

  return pageShell(
    "مواد التجويد وملفات PDF",
    "مكتبة للملخصات، الجداول، أوراق العمل، خطط الحفظ، وأي مادة يحتاجها الطالب.",
    body,
    [{ label: "الرئيسية", href: "#/home" }, { label: "المواد" }]
  );
}

function renderMaterialList(materials) {
  if (!materials.length) {
    return `
      <div class="empty-state">
        <strong>لا توجد مواد مطابقة</strong>
        أضف ملفات PDF من لوحة الإدارة أو اربط ملفات موجودة داخل <code>media/pdf</code>.
      </div>
    `;
  }

  return `<div class="material-list">${materials.map((m) => {
    const src = m.url ? escapeHtml(m.url) : "";
    const fileAttr = m.fileId ? `data-pdf-file-id="${escapeHtml(m.fileId)}"` : "";
    return `
      <article class="material-card">
        <div class="material-top">
          <div>
            <h3>${escapeHtml(m.title || "ملف بدون عنوان")}</h3>
            <div class="meta">
              <span>${escapeHtml(m.category || "عام")}</span>
              <span>${dateAr(m.createdAt)}</span>
            </div>
          </div>
          ${isAdminUnlocked() ? `<button class="btn btn-danger" data-delete-material="${escapeHtml(m.id)}">حذف المادة</button>` : ""}
        </div>
        ${m.description ? `<p class="helper">${escapeHtml(m.description)}</p>` : ""}
        ${(src || m.fileId) ? `
          <div class="row-actions">
            <a class="btn btn-dark pdf-open" href="${src || "#"}" target="_blank" rel="noopener" ${fileAttr}>فتح PDF</a>
            <a class="btn btn-outline pdf-download" href="${src || "#"}" download ${fileAttr}>تحميل</a>
          </div>
          <iframe class="pdf-frame" title="عرض ${escapeHtml(m.title)}" src="${src}" ${fileAttr}></iframe>
        ` : `<div class="empty-state"><strong>لا يوجد ملف PDF</strong>أضف رابط أو ارفع ملف PDF من لوحة الإدارة.</div>`}
      </article>
    `;
  }).join("")}</div>`;
}

function renderProgress() {
  const student = getParam("student").trim();
  const records = state.progress
    .filter((item) => !student || item.student.toLowerCase().includes(student.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const completed = state.progress.filter((p) => p.status === "تم الحفظ").length;
  const percent = state.progress.length ? Math.round((completed / state.progress.length) * 100) : 0;

  return pageShell(
    "متابعة الحفظ والمراجعة",
    "سجل محلي بسيط لمتابعة الطلاب: الحفظ، المراجعة، الاستماع، والملاحظات.",
    `
      <section class="panel">
        <div class="section-head">
          <div>
            <h2>ملخص المتابعة</h2>
            <p>${numberAr(completed)} من ${numberAr(state.progress.length)} سجل مكتمل.</p>
          </div>
          <a class="btn btn-dark" href="#/admin">إضافة سجل</a>
        </div>
        <div class="progress-meter" aria-label="نسبة الإنجاز"><span style="width:${percent}%"></span></div>
        <p class="helper">نسبة الإنجاز: ${numberAr(percent)}٪</p>
      </section>

      <section class="search-panel">
        <form id="progressSearch" class="filters">
          <div class="field">
            <label for="studentSearch">بحث باسم الطالب</label>
            <input id="studentSearch" name="student" value="${escapeHtml(student)}" placeholder="اكتب اسم الطالب" />
          </div>
          <button class="btn btn-dark" type="submit">بحث</button>
          <a class="btn btn-outline" href="#/progress">إلغاء البحث</a>
        </form>
      </section>

      ${renderProgressList(records)}
    `,
    [{ label: "الرئيسية", href: "#/home" }, { label: "متابعة الحفظ" }]
  );
}

function renderProgressList(records) {
  if (!records.length) {
    return `<div class="empty-state"><strong>لا توجد سجلات متابعة</strong>أضف أول سجل من لوحة الإدارة.</div>`;
  }
  return `<div class="progress-list">${records.map((item) => `
    <article class="progress-card">
      <div class="progress-top">
        <div>
          <h3>${escapeHtml(item.student || "طالب بدون اسم")}</h3>
          <div class="meta">
            <span>${escapeHtml(juzList.find((j) => j.id === Number(item.juz))?.name || "جزء غير محدد")}</span>
            <span>${escapeHtml(item.status || "غير محدد")}</span>
            <span>${dateAr(item.createdAt)}</span>
          </div>
        </div>
        ${isAdminUnlocked() ? `<button class="btn btn-danger" data-delete-progress="${escapeHtml(item.id)}">حذف السجل</button>` : ""}
      </div>
      ${item.notes ? `<p class="helper">${escapeHtml(item.notes)}</p>` : ""}
    </article>
  `).join("")}</div>`;
}

function renderAdmin() {
  if (!isAdminUnlocked()) {
    return pageShell(
      "لوحة الإدارة",
      "أدخل كلمة المرور لإضافة التسجيلات وملفات PDF وسجلات المتابعة.",
      `
        <section class="admin-box">
          <form id="loginForm" class="form-grid">
            <div class="field full">
              <label for="adminPassword">كلمة المرور</label>
              <input id="adminPassword" type="password" autocomplete="current-password" placeholder="كلمة المرور الافتراضية 1234" required />
              <p class="helper">هذه حماية بسيطة داخل المتصفح فقط. إذا احتجت حماية حقيقية للمحتوى، ستحتاج Backend.</p>
            </div>
            <button class="btn btn-dark" type="submit">دخول</button>
          </form>
        </section>
      `,
      [{ label: "الرئيسية", href: "#/home" }, { label: "الإدارة" }]
    );
  }

  return pageShell(
    "لوحة الإدارة",
    "أضف التسجيلات، المواد، وسجلات متابعة الحفظ. البيانات تحفظ محلياً داخل المتصفح.",
    `
      <section class="admin-note">
        مهم: هذا مشروع HTML/CSS/JS فقط، لذلك أي رفع من لوحة الإدارة يبقى على نفس الجهاز والمتصفح.
        لجعل الملفات تظهر لكل الناس بعد النشر، ضع الملفات داخل مجلد <strong>media</strong> أو استخدم روابط مباشرة عامة، ثم أضف الروابط في النماذج.
      </section>

      <section class="admin-grid section">
        <div class="admin-box">
          <h2>إضافة تسجيل</h2>
          <form id="recordingForm" class="form-grid">
            <div class="field full">
              <label for="recTitle">عنوان التسجيل</label>
              <input id="recTitle" required placeholder="مثال: أحكام المدود - الجزء الثلاثون" />
            </div>
            <div class="field">
              <label for="recJuz">الجزء</label>
              <select id="recJuz" required>${juzList.map((j) => `<option value="${j.id}">${numberAr(j.id)} - ${escapeHtml(j.name)}</option>`).join("")}</select>
            </div>
            <div class="field">
              <label for="recTopic">نوع الدرس</label>
              <select id="recTopic">${tajweedTopics.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("")}</select>
            </div>
            <div class="field">
              <label for="recTeacher">المعلم / الشيخ</label>
              <input id="recTeacher" placeholder="اسم المعلم" />
            </div>
            <div class="field">
              <label for="recRiwaya">الرواية</label>
              <input id="recRiwaya" value="حفص عن عاصم" />
            </div>
            <div class="field full">
              <label for="recUrl">رابط ملف صوت عام</label>
              <input id="recUrl" placeholder="media/audio/juz-30/lesson.mp3 أو رابط مباشر" />
              <p class="helper">الأفضل للنشر العام: ضع الصوت في مجلد media/audio واكتب مساره هنا.</p>
            </div>
            <div class="field full">
              <label for="recFile">أو ارفع ملف صوت محلي</label>
              <input id="recFile" type="file" accept="audio/*" />
            </div>
            <div class="field full">
              <label for="recNotes">ملاحظات</label>
              <textarea id="recNotes" placeholder="ملاحظات على الأداء، أحكام التجويد، واجب الطالب..."></textarea>
            </div>
            <button class="btn btn-dark" type="submit">حفظ التسجيل</button>
          </form>
        </div>

        <div class="admin-box">
          <h2>إضافة مادة PDF</h2>
          <form id="materialForm" class="form-grid">
            <div class="field full">
              <label for="matTitle">عنوان المادة</label>
              <input id="matTitle" required placeholder="مثال: ملخص أحكام النون الساكنة" />
            </div>
            <div class="field">
              <label for="matCategory">التصنيف</label>
              <input id="matCategory" placeholder="التجويد / خطط حفظ / أوراق عمل" />
            </div>
            <div class="field">
              <label for="matUrl">رابط PDF عام</label>
              <input id="matUrl" placeholder="media/pdf/tajweed.pdf أو رابط مباشر" />
            </div>
            <div class="field full">
              <label for="matFile">أو ارفع PDF محلي</label>
              <input id="matFile" type="file" accept="application/pdf,.pdf" />
            </div>
            <div class="field full">
              <label for="matDescription">وصف مختصر</label>
              <textarea id="matDescription" placeholder="ماذا تحتوي هذه المادة؟ ولأي مستوى؟"></textarea>
            </div>
            <button class="btn btn-dark" type="submit">حفظ المادة</button>
          </form>
        </div>
      </section>

      <section class="admin-grid section">
        <div class="admin-box">
          <h2>إضافة متابعة طالب</h2>
          <form id="progressForm" class="form-grid">
            <div class="field full">
              <label for="progressStudent">اسم الطالب</label>
              <input id="progressStudent" required placeholder="اسم الطالب" />
            </div>
            <div class="field">
              <label for="progressJuz">الجزء</label>
              <select id="progressJuz">${juzList.map((j) => `<option value="${j.id}">${numberAr(j.id)} - ${escapeHtml(j.name)}</option>`).join("")}</select>
            </div>
            <div class="field">
              <label for="progressStatus">الحالة</label>
              <select id="progressStatus">
                <option>استماع</option>
                <option>قيد الحفظ</option>
                <option>تم الحفظ</option>
                <option>مراجعة</option>
                <option>يحتاج تصحيح</option>
              </select>
            </div>
            <div class="field full">
              <label for="progressNotes">ملاحظات</label>
              <textarea id="progressNotes" placeholder="ملاحظات المعلم أو الواجب القادم"></textarea>
            </div>
            <button class="btn btn-dark" type="submit">حفظ المتابعة</button>
          </form>
        </div>

        <div class="admin-box">
          <h2>إعدادات ونسخ احتياطي</h2>
          <form id="settingsForm" class="form-grid">
            <div class="field full">
              <label for="schoolName">اسم المدرسة</label>
              <input id="schoolName" value="${escapeHtml(state.schoolName)}" required />
            </div>
            <div class="field full">
              <label for="newPassword">تغيير كلمة مرور الإدارة</label>
              <input id="newPassword" type="password" placeholder="اتركه فارغاً إذا لا تريد التغيير" />
            </div>
            <button class="btn btn-dark" type="submit">حفظ الإعدادات</button>
          </form>
          <div class="divider"></div>
          <div class="row-actions">
            <button class="btn btn-outline" id="exportData">تصدير JSON</button>
            <label class="btn btn-outline" for="importData">استيراد JSON</label>
            <input class="hidden" id="importData" type="file" accept="application/json,.json" />
            <button class="btn btn-danger" id="resetData">إرجاع للوضع التجريبي</button>
            <button class="btn btn-outline" id="logoutAdmin">تسجيل خروج</button>
          </div>
          <p class="helper">التصدير يحفظ البيانات النصية والروابط. الملفات الكبيرة المرفوعة محلياً قد لا تنتقل مع JSON.</p>
        </div>
      </section>
    `,
    [{ label: "الرئيسية", href: "#/home" }, { label: "الإدارة" }]
  );
}

function getParam(name) {
  const route = currentRoute();
  const queryIndex = route.indexOf("?");
  if (queryIndex === -1) return "";
  const params = new URLSearchParams(route.slice(queryIndex + 1));
  return params.get(name) || "";
}

function setPageQuery(base, values) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  setRoute(qs ? `${base}?${qs}` : base);
}

function isAdminUnlocked() {
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

function bindPageEvents() {
  const recordingSearch = $("#recordingSearch");
  if (recordingSearch) {
    recordingSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      setPageQuery("recordings", {
        q: $("#q").value.trim(),
        topic: $("#topic").value
      });
    });
  }

  const juzJump = $("#juzJump");
  if (juzJump) {
    juzJump.addEventListener("change", () => {
      if (juzJump.value) setRoute(`juz/${juzJump.value}`);
    });
  }

  const materialSearch = $("#materialSearch");
  if (materialSearch) {
    materialSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      setPageQuery("materials", {
        q: $("#materialQ").value.trim(),
        category: $("#materialCategory").value
      });
    });
  }

  const progressSearch = $("#progressSearch");
  if (progressSearch) {
    progressSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      setPageQuery("progress", { student: $("#studentSearch").value.trim() });
    });
  }

  const loginForm = $("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const password = $("#adminPassword").value;
      if (password === state.adminPassword) {
        sessionStorage.setItem(ADMIN_KEY, "true");
        render();
      } else {
        showAlert(loginForm, "كلمة المرور غير صحيحة.", "danger");
      }
    });
  }

  const recordingForm = $("#recordingForm");
  if (recordingForm) recordingForm.addEventListener("submit", handleRecordingSubmit);

  const materialForm = $("#materialForm");
  if (materialForm) materialForm.addEventListener("submit", handleMaterialSubmit);

  const progressForm = $("#progressForm");
  if (progressForm) progressForm.addEventListener("submit", handleProgressSubmit);

  const settingsForm = $("#settingsForm");
  if (settingsForm) settingsForm.addEventListener("submit", handleSettingsSubmit);

  const exportBtn = $("#exportData");
  if (exportBtn) exportBtn.addEventListener("click", exportData);

  const importInput = $("#importData");
  if (importInput) importInput.addEventListener("change", importData);

  const resetBtn = $("#resetData");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      const confirmed = confirm("هل تريد حذف البيانات الحالية وإرجاع البيانات التجريبية؟");
      if (!confirmed) return;
      state = cloneData(defaultState);
      saveState();
      await clearFiles();
      render();
    });
  }

  const logoutBtn = $("#logoutAdmin");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem(ADMIN_KEY);
      render();
    });
  }

  $$('[data-delete-recording]').forEach((btn) => {
    btn.addEventListener("click", async () => deleteRecording(btn.dataset.deleteRecording));
  });
  $$('[data-delete-material]').forEach((btn) => {
    btn.addEventListener("click", async () => deleteMaterial(btn.dataset.deleteMaterial));
  });
  $$('[data-delete-progress]').forEach((btn) => {
    btn.addEventListener("click", () => deleteProgress(btn.dataset.deleteProgress));
  });
}

async function handleRecordingSubmit(event) {
  event.preventDefault();
  const file = $("#recFile").files[0];
  let fileId = "";
  if (file) {
    fileId = makeId("audio");
    await putFile(fileId, file);
  }

  state.recordings.push({
    id: makeId("rec"),
    juz: Number($("#recJuz").value),
    title: $("#recTitle").value.trim(),
    teacher: $("#recTeacher").value.trim() || "إدارة المدرسة",
    topic: $("#recTopic").value,
    riwaya: $("#recRiwaya").value.trim() || "حفص عن عاصم",
    notes: $("#recNotes").value.trim(),
    url: $("#recUrl").value.trim(),
    fileId,
    createdAt: new Date().toISOString()
  });
  saveState();
  event.target.reset();
  showAlert(event.target, "تم حفظ التسجيل بنجاح.", "success");
}

async function handleMaterialSubmit(event) {
  event.preventDefault();
  const file = $("#matFile").files[0];
  let fileId = "";
  if (file) {
    fileId = makeId("pdf");
    await putFile(fileId, file);
  }

  state.materials.push({
    id: makeId("mat"),
    title: $("#matTitle").value.trim(),
    category: $("#matCategory").value.trim() || "عام",
    description: $("#matDescription").value.trim(),
    url: $("#matUrl").value.trim(),
    fileId,
    createdAt: new Date().toISOString()
  });
  saveState();
  event.target.reset();
  showAlert(event.target, "تم حفظ المادة بنجاح.", "success");
}

function handleProgressSubmit(event) {
  event.preventDefault();
  state.progress.push({
    id: makeId("progress"),
    student: $("#progressStudent").value.trim(),
    juz: Number($("#progressJuz").value),
    status: $("#progressStatus").value,
    notes: $("#progressNotes").value.trim(),
    createdAt: new Date().toISOString()
  });
  saveState();
  event.target.reset();
  showAlert(event.target, "تم حفظ سجل المتابعة.", "success");
}

function handleSettingsSubmit(event) {
  event.preventDefault();
  state.schoolName = $("#schoolName").value.trim() || defaultState.schoolName;
  const newPassword = $("#newPassword").value.trim();
  if (newPassword) state.adminPassword = newPassword;
  saveState();
  showAlert(event.target, "تم حفظ الإعدادات.", "success");
}

function showAlert(anchor, message, type = "success") {
  const old = anchor.parentElement.querySelector(".alert");
  if (old) old.remove();
  const div = document.createElement("div");
  div.className = `alert alert-${type === "danger" ? "danger" : "success"}`;
  div.textContent = message;
  anchor.insertAdjacentElement("afterend", div);
  setTimeout(() => div.remove(), 4200);
}

async function deleteRecording(id) {
  const item = state.recordings.find((r) => r.id === id);
  if (!item || !confirm("حذف هذا التسجيل؟")) return;
  if (item.fileId) await deleteFile(item.fileId);
  state.recordings = state.recordings.filter((r) => r.id !== id);
  saveState();
  render();
}

async function deleteMaterial(id) {
  const item = state.materials.find((m) => m.id === id);
  if (!item || !confirm("حذف هذه المادة؟")) return;
  if (item.fileId) await deleteFile(item.fileId);
  state.materials = state.materials.filter((m) => m.id !== id);
  saveState();
  render();
}

function deleteProgress(id) {
  if (!confirm("حذف سجل المتابعة؟")) return;
  state.progress = state.progress.filter((p) => p.id !== id);
  saveState();
  render();
}

function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "مدرسة عباد الرحمن",
    note: "هذا الملف يحفظ البيانات النصية والروابط. الملفات المحلية الكبيرة لا تنتقل تلقائياً.",
    state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ibad-alrahman-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const importedState = parsed.state || parsed;
    state = {
      ...cloneData(defaultState),
      ...importedState,
      recordings: Array.isArray(importedState.recordings) ? importedState.recordings : [],
      materials: Array.isArray(importedState.materials) ? importedState.materials : [],
      progress: Array.isArray(importedState.progress) ? importedState.progress : []
    };
    saveState();
    render();
  } catch (error) {
    alert("تعذر استيراد الملف. تأكد أنه JSON صحيح.");
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putFile(id, file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ blob: file, name: file.name, type: file.type, savedAt: new Date().toISOString() }, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getFile(id) {
  if (!id) return null;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function deleteFile(id) {
  if (!id) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function clearFiles() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function attachStoredFiles() {
  const fileElements = $$('[data-file-id]');
  for (const el of fileElements) {
    const item = await getFile(el.dataset.fileId);
    if (!item?.blob) continue;
    const url = URL.createObjectURL(item.blob);
    activeObjectUrls.push(url);
    el.src = url;
  }

  const pdfElements = $$('[data-pdf-file-id]');
  const cache = new Map();
  for (const el of pdfElements) {
    const id = el.dataset.pdfFileId;
    let url = cache.get(id);
    if (!url) {
      const item = await getFile(id);
      if (!item?.blob) continue;
      url = URL.createObjectURL(item.blob);
      cache.set(id, url);
      activeObjectUrls.push(url);
    }
    el.href = url;
    el.src = url;
  }
}

function setupShellEvents() {
  const toggle = $("#navToggle");
  const links = $("#mainNav");
  toggle?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  const toTop = $("#toTop");
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("show", window.scrollY > 500);
  });
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function closeMobileNav() {
  const toggle = $("#navToggle");
  const links = $("#mainNav");
  links?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
}

function registerServiceWorker() {
  if (location.protocol.startsWith("http") && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  setupShellEvents();
  registerServiceWorker();
  render();
});

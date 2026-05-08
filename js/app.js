// ===========================
// app.js — Application Logic
// EmpTrack Industrial Employee Registration System
// ===========================

// ===== STATE =====
let currentFilter = 'All';
let editingId = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  setDateBadge();
  setupNavigation();
  setupSidebarToggle();
  renderDashboard();
  renderEmployeeTable();
  populateFilterBtns();
  renderStats();
});

// ===== NAVIGATION =====
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const page = item.dataset.page;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('page-' + page).classList.add('active');
      document.getElementById('pageTitle').textContent = item.textContent.trim().replace(/^[^\w]+/, '');
      if (page === 'dashboard') renderDashboard();
      if (page === 'employees') renderEmployeeTable();
      if (page === 'stats') renderStats();
      if (page === 'register') prefillId();
      // close sidebar on mobile after click
      if (window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
    });
  });
}

function setupSidebarToggle() {
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

function setDateBadge() {
  const now = new Date();
  document.getElementById('dateBadge').textContent = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ===== DASHBOARD =====
function renderDashboard() {
  const stats = DB.getStats();
  const depts = DB.getDepts();
  document.getElementById('stat-total').textContent  = stats.total;
  document.getElementById('stat-avg').textContent    = '₹' + stats.avg.toLocaleString('en-IN');
  document.getElementById('stat-dept').textContent   = Object.keys(depts).length;
  const last = DB.getAll().slice(-1)[0];
  document.getElementById('stat-latest').textContent = last ? '#' + last.id : '—';

  // Recent employees
  const recent = DB.getAll().slice(-5).reverse();
  const colors = ['av-blue', 'av-green', 'av-amber', 'av-coral'];
  document.getElementById('recent-list').innerHTML = recent.map((e, i) => `
    <div class="emp-row">
      <div class="avatar ${colors[i % colors.length]}">${initials(e.name)}</div>
      <div class="emp-info">
        <div class="emp-name">${e.name}</div>
        <div class="emp-sub">${e.desig} · ${e.dept}</div>
      </div>
      <div class="emp-salary">₹${e.salary.toLocaleString('en-IN')}</div>
    </div>`).join('');

  // Dept chart
  const max = Math.max(...Object.values(depts), 1);
  const barColors = ['var(--blue)', 'var(--green)', 'var(--amber)', 'var(--coral)', '#a07cf0', '#00c8dc'];
  let i = 0;
  document.getElementById('dept-chart').innerHTML = Object.entries(depts).map(([d, c]) => `
    <div class="dept-row">
      <div class="dept-row-header"><span>${d}</span><span>${c} employee${c > 1 ? 's' : ''}</span></div>
      <div class="dept-bar-track">
        <div class="dept-bar-fill" style="width:${Math.round(c/max*100)}%;background:${barColors[i++ % barColors.length]}"></div>
      </div>
    </div>`).join('');
}

// ===== REGISTER =====
function prefillId() {
  document.getElementById('f-id').value = 'EMP-' + DB.nextId;
}

function registerEmployee() {
  const name   = document.getElementById('f-name').value.trim();
  const dept   = document.getElementById('f-dept').value;
  const desig  = document.getElementById('f-desig').value.trim();
  const salary = parseFloat(document.getElementById('f-salary').value);
  const email  = document.getElementById('f-email').value.trim();
  const phone  = document.getElementById('f-phone').value.trim();
  const msg    = document.getElementById('form-msg');

  if (!name || !dept || !desig || !salary || !email || !phone) {
    msg.className = 'form-msg error';
    msg.textContent = '✕ Please fill in all required fields.';
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    msg.className = 'form-msg error';
    msg.textContent = '✕ Phone must be 10 digits.';
    return;
  }

  const emp = DB.add({ name, dept, desig, salary, email, phone });
  msg.className = 'form-msg success';
  msg.textContent = `✔ Employee "${emp.name}" registered with ID ${emp.id}`;
  clearForm();
  prefillId();
  showToast('Employee registered! ID: ' + emp.id, 'success');
  renderDashboard();
  renderEmployeeTable();
  populateFilterBtns();
  renderStats();
}

function clearForm() {
  ['f-name','f-dept','f-desig','f-salary','f-email','f-phone'].forEach(id => {
    const el = document.getElementById(id);
    el.tagName === 'SELECT' ? el.selectedIndex = 0 : (el.value = '');
  });
  document.getElementById('form-msg').textContent = '';
}

// ===== EMPLOYEE TABLE =====
function populateFilterBtns() {
  const depts = ['All', ...Object.keys(DB.getDepts())];
  const container = document.getElementById('dept-filters');
  container.innerHTML = depts.map(d => `
    <button class="filter-btn ${d === currentFilter ? 'active' : ''}" onclick="filterEmployees('${d}', this)">${d}</button>
  `).join('');
}

function filterEmployees(dept, btn) {
  currentFilter = dept;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('nameFilter').value = '';
  renderEmployeeTable();
}

function applyFilter() {
  renderEmployeeTable();
}

function renderEmployeeTable() {
  const nameQ = document.getElementById('nameFilter')?.value.toLowerCase() || '';
  let list = currentFilter === 'All' ? DB.getAll() : DB.getByDept(currentFilter);
  if (nameQ) list = list.filter(e => e.name.toLowerCase().includes(nameQ));

  const tbody = document.getElementById('emp-tbody');
  const noData = document.getElementById('no-data');

  if (!list.length) {
    tbody.innerHTML = '';
    noData.style.display = 'block';
    return;
  }
  noData.style.display = 'none';

  tbody.innerHTML = list.map(e => `
    <tr>
      <td><span style="font-family:monospace;color:var(--text3);font-size:12px">#${e.id}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar av-blue" style="width:30px;height:30px;font-size:10px">${initials(e.name)}</div>
          <span style="font-weight:500">${e.name}</span>
        </div>
      </td>
      <td><span class="dept-badge ${deptClass(e.dept)}">${e.dept}</span></td>
      <td style="color:var(--text2)">${e.desig}</td>
      <td style="font-weight:500;color:var(--green)">₹${e.salary.toLocaleString('en-IN')}</td>
      <td style="color:var(--text3);font-size:12px">${e.email}</td>
      <td>
        <button class="btn-icon edit" onclick="openEdit(${e.id})" title="Edit">✎</button>
        <button class="btn-icon del"  onclick="deleteEmployee(${e.id})" title="Delete">✕</button>
      </td>
    </tr>`).join('');
}

// ===== EDIT MODAL =====
function openEdit(id) {
  const e = DB.getById(id);
  if (!e) return;
  editingId = id;
  document.getElementById('m-name').value  = e.name;
  document.getElementById('m-desig').value = e.desig;
  document.getElementById('m-salary').value = e.salary;
  document.getElementById('m-email').value  = e.email;
  document.getElementById('m-phone').value  = e.phone;
  const sel = document.getElementById('m-dept');
  [...sel.options].forEach(o => o.selected = o.value === e.dept);
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  editingId = null;
}

function saveEdit() {
  if (!editingId) return;
  const data = {
    name:  document.getElementById('m-name').value.trim(),
    dept:  document.getElementById('m-dept').value,
    desig: document.getElementById('m-desig').value.trim(),
    salary: parseFloat(document.getElementById('m-salary').value),
    email: document.getElementById('m-email').value.trim(),
    phone: document.getElementById('m-phone').value.trim(),
  };
  DB.update(editingId, data);
  closeModal();
  renderEmployeeTable();
  renderDashboard();
  populateFilterBtns();
  renderStats();
  showToast('Employee updated successfully', 'success');
}

function deleteEmployee(id) {
  const e = DB.getById(id);
  if (!e) return;
  if (!confirm(`Delete "${e.name}"? This cannot be undone.`)) return;
  DB.delete(id);
  renderEmployeeTable();
  renderDashboard();
  populateFilterBtns();
  renderStats();
  showToast('Employee removed', 'error');
}

// ===== SEARCH PAGE =====
function switchSearch(type, btn) {
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['id', 'dept', 'name'].forEach(t => {
    document.getElementById('search-' + t).style.display = t === type ? 'flex' : 'none';
  });
  document.getElementById('search-results').innerHTML = '';
}

function searchById() {
  const id = parseInt(document.getElementById('sid-input').value);
  const e = DB.getById(id);
  renderSearchResults(e ? [e] : [], `No employee found with ID ${id}`);
}

function searchByDept() {
  const d = document.getElementById('sdept-input').value;
  if (!d) return;
  renderSearchResults(DB.getByDept(d), `No employees found in "${d}" department`);
}

function searchByName() {
  const n = document.getElementById('sname-input').value.trim();
  if (!n) return;
  renderSearchResults(DB.getByName(n), `No employees found matching "${n}"`);
}

function renderSearchResults(list, emptyMsg) {
  const container = document.getElementById('search-results');
  if (!list.length) {
    container.innerHTML = `<p style="color:var(--text3);font-size:13px;margin-top:16px">${emptyMsg}</p>`;
    return;
  }
  container.innerHTML = list.map(e => `
    <div class="result-card">
      <div class="result-name">${e.name} <span style="font-size:13px;color:var(--text3);font-weight:400">#${e.id}</span></div>
      <div class="result-fields">
        <div class="result-field">Department<span>${e.dept}</span></div>
        <div class="result-field">Designation<span>${e.desig}</span></div>
        <div class="result-field">Salary<span style="color:var(--green)">₹${e.salary.toLocaleString('en-IN')}</span></div>
        <div class="result-field">Email<span>${e.email}</span></div>
        <div class="result-field">Phone<span>${e.phone}</span></div>
      </div>
    </div>`).join('');
}

// ===== STATS =====
function renderStats() {
  const s = DB.getStats();
  const depts = DB.getDepts();
  const allEmps = DB.getAll();

  // Salary summary
  document.getElementById('salary-stats').innerHTML = [
    { k: 'Total Employees', v: s.total },
    { k: 'Total Salary Budget', v: '₹' + (s.sum || 0).toLocaleString('en-IN') },
    { k: 'Average Salary', v: '₹' + s.avg.toLocaleString('en-IN') },
    { k: 'Highest Salary', v: '₹' + (s.max || 0).toLocaleString('en-IN') },
    { k: 'Lowest Salary', v: '₹' + (s.min || 0).toLocaleString('en-IN') },
  ].map(r => `
    <div class="salary-row">
      <span class="salary-key">${r.k}</span>
      <span class="salary-val">${r.v}</span>
    </div>`).join('');

  // Department headcount bars
  const maxCount = Math.max(...Object.values(depts), 1);
  const colors = ['var(--blue)', 'var(--green)', 'var(--amber)', 'var(--coral)', '#a07cf0', '#00c8dc', '#c8aa64'];
  let ci = 0;
  document.getElementById('dept-bars').innerHTML = Object.entries(depts).map(([d, c]) => `
    <div class="db-row">
      <div class="db-header"><span>${d}</span><span>${c} employee${c > 1 ? 's' : ''}</span></div>
      <div class="db-track">
        <div class="db-fill" style="width:${Math.round(c/maxCount*100)}%;background:${colors[ci++ % colors.length]}"></div>
      </div>
    </div>`).join('');

  // Avg salary by department
  const deptSalary = {};
  allEmps.forEach(e => {
    if (!deptSalary[e.dept]) deptSalary[e.dept] = [];
    deptSalary[e.dept].push(e.salary);
  });
  const deptAvg = Object.entries(deptSalary).map(([d, s]) => ({
    dept: d, avg: Math.round(s.reduce((a,b)=>a+b,0)/s.length)
  })).sort((a,b) => b.avg - a.avg);
  const maxAvg = Math.max(...deptAvg.map(d => d.avg), 1);
  ci = 0;
  document.getElementById('salary-dept-chart').innerHTML = deptAvg.map(d => `
    <div class="sdept-row">
      <span class="sdept-name">${d.dept}</span>
      <div class="sdept-bar-wrap">
        <div class="sdept-bar" style="width:${Math.max(Math.round(d.avg/maxAvg*100), 15)}%;background:${colors[ci++ % colors.length]}">
          ₹${d.avg.toLocaleString('en-IN')}
        </div>
      </div>
      <span class="sdept-count">${deptSalary[d.dept].length} emp</span>
    </div>`).join('');
}

// ===== UTILS =====
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function deptClass(dept) {
  const map = {
    Engineering: 'db-eng', HR: 'db-hr', Finance: 'db-fin',
    Marketing: 'db-mkt', Operations: 'db-ops', Sales: 'db-sal', Legal: 'db-leg'
  };
  return map[dept] || 'db-def';
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => { t.className = 'toast'; }, 3000);
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', e => {
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.getElementById('menuToggle');
  if (window.innerWidth <= 900 && !sidebar.contains(e.target) && e.target !== toggle) {
    sidebar.classList.remove('open');
  }
});

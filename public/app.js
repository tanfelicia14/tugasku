const API = '/api/tugas';
let daftarTugas = [];

const daftarEl = document.getElementById('daftar');
const mkEl = document.getElementById('mk');
const judulEl = document.getElementById('judul');
const deadlineEl = document.getElementById('deadline');

// Mencegah XSS: teks dari user tidak boleh dibaca sebagai HTML
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatTanggal(iso) {
  return new Date(iso).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

// READ
async function loadTugas() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Gagal memuat data');
    daftarTugas = await res.json();
    render();
  } catch (err) {
    daftarEl.innerHTML = `<div class="alert alert-danger">${escapeHtml(err.message)}</div>`;
  }
}

function render() {
  if (daftarTugas.length === 0) {
    daftarEl.innerHTML = '<div class="text-muted text-center py-4">Belum ada tugas. Tambahkan yang pertama!</div>';
    return;
  }

  daftarEl.innerHTML = daftarTugas.map((t) => {
    const selesai = t.status === 'selesai';
    let badge = '';
    if (selesai) badge = '<span class="badge bg-success">Selesai</span>';
    else if (t.terlambat) badge = '<span class="badge bg-dark">Terlambat</span>';
    else if (t.urgent) badge = '<span class="badge bg-danger">Urgent</span>';

    return `
      <div class="card mb-2 ${t.urgent ? 'border-danger' : ''}">
        <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <div class="small text-muted">${escapeHtml(t.mata_kuliah)}</div>
            <div class="fw-bold ${selesai ? 'text-decoration-line-through text-muted' : ''}">
              ${escapeHtml(t.judul)}
            </div>
            <div class="small">Deadline: ${formatTanggal(t.deadline)} ${badge}</div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm ${selesai ? 'btn-outline-secondary' : 'btn-outline-success'}"
                    onclick="tandaiSelesai(${t.id})">
              ${selesai ? 'Batalkan' : 'Selesai'}
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="hapusTugas(${t.id})">Hapus</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

// CREATE
async function tambahTugas() {
  const mata_kuliah = mkEl.value.trim();
  const judul = judulEl.value.trim();
  const deadline = deadlineEl.value;

  if (!mata_kuliah || !judul || !deadline) {
    alert('Semua field wajib diisi');
    return;
  }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // toISOString() menyertakan zona waktu, jadi jam tidak meleset di database
      body: JSON.stringify({ mata_kuliah, judul, deadline: new Date(deadline).toISOString() }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Gagal menambah tugas');

    mkEl.value = '';
    judulEl.value = '';
    deadlineEl.value = '';
    loadTugas();
  } catch (err) {
    alert(err.message);
  }
}

// UPDATE (toggle selesai / belum)
async function tandaiSelesai(id) {
  const t = daftarTugas.find((x) => x.id === id);
  if (!t) return;

  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mata_kuliah: t.mata_kuliah,
        judul: t.judul,
        deadline: t.deadline,
        status: t.status === 'selesai' ? 'belum' : 'selesai',
      }),
    });
    if (!res.ok) throw new Error('Gagal mengubah status');
    loadTugas();
  } catch (err) {
    alert(err.message);
  }
}

// DELETE
async function hapusTugas(id) {
  if (!confirm('Hapus tugas ini?')) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Gagal menghapus');
    loadTugas();
  } catch (err) {
    alert(err.message);
  }
}

document.getElementById('btnTambah').addEventListener('click', tambahTugas);
loadTugas();
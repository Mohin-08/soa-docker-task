
import { useCallback, useEffect, useState, type FormEvent } from 'react';

type LearningModule = {
  id: number;
  moduleTitle: string;
  subjectArea: string;
  durationHours: number;
  published: boolean;
};

type ModuleForm = {
  moduleTitle: string;
  subjectArea: string;
  durationHours: string;
  published: string;
};

const API_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8999/api/learning-modules'
).trim();

const emptyForm: ModuleForm = {
  moduleTitle: '',
  subjectArea: '',
  durationHours: '',
  published: 'false',
};

async function readError(response: Response): Promise<string> {
  const body = await response.text();

  if (!body) {
    return `Request failed with status ${response.status}`;
  }

  try {
    const parsed = JSON.parse(body);

    if (Array.isArray(parsed.errors) && parsed.errors.length > 0) {
      const fieldErrors = parsed.errors
        .map((e: { defaultMessage?: string }) => e.defaultMessage)
        .filter(Boolean)
        .join(', ');
      if (fieldErrors) return fieldErrors;
    }

    return (
      parsed.message ||
      parsed.detail ||
      parsed.title ||
      parsed.error ||
      body
    );
  } catch {
    return body;
  }
}

function App() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [form, setForm] = useState<ModuleForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadModules = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const data: LearningModule[] = await response.json();
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not load modules. ${err.message}`
          : 'Could not connect to the backend.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadModules();
  }, [loadModules]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function updateField(
    field: keyof ModuleForm,
    value: string,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEditing(module: LearningModule) {
    setEditingId(module.id);
    setForm({
      moduleTitle: module.moduleTitle,
      subjectArea: module.subjectArea,
      durationHours: String(module.durationHours),
      published: String(module.published),
    });
    setError('');
    setSuccess('');

    document
      .getElementById('module-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const title = form.moduleTitle.trim();
    const subject = form.subjectArea.trim();
    const duration = Number(form.durationHours);

    if (!title || !subject || !form.durationHours) {
      setError('Please complete all required fields.');
      return;
    }

    if (title.length > 20) {
      setError('Module title must not exceed 20 characters.');
      return;
    }

    if (subject.length > 25) {
      setError('Subject area must not exceed 25 characters.');
      return;
    }

    if (!Number.isInteger(duration) || duration < 1 || duration > 50) {
      setError('Duration must be a whole number between 1 and 50 hours.');
      return;
    }

    const payload = {
      moduleTitle: title,
      subjectArea: subject,
      durationHours: duration,
      published: form.published === 'true',
    };

    setSaving(true);

    try {
      const response = await fetch(
        editingId === null ? API_URL : `${API_URL}/${editingId}`,
        {
          method: editingId === null ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      setSuccess(
        editingId === null
          ? 'Learning module added successfully.'
          : 'Learning module updated successfully.',
      );

      resetForm();
      await loadModules();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save the learning module.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteModule(module: LearningModule) {
    const confirmed = window.confirm(
      `Delete "${module.moduleTitle}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(module.id);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/${module.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      if (editingId === module.id) resetForm();

      setSuccess(`"${module.moduleTitle}" was deleted successfully.`);
      await loadModules();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete the learning module.',
      );
    } finally {
      setDeletingId(null);
    }
  }

  const publishedCount = modules.filter((module) => module.published).length;

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#home">
            <span className="brand-icon">L</span>
            LearnSpace
          </a>

          <div className="d-flex gap-3">
            <a className="nav-link text-white" href="#modules">
              All Modules
            </a>
            <a className="nav-link text-white" href="#module-form">
              Add Module
            </a>
          </div>
        </div>
      </nav>

      <main id="home" className="container py-4 py-md-5">
        <section className="hero-section mb-4 mb-md-5">
          <div>
            <span className="eyebrow">LEARNING MANAGEMENT</span>
            <h1>Manage your learning modules.</h1>
            <p>
              Create, organize, update, and publish your learning content
              from one simple dashboard.
            </p>
            <a className="btn btn-light fw-semibold mt-2" href="#module-form">
              + Add a module
            </a>
          </div>
          <div className="hero-decoration" aria-hidden="true">
            <span>✦</span>
            <div className="hero-book">📚</div>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            <strong>Something went wrong.</strong> {error}
            <button
              type="button"
              className="btn-close"
              aria-label="Dismiss error"
              onClick={() => setError('')}
            />
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible" role="status">
            {success}
            <button
              type="button"
              className="btn-close"
              aria-label="Dismiss message"
              onClick={() => setSuccess('')}
            />
          </div>
        )}

        <section className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="stat-card">
              <div className="stat-icon purple">▤</div>
              <div>
                <p>Total modules</p>
                <h2>{modules.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="stat-card">
              <div className="stat-icon green">✓</div>
              <div>
                <p>Published</p>
                <h2>{publishedCount}</h2>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="stat-card">
              <div className="stat-icon orange">◷</div>
              <div>
                <p>Drafts</p>
                <h2>{modules.length - publishedCount}</h2>
              </div>
            </div>
          </div>
        </section>

        <section id="module-form" className="content-card mb-4">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                {editingId === null ? 'CREATE CONTENT' : 'EDIT CONTENT'}
              </span>
              <h2>
                {editingId === null ? 'Add a learning module' : 'Update module'}
              </h2>
              <p>Fields marked with * are required.</p>
            </div>
            {editingId !== null && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="moduleTitle" className="form-label">
                  Module title *
                </label>
                <input
                  id="moduleTitle"
                  className="form-control"
                  type="text"
                  value={form.moduleTitle}
                  onChange={(e) => updateField('moduleTitle', e.target.value)}
                  placeholder="e.g. Introduction to Java"
                  maxLength={20}
                  required
                />
                <div className="form-text">
                  {form.moduleTitle.length}/20 characters
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="subjectArea" className="form-label">
                  Subject area *
                </label>
                <input
                  id="subjectArea"
                  className="form-control"
                  type="text"
                  value={form.subjectArea}
                  onChange={(e) => updateField('subjectArea', e.target.value)}
                  placeholder="e.g. Computer Science"
                  maxLength={25}
                  required
                />
                <div className="form-text">
                  {form.subjectArea.length}/25 characters
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="durationHours" className="form-label">
                  Duration (hours) *
                </label>
                <input
                  id="durationHours"
                  className="form-control"
                  type="number"
                  value={form.durationHours}
                  onChange={(e) => updateField('durationHours', e.target.value)}
                  placeholder="Enter hours"
                  min={1}
                  max={50}
                  step={1}
                  required
                />
                <div className="form-text">Enter a whole number from 1 to 50.</div>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="published" className="form-label">
                  Publication status *
                </label>
                <select
                  id="published"
                  className="form-select"
                  value={form.published}
                  onChange={(e) => updateField('published', e.target.value)}
                  required
                >
                  <option value="false">Draft — not published</option>
                  <option value="true">Published</option>
                </select>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button className="btn btn-primary px-4" type="submit" disabled={saving}>
                {saving
                  ? 'Saving...'
                  : editingId === null
                    ? '+ Create module'
                    : 'Save changes'}
              </button>
              <button
                className="btn btn-outline-secondary px-4"
                type="button"
                onClick={resetForm}
                disabled={saving}
              >
                Clear form
              </button>
            </div>
          </form>
        </section>

        <section id="modules" className="content-card">
          <div className="section-heading modules-heading">
            <div>
              <span className="eyebrow">YOUR CONTENT</span>
              <h2>Learning modules</h2>
              <p>View and manage all your learning modules.</p>
            </div>
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={() => void loadModules()}
              disabled={loading}
            >
              {loading ? 'Loading...' : '↻ Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading modules...</span>
              </div>
              <p>Loading your modules...</p>
            </div>
          ) : modules.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📘</div>
              <h3>No learning modules yet</h3>
              <p>Create your first module using the form above.</p>
              <a className="btn btn-primary" href="#module-form">
                Add your first module
              </a>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle module-table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Module</th>
                    <th scope="col">Subject area</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((module) => (
                    <tr key={module.id}>
                      <td className="text-secondary">#{module.id}</td>
                      <td className="fw-semibold">{module.moduleTitle}</td>
                      <td>{module.subjectArea}</td>
                      <td>{module.durationHours} hrs</td>
                      <td>
                        <span
                          className={`status-pill ${
                            module.published ? 'published' : 'draft'
                          }`}
                        >
                          {module.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(module)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => void deleteModule(module)}
                            disabled={deletingId === module.id}
                          >
                            {deletingId === module.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="app-footer">
          Learning Module Management · Powered by Spring Boot
        </footer>
      </main>
    </div>
  );
}

export default App;

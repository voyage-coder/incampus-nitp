import { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { BRANCHES, SKILL_CATEGORIES } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  addAchievement,
  addCertification,
  addEducation,
  addExperience,
  addPosition,
  addProject,
  addSkill,
  createResume,
  deleteAchievement,
  deleteCertification,
  deleteEducation,
  deleteExperience,
  deletePosition,
  deleteProject,
  deleteSkill,
  downloadResumePdf,
  getMyResume,
  updateResume,
} from '../../services/resumeService';
import { getErrorMessage, labelize } from '../../utils/format';
import { cn } from '../../utils/cn';

const STEPS = [
  'Basics',
  'Education',
  'Experience',
  'Projects',
  'Skills',
  'Extras',
];

function progressFromResume(resume) {
  if (!resume) return 0;
  const checks = [
    resume.headline,
    resume.summary,
    resume.educations?.length,
    resume.experiences?.length,
    resume.projects?.length,
    resume.skills?.length,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function ResumeBuilder() {
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [basics, setBasics] = useState({
    name: '',
    headline: '',
    summary: '',
    template: 'default',
  });

  const [education, setEducation] = useState({
    institution: 'NIT Patna',
    degree: 'B.Tech',
    branch: '',
    score: '',
    start_year: 2022,
    end_year: 2026,
  });
  const [experience, setExperience] = useState({
    company: '',
    role: '',
    location: '',
    description: '',
    start_date: '',
    end_date: '',
  });
  const [project, setProject] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    live_url: '',
  });
  const [skill, setSkill] = useState({
    name: '',
    category: 'PROGRAMMING_LANGUAGE',
  });
  const [achievement, setAchievement] = useState({
    title: '',
    description: '',
    achievement_url: '',
  });
  const [certification, setCertification] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    credential_id: '',
    credential_url: '',
  });
  const [position, setPosition] = useState({
    position: '',
    organization: '',
    start_date: '',
    end_date: '',
    url: '',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyResume();
      setResume(data);
      setBasics({
        name: data.name || user?.full_name || '',
        headline: data.headline || '',
        summary: data.summary || '',
        template: data.template || 'default',
      });
    } catch (err) {
      if (err?.response?.status === 404) {
        setResume(null);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = useMemo(() => progressFromResume(resume), [resume]);

  const ensureResume = async () => {
    if (resume?.id) return resume;
    const created = await createResume({
      name: basics.name || user?.full_name || 'My Resume',
      headline: basics.headline || null,
      summary: basics.summary || null,
      template: basics.template || 'default',
    });
    setResume(created);
    return created;
  };

  const saveBasics = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (!resume) {
        const created = await createResume(basics);
        setResume(created);
      } else {
        const updated = await updateResume(basics);
        setResume(updated);
      }
      setMessage('Basics saved.');
      setStep(1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async (type) => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const current = await ensureResume();
      if (type === 'education') {
        await addEducation(current.id, {
          institution: education.institution,
          degree: education.degree,
          branch: education.branch || null,
          score: Number(education.score),
          start_year: Number(education.start_year),
          end_year: Number(education.end_year),
        });
        setEducation({
          institution: '',
          degree: '',
          branch: '',
          score: '',
          start_year: '',
          end_year: '',
        });
      }
      if (type === 'experience') {
        await addExperience(current.id, {
          ...experience,
          description: experience.description
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean),
          end_date: experience.end_date || null,
        });
      }
      if (type === 'project') {
        await addProject(current.id, {
          ...project,
          description: project.description
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean),
          technologies: project.technologies,
          github_url: project.github_url || null,
          live_url: project.live_url || null,
        });
      }
      if (type === 'skill') {
        await addSkill(current.id, skill);
      }
      if (type === 'achievement') {
        await addAchievement(current.id, {
          ...achievement,
          achievement_url: achievement.achievement_url || null,
        });
      }
      if (type === 'certification') {
        await addCertification(current.id, {
          ...certification,
          issue_date: certification.issue_date || null,
          credential_id: certification.credential_id || null,
          credential_url: certification.credential_url || null,
        });
      }
      if (type === 'position') {
        await addPosition(current.id, {
          ...position,
          end_date: position.end_date || null,
          url: position.url || null,
        });
      }
      setMessage('Added successfully.');
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDownload = async () => {
    if (!resume?.id) return;
    try {
      const blob = await downloadResumePdf(resume.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(getErrorMessage(err, 'PDF export failed'));
    }
  };

  const removeSectionItem = async (type, item) => {
    if (!resume?.id) return;
    const label = item.title || item.name || item.institution || item.company || 'item';
    if (!window.confirm(`Remove “${label}”?`)) return;
    try {
      if (type === 'education') await deleteEducation(item.id);
      if (type === 'experience') await deleteExperience(item.id);
      if (type === 'project') await deleteProject(item.id);
      if (type === 'skill') await deleteSkill(item.id);
      if (type === 'achievement') await deleteAchievement(item.id);
      if (type === 'certification') await deleteCertification(item.id);
      if (type === 'position')
        await deletePosition(resume.id, item.id);
      setMessage('Removed successfully.');
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-wide space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-wide">
      <PageHeader
        eyebrow="Career"
        title="Resume builder"
        description="Multi-step editing with a live preview of your campus resume."
        actions={
          resume?.id && (
            <Button variant="secondary" onClick={onDownload}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          )
        }
      />

      {error && <div className="mb-4"><ErrorState message={error} onRetry={load} /></div>}
      {message && (
        <div className="mb-4 rounded-2xl bg-success-soft px-4 py-3 text-sm text-success">
          {message}
        </div>
      )}

      {!resume && step === 0 && (
        <EmptyState
          icon={FileText}
          title="Create your first resume"
          description="Start with basics, then add education, experience, and skills."
          className="mb-6"
        />
      )}

      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {STEPS.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                step === index
                  ? 'bg-primary text-white'
                  : 'border border-line bg-white text-muted hover:text-ink'
              )}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-ink">Completion</span>
          <span className="text-muted">{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white border border-line">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card hover={false}>
          {step === 0 && (
            <form onSubmit={saveBasics} className="space-y-4">
              <Input
                label="Full name"
                required
                value={basics.name}
                onChange={(e) => setBasics({ ...basics, name: e.target.value })}
              />
              <Input
                label="Headline"
                placeholder="Aspiring SDE · Full-stack"
                value={basics.headline}
                onChange={(e) =>
                  setBasics({ ...basics, headline: e.target.value })
                }
              />
              <Textarea
                label="Summary"
                value={basics.summary}
                onChange={(e) =>
                  setBasics({ ...basics, summary: e.target.value })
                }
              />
              <Button type="submit" loading={saving}>
                Save & continue
              </Button>
            </form>
          )}

          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd('education');
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <Input
                label="Institution"
                required
                value={education.institution}
                onChange={(e) =>
                  setEducation({ ...education, institution: e.target.value })
                }
                containerClassName="sm:col-span-2"
              />
              <Input
                label="Degree"
                required
                value={education.degree}
                onChange={(e) =>
                  setEducation({ ...education, degree: e.target.value })
                }
              />
              <Select
                label="Branch (optional)"
                placeholder="Not applicable (10th / 12th)"
                value={education.branch}
                onChange={(e) =>
                  setEducation({ ...education, branch: e.target.value })
                }
                options={BRANCHES}
              />
              <Input
                label="Score"
                required
                value={education.score}
                onChange={(e) =>
                  setEducation({ ...education, score: e.target.value })
                }
              />
              <Input
                label="Start year"
                type="number"
                required
                value={education.start_year}
                onChange={(e) =>
                  setEducation({ ...education, start_year: e.target.value })
                }
              />
              <Input
                label="End year"
                type="number"
                required
                value={education.end_year}
                onChange={(e) =>
                  setEducation({ ...education, end_year: e.target.value })
                }
              />
              <Button type="submit" className="sm:col-span-2" loading={saving}>
                <Plus className="h-4 w-4" />
                Add education
              </Button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd('experience');
              }}
              className="space-y-4"
            >
              <Input
                label="Company"
                required
                value={experience.company}
                onChange={(e) =>
                  setExperience({ ...experience, company: e.target.value })
                }
              />
              <Input
                label="Role"
                required
                value={experience.role}
                onChange={(e) =>
                  setExperience({ ...experience, role: e.target.value })
                }
              />
              <Input
                label="Location"
                value={experience.location}
                onChange={(e) =>
                  setExperience({ ...experience, location: e.target.value })
                }
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Start date"
                  type="date"
                  required
                  value={experience.start_date}
                  onChange={(e) =>
                    setExperience({ ...experience, start_date: e.target.value })
                  }
                />
                <Input
                  label="End date"
                  type="date"
                  value={experience.end_date}
                  onChange={(e) =>
                    setExperience({ ...experience, end_date: e.target.value })
                  }
                />
              </div>
              <Textarea
                label="Bullets (one per line)"
                required
                value={experience.description}
                onChange={(e) =>
                  setExperience({ ...experience, description: e.target.value })
                }
              />
              <Button type="submit" loading={saving}>
                <Plus className="h-4 w-4" />
                Add experience
              </Button>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd('project');
              }}
              className="space-y-4"
            >
              <Input
                label="Title"
                required
                value={project.title}
                onChange={(e) =>
                  setProject({ ...project, title: e.target.value })
                }
              />
              <Textarea
                label="Description (one bullet per line)"
                required
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
              />
              <Input
                label="Technologies (comma separated)"
                required
                value={project.technologies}
                onChange={(e) =>
                  setProject({ ...project, technologies: e.target.value })
                }
              />
              <Input
                label="GitHub URL"
                value={project.github_url}
                onChange={(e) =>
                  setProject({ ...project, github_url: e.target.value })
                }
              />
              <Input
                label="Live URL"
                value={project.live_url}
                onChange={(e) =>
                  setProject({ ...project, live_url: e.target.value })
                }
              />
              <Button type="submit" loading={saving}>
                <Plus className="h-4 w-4" />
                Add project
              </Button>
            </form>
          )}

          {step === 4 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd('skill');
              }}
              className="space-y-4"
            >
              <Input
                label="Skill"
                required
                value={skill.name}
                onChange={(e) => setSkill({ ...skill, name: e.target.value })}
              />
              <Select
                label="Category"
                value={skill.category}
                onChange={(e) =>
                  setSkill({ ...skill, category: e.target.value })
                }
                options={SKILL_CATEGORIES.map((c) => ({
                  value: c,
                  label: labelize(c),
                }))}
              />
              <Button type="submit" loading={saving}>
                <Plus className="h-4 w-4" />
                Add skill
              </Button>
            </form>
          )}

          {step === 5 && (
            <div className="space-y-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd('achievement');
                }}
                className="space-y-3"
              >
                <h3 className="font-semibold text-ink">Achievement</h3>
                <Input
                  label="Title"
                  required
                  value={achievement.title}
                  onChange={(e) =>
                    setAchievement({ ...achievement, title: e.target.value })
                  }
                />
                <Textarea
                  label="Description"
                  required
                  value={achievement.description}
                  onChange={(e) =>
                    setAchievement({
                      ...achievement,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  label="URL (optional)"
                  type="url"
                  placeholder="https://..."
                  value={achievement.achievement_url}
                  onChange={(e) =>
                    setAchievement({
                      ...achievement,
                      achievement_url: e.target.value,
                    })
                  }
                />
                <Button type="submit" size="sm" loading={saving}>
                  Add achievement
                </Button>
              </form>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd('certification');
                }}
                className="space-y-3"
              >
                <h3 className="font-semibold text-ink">Certification</h3>
                <Input
                  label="Name"
                  required
                  value={certification.name}
                  onChange={(e) =>
                    setCertification({
                      ...certification,
                      name: e.target.value,
                    })
                  }
                />
                <Input
                  label="Issuer"
                  required
                  value={certification.issuer}
                  onChange={(e) =>
                    setCertification({
                      ...certification,
                      issuer: e.target.value,
                    })
                  }
                />
                <Input
                  label="Issue date (optional)"
                  type="date"
                  value={certification.issue_date}
                  onChange={(e) =>
                    setCertification({
                      ...certification,
                      issue_date: e.target.value,
                    })
                  }
                />
                <Input
                  label="Credential URL (optional)"
                  type="url"
                  placeholder="https://..."
                  value={certification.credential_url}
                  onChange={(e) =>
                    setCertification({
                      ...certification,
                      credential_url: e.target.value,
                    })
                  }
                />
                <Input
                  label="Credential ID (optional)"
                  value={certification.credential_id}
                  onChange={(e) =>
                    setCertification({
                      ...certification,
                      credential_id: e.target.value,
                    })
                  }
                />
                <Button type="submit" size="sm" loading={saving}>
                  Add certification
                </Button>
              </form>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd('position');
                }}
                className="space-y-3"
              >
                <h3 className="font-semibold text-ink">
                  Position of responsibility
                </h3>
                <Input
                  label="Position"
                  required
                  value={position.position}
                  onChange={(e) =>
                    setPosition({ ...position, position: e.target.value })
                  }
                />
                <Input
                  label="Organization"
                  required
                  value={position.organization}
                  onChange={(e) =>
                    setPosition({ ...position, organization: e.target.value })
                  }
                />
                <Input
                  label="Start date"
                  type="date"
                  required
                  value={position.start_date}
                  onChange={(e) =>
                    setPosition({ ...position, start_date: e.target.value })
                  }
                />
                <Button type="submit" size="sm" loading={saving}>
                  Add position
                </Button>
              </form>
            </div>
          )}
        </Card>

        <Card hover={false} className="bg-cream">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Live preview
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">
            {basics.name || user?.full_name || 'Your name'}
          </h2>
          <p className="mt-1 text-sm font-semibold text-primary">
            {basics.headline || 'Add a headline'}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {basics.summary || 'Your summary will appear here.'}
          </p>

          <PreviewSection
            title="Education"
            items={resume?.educations}
            onDelete={(item) => removeSectionItem('education', item)}
          >
            {(item) => (
              <p key={item.id} className="text-sm text-ink">
                <span className="font-semibold">{item.institution}</span> —{' '}
                {item.degree}
                {item.branch ? `, ${item.branch}` : ''} ({item.start_year}–
                {item.end_year})
              </p>
            )}
          </PreviewSection>
          <PreviewSection
            title="Experience"
            items={resume?.experiences}
            onDelete={(item) => removeSectionItem('experience', item)}
          >
            {(item) => (
              <div key={item.id} className="text-sm">
                <p className="font-semibold text-ink">
                  {item.role} · {item.company}
                </p>
              </div>
            )}
          </PreviewSection>
          <PreviewSection
            title="Projects"
            items={resume?.projects}
            onDelete={(item) => removeSectionItem('project', item)}
          >
            {(item) => (
              <p key={item.id} className="text-sm font-semibold text-ink">
                {item.title}
              </p>
            )}
          </PreviewSection>
          <PreviewSection
            title="Skills"
            items={resume?.skills}
            onDelete={(item) => removeSectionItem('skill', item)}
          >
            {(item) => (
              <span
                key={item.id}
                className="mr-2 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink"
              >
                {item.name}
              </span>
            )}
          </PreviewSection>
          <PreviewSection
            title="Achievements"
            items={resume?.achievements}
            onDelete={(item) => removeSectionItem('achievement', item)}
          >
            {(item) => (
              <p key={item.id} className="text-sm font-semibold text-ink">
                {item.achievement_url ? (
                  <a
                    href={item.achievement_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </p>
            )}
          </PreviewSection>
          <PreviewSection
            title="Certifications"
            items={resume?.certifications}
            onDelete={(item) => removeSectionItem('certification', item)}
          >
            {(item) => (
              <p key={item.id} className="text-sm text-ink">
                <span className="font-semibold">{item.issuer}</span>
                {item.credential_url ? (
                  <>
                    {', '}
                    <a
                      href={item.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {item.name}
                    </a>
                  </>
                ) : (
                  <>, {item.name}</>
                )}
                {item.issue_date && (
                  <span className="text-muted">
                    {' '}
                    · {new Date(item.issue_date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </p>
            )}
          </PreviewSection>
          <PreviewSection
            title="Positions"
            items={resume?.positions_of_responsibility}
            onDelete={(item) => removeSectionItem('position', item)}
          >
            {(item) => (
              <p key={item.id} className="text-sm font-semibold text-ink">
                {item.position} · {item.organization}
              </p>
            )}
          </PreviewSection>
        </Card>
      </div>
    </div>
  );
}

function PreviewSection({ title, items, children, onDelete }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="mt-6 border-t border-line pt-4">
      <h3 className="mb-2 font-display text-lg font-bold text-ink">{title}</h3>
      {list.length === 0 ? (
        <p className="text-sm text-muted">Nothing added yet.</p>
      ) : (
        <div className="space-y-2">
          {list.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-2 rounded-xl bg-white/70 px-3 py-2"
            >
              <div className="min-w-0 flex-1">{children(item)}</div>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-primary-soft hover:text-primary"
                  aria-label={`Remove ${title} item`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Link } from 'react-router-dom';
import brandLogo from '../data/Logos/Logo_4.jpeg';
import { PolicyFooter } from '../components/PolicyFooter';
import { getPolicyBySlug } from '../constants/policies';

interface PolicyPageProps {
  policySlug: string;
}

export const PolicyPage = ({ policySlug }: PolicyPageProps) => {
  const policy = getPolicyBySlug(policySlug);

  if (!policy) {
    return (
      <main className="page-shell animate-fadeInUp">
        <section className="card p-6 text-center">
          <h1 className="font-['Sora'] text-2xl font-bold text-lavender-900">Policy not found</h1>
          <Link to="/" className="btn-primary mt-4 inline-flex">
            Back to Shop
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell animate-fadeInUp">
      <div className="floating-orb left-[-18px] top-20 h-16 w-16 bg-lavender-200/70" />
      <div className="floating-orb right-6 top-32 h-8 w-8 bg-lavender-300/80" />

      <section className="hero-glow relative overflow-hidden rounded-3xl border border-lavender-200/70 p-4 shadow-soft sm:p-7">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 p-0.5 shadow-sm ring-1 ring-lavender-200">
                <img src={brandLogo} alt="Dreamy Clouds logo" className="h-full w-full rounded-full object-cover" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-lavender-600">Dreamy Clouds By Daisy</p>
            </div>
            <h1 className="mt-3 font-['Sora'] text-2xl font-extrabold leading-tight text-lavender-900 sm:text-3xl">
              {policy.title}
            </h1>
            <p className="mt-2 text-sm text-lavender-700">Please review the details below.</p>
          </div>

          <Link to="/" className="btn-secondary w-full sm:w-auto">
            Back to Shop
          </Link>
        </div>
      </section>

      <article className="card mt-5 p-4 sm:mt-6 sm:p-6">
        <div className="space-y-6">
          {policy.sections.map((section, index) => (
            <section key={`${policy.slug}-${index}`}>
              {section.heading ? (
                <h2 className="font-['Sora'] text-lg font-bold text-lavender-900">{section.heading}</h2>
              ) : null}
              <div className={`space-y-3 ${section.heading ? 'mt-2' : ''}`}>
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex} className="text-sm leading-relaxed text-lavender-700 sm:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-lavender-700 sm:text-base">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </article>

      <PolicyFooter />
    </main>
  );
};

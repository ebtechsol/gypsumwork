import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Plus,
  Phone,
  MessageCircle,
  Check,
  MapPin,
  Ruler,
  Layers,
  MoveUpRight,
} from 'lucide-react';
import { api } from '@appdeploy/client';
import {
  business,
  services,
  images,
  photo,
  styles,
  projects,
  commonFaqs,
} from './content';
import './design.css';

const quote = (service = '', style = '') =>
  '#contact?service=' +
  encodeURIComponent(service) +
  '&style=' +
  encodeURIComponent(style);
function track(name: string) {
  window.dispatchEvent(
    new CustomEvent('gypsum:analytics', { detail: { event: name } })
  );
}
function LinkButton({
  children,
  href = quote(),
  secondary = false,
}: {
  children: React.ReactNode;
  href?: string;
  secondary?: boolean;
}) {
  return (
    <a className={'button ' + (secondary ? 'secondary' : '')} href={href}>
      {children}
      <ArrowUpRight size={17} />
    </a>
  );
}
function FAQs({ items = commonFaqs }: { items?: string[][] }) {
  return (
    <div className="faqs">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <Plus size={18} />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
function Photo({
  id,
  alt,
  className = '',
  eager = false,
}: {
  id: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      className={className}
      src={photo(id)}
      srcSet={
        photo(id, 600) +
        ' 600w, ' +
        photo(id, 1000) +
        ' 1000w, ' +
        photo(id, 1600) +
        ' 1600w'
      }
      sizes="(max-width: 700px) 100vw, 60vw"
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
    />
  );
}
function EnquiryForm({
  service = '',
  style = '',
}: {
  service?: string;
  style?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({
    name: '',
    phone: '+971 ',
    location: '',
    service,
    description: style ? 'I am interested in ' + style + '.' : '',
    email: '',
    property: '',
    community: '',
    area: '',
    unit: 'm²',
    date: '',
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');
  const [configured, setConfigured] = useState(false);
  useEffect(() => {
    api
      .get('/api/enquiry-status')
      .then(r => setConfigured(Boolean(r.data.configured)))
      .catch(() => setConfigured(false));
  }, []);
  function input(key: string) {
    return {
      value: values[key],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      ) => setValues(v => ({ ...v, [key]: e.target.value })),
      'aria-invalid': Boolean(errors[key]),
      'aria-describedby': errors[key] ? 'error-' + key : undefined,
    };
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = 'Please enter your name.';
    if (
      !/^\+[0-9\s()-]{8,20}$/.test(values.phone) ||
      values.phone.replace(/\D/g, '').length < 8
    )
      next.phone = 'Enter a valid phone number including country code.';
    if (!values.location.trim())
      next.location = 'Please enter your project location.';
    if (!values.service) next.service = 'Please choose a service.';
    if (values.description.trim().length < 10)
      next.description =
        'Please describe your project in at least 10 characters.';
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = 'Please enter a valid email address.';
    if (
      values.area &&
      (!Number.isFinite(Number(values.area)) || Number(values.area) <= 0)
    )
      next.area = 'Enter an area greater than zero.';
    setErrors(next);
    if (Object.keys(next).length) {
      setMessage('Please check the highlighted fields.');
      setState('error');
      setTimeout(
        () =>
          document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
        0
      );
      return;
    }
    setState('loading');
    setMessage('');
    try {
      const result = await api.post('/api/enquiries', values);
      if (!result.data.received) throw new Error('Not received');
      setState('success');
      track('quote_submission');
    } catch {
      setState('error');
      setMessage(
        configured
          ? 'Your enquiry could not be delivered. Your details remain here; please try again or use a configured contact option.'
          : 'Enquiry delivery is not configured yet. Nothing has been sent. Your details remain here.'
      );
    }
  }
  const err = (key: string) =>
    errors[key] ? (
      <small className="field-error" id={'error-' + key}>
        {errors[key]}
      </small>
    ) : null;
  if (state === 'success')
    return (
      <div className="success" role="status">
        <Check size={30} />
        <h3>Thank you.</h3>
        <p>
          Your enquiry has been received. Our team will review your project
          details and contact you using the information provided.
        </p>
      </div>
    );
  return (
    <form className="enquiry-form" onSubmit={submit} noValidate>
      <div className="form-heading">
        <h3>Your project, in a few details.</h3>
        <span>* Required</span>
      </div>
      {!configured && (
        <p className="form-notice">
          Preview mode · Enquiry delivery is not connected. This form will not
          send your details.
        </p>
      )}
      <div className="form-grid">
        <label>
          Name *
          <input
            autoComplete="name"
            maxLength={100}
            placeholder="Your full name"
            {...input('name')}
          />
          {err('name')}
        </label>
        <label>
          Phone number *
          <input
            type="tel"
            autoComplete="tel"
            maxLength={24}
            {...input('phone')}
          />
          {err('phone')}
        </label>
        <label>
          Project location *
          <input
            placeholder="Emirate or area"
            maxLength={120}
            {...input('location')}
          />
          {err('location')}
        </label>
        <label>
          Service required *
          <select {...input('service')}>
            <option value="">Select a service</option>
            {services
              .filter(s => business.preview || s.confirmed)
              .map(s => (
                <option key={s.slug}>{s.name}</option>
              ))}
            <option>Not sure — please advise</option>
          </select>
          {err('service')}
        </label>
        <label className="span-2">
          Tell us about your project *
          <textarea
            rows={4}
            maxLength={4000}
            placeholder="What would you like to create or improve?"
            {...input('description')}
          />
          {err('description')}
        </label>
      </div>
      <details className="optional">
        <summary>
          Add photos, dimensions or other details <Plus size={16} />
        </summary>
        <div className="form-grid">
          <label>
            Email
            <input
              type="email"
              maxLength={254}
              autoComplete="email"
              placeholder="you@example.com"
              {...input('email')}
            />
            {err('email')}
          </label>
          <label>
            Property type
            <select {...input('property')}>
              <option value="">Select property type</option>
              {['Villa', 'Apartment', 'Office', 'Retail', 'Other'].map(v => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Community or area
            <input maxLength={120} {...input('community')} />
          </label>
          <label>
            Approximate area
            <div className="area-input">
              <input type="number" min="0.1" step="any" {...input('area')} />
              <select aria-label="Area unit" {...input('unit')}>
                <option>m²</option>
                <option>ft²</option>
              </select>
            </div>
            {err('area')}
          </label>
          <label>
            Preferred start date
            <input type="date" {...input('date')} />
            <small>Requested date, subject to agreement.</small>
          </label>
          <div className="upload-info">
            <strong>Photos or PDF drawings</strong>
            <p>
              Uploads are currently unavailable. Once secure storage is
              configured: JPG, PNG or PDF, up to 5 MB each, maximum 3 files.
              Please do not include private addresses or confidential drawings.
            </p>
          </div>
        </div>
      </details>
      <label className="honeypot" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" {...input('website')} />
      </label>
      <p className="privacy-note">
        Your details will be used to respond to this enquiry. Read our{' '}
        <a href="#privacy">Privacy Policy</a>. No marketing subscription is
        added.
      </p>
      {message && (
        <p className="error-message" role="alert">
          {message}
        </p>
      )}
      <button className="button" type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? 'Sending your enquiry…' : 'Send Project Enquiry'}
        <ArrowUpRight size={17} />
      </button>
    </form>
  );
}
function ServiceCards() {
  return (
    <div className="service-grid">
      {services
        .filter(s => business.preview || s.confirmed)
        .map((s, i) => (
          <a className="service-card" key={s.slug} href={'#services/' + s.slug}>
            <div className="service-image">
              <Photo id={s.image} alt={'Interior inspiration for ' + s.name} />
              <span>0{i + 1}</span>
              <div className="circle-arrow">
                <ArrowUpRight size={22} />
              </div>
            </div>
            <h3>{s.name}</h3>
            <p>{s.short}</p>
          </a>
        ))}
    </div>
  );
}
function Process() {
  return (
    <section className="process section">
      <div className="wrap">
        <div className="section-top">
          <div>
            <span className="eyebrow">FROM FIRST IDEA TO FINAL DETAIL</span>
            <h2>
              A clear path to your
              <br />
              finished space.
            </h2>
          </div>
          <p>
            Thoughtful planning makes room for
            <br className="desktop" /> a smoother installation.
          </p>
        </div>
        <div className="steps">
          {[
            [
              'Share your requirements',
              'Send your location, dimensions and the ideas you have in mind.',
            ],
            [
              'Review the site & design',
              'Check the space, practical requirements and the proposed details.',
            ],
            [
              'Confirm scope & quotation',
              'Agree materials, inclusions, access and the sequence of work.',
            ],
            [
              'Install, finish & inspect',
              'Complete the agreed work and review the finishing details.',
            ],
          ].map(([t, d], i) => (
            <div key={t}>
              <span className="step-num">0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <p className="caption">
          Site visit arrangements and any charges are confirmed on enquiry.
        </p>
      </div>
    </section>
  );
}
function Inspiration() {
  return (
    <section className="section wrap" id="inspiration">
      <div className="section-top">
        <div>
          <span className="eyebrow">A LITTLE INSPIRATION</span>
          <h2>Find the detail that feels like you.</h2>
        </div>
        <p>
          Reference imagery, not completed company projects.
          <br />
          Choose a style to include in your enquiry.
        </p>
      </div>
      <div className="inspiration-grid">
        {styles.map((style, i) => (
          <a key={style} href={quote('', style)}>
            <Photo
              id={images[(i + 1) % images.length]}
              alt={style + ' — interior design reference'}
            />
            <span>
              {style}
              <ArrowUpRight size={18} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
function QuoteSection() {
  return (
    <section className="section quote-section">
      <div className="wrap quote-grid">
        <div>
          <span className="eyebrow">LET'S TALK ABOUT YOUR SPACE</span>
          <h2>
            Let’s plan your ceiling
            <br />
            or partition project.
          </h2>
          <p>
            Share your location, approximate dimensions, and any photos or
            drawings. We’ll review your requirements and discuss the next step.
          </p>
          <div className="line-decoration" />
          <p className="caption">
            A considered beginning.
            <br />A beautifully finished space.
          </p>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}
function Home() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="little-line" />
            CEILINGS. PARTITIONS. POSSIBILITIES.
          </div>
          <h1>
            Thoughtfully
            <br />
            designed ceilings.
            <br />
            <span>
              Beautifully
              <br />
              finished spaces.
            </span>
          </h1>
          <p>
            Bring definition to the spaces you live and work in. Explore gypsum
            ceilings, partitions and decorative finishes, considered down to the
            last detail.
          </p>
          <div className="hero-actions">
            <LinkButton>Request a Quote</LinkButton>
            <a className="text-link" href="#projects">
              Explore Our Work <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-foot">
            <MapPin size={15} />
            <span>
              {business.areas.length
                ? business.areas.join(' · ')
                : 'Service coverage confirmed on enquiry'}
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <Photo
            id={images[0]}
            alt="Warm neutral living room with architectural ceiling and recessed lighting — inspiration"
            eager
          />
          <div className="image-tag">
            <span className="tiny-square" />
            FORM. LIGHT. FINISH.
          </div>
          <div className="image-caption">
            Interior inspiration <span>01 / 06</span>
          </div>
        </div>
      </section>
      <div className="intro-strip">
        <div className="wrap">
          <span>FOR SPACES THAT DESERVE CONSIDERATION</span>
          <div>
            Residential <span>✧</span> Commercial <span>✧</span> Interior
            fit-outs
          </div>
        </div>
      </div>
      <section className="section wrap">
        <div className="section-top">
          <div>
            <span className="eyebrow">OUR SERVICES</span>
            <h2>
              Beautiful spaces.
              <br />
              Thoughtful gypsum solutions.
            </h2>
          </div>
          <div>
            <p>
              From a clean ceiling line to a completely
              <br className="desktop" /> reimagined interior.
            </p>
            <a href="#services" className="text-link">
              Explore all services <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        {business.preview && (
          <p className="caption">
            Proposed service catalogue · Availability awaits company
            confirmation. Images are design references.
          </p>
        )}
        <ServiceCards />
      </section>
      {projects.some(p => p.verified) && <ProjectGallery compact />}
      <section className="workmanship section">
        <div className="wrap workmanship-grid">
          <div className="workmanship-image">
            <Photo
              id={images[1]}
              alt="Refined ceiling and interior proportions — design inspiration"
            />
            <span className="photo-note">DESIGN INSPIRATION</span>
          </div>
          <div>
            <span className="eyebrow">THE DIFFERENCE IS IN THE DETAIL</span>
            <h2>
              Good gypsum work
              <br />
              starts before
              <br />
              <em>installation.</em>
            </h2>
            <p>
              The finish you see depends on the decisions you make first. A
              considered approach connects the design of your space with the
              practical details behind it.
            </p>
            <div className="principles">
              {[
                [
                  Ruler,
                  'Understand the space',
                  'Layout, dimensions and site conditions shape the work.',
                ],
                [
                  Layers,
                  'Choose the right system',
                  'Materials and framing need to suit the intended use.',
                ],
                [
                  MoveUpRight,
                  'Bring the details together',
                  'Coordinate lighting, service access and the final finish.',
                ],
              ].map(([Icon, t, d]) => {
                const Symbol = Icon as typeof Ruler;
                return (
                  <div key={String(t)}>
                    <Symbol size={23} />
                    <div>
                      <h3>{String(t)}</h3>
                      <p>{String(d)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <a href="#about" className="text-link">
              A considered approach <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>
      <Inspiration />
      <Process />
      <section className="section wrap pricing">
        <div>
          <span className="eyebrow">A QUOTATION THAT FITS YOUR PROJECT</span>
          <h2>
            Every space is different.
            <br />
            Your quotation should be, too.
          </h2>
        </div>
        <div>
          <p>
            Area is only the starting point. Design complexity, ceiling height,
            framing and board specification, insulation, lighting coordination,
            access, finishing and removal work all shape the scope.
          </p>
          <p>
            A clear, project-specific quotation helps you understand exactly
            what is included.
          </p>
          <LinkButton>Request a Project Quote</LinkButton>
        </div>
      </section>
      <section className="section faq-section">
        <div className="wrap faq-layout">
          <div>
            <span className="eyebrow">A FEW USEFUL ANSWERS</span>
            <h2>Before we begin.</h2>
            <p>
              Planning your project?
              <br />
              Start with the practical details.
            </p>
          </div>
          <FAQs />
        </div>
      </section>
      <QuoteSection />
    </>
  );
}
function ServicePage({ slug }: { slug: string }) {
  const s = services.find(
    v => v.slug === slug && (business.preview || v.confirmed)
  );
  if (!s) return <NotFound />;
  return (
    <>
      <div className="wrap breadcrumb">
        <a href="#home">Home</a>
        <span>/</span>
        <a href="#services">Services</a>
        <span>/</span>
        {s.name}
      </div>
      <section className="wrap service-hero">
        <div>
          <span className="eyebrow">DESIGNED AROUND YOUR SPACE</span>
          <h1>{s.name}</h1>
          <p className="lead">{s.intro}</p>
          <p>{s.body}</p>
          <LinkButton href={quote(s.name)}>Discuss This Service</LinkButton>
          <p className="caption">
            Service availability is awaiting confirmation.
          </p>
        </div>
        <div>
          <Photo id={s.image} alt={s.name + ' interior inspiration'} eager />
          <p className="caption">Design inspiration · Not a company project</p>
        </div>
      </section>
      <section className="section wrap two-col">
        <div>
          <span className="eyebrow">WHERE IT WORKS</span>
          <h2>
            Make room for
            <br />
            the way you use it.
          </h2>
          <ul className="check-list">
            {s.applications.map(t => (
              <li key={t}>
                <Check size={17} />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Options to consider</h3>
          <ul className="option-list">
            {s.options.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section pale">
        <div className="wrap two-col">
          <div>
            <span className="eyebrow">A CLEAR SCOPE</span>
            <h2>
              Agree the detail.
              <br />
              Then build on it.
            </h2>
            <p>{s.scope}</p>
          </div>
          <div>
            <h3>Materials & design considerations</h3>
            <p>{s.considerations}</p>
            <h3>What affects cost & scheduling?</h3>
            <p>{s.cost}</p>
          </div>
        </div>
      </section>
      <Process />
      <section className="section wrap faq-layout">
        <div>
          <span className="eyebrow">SERVICE FAQs</span>
          <h2>Worth knowing.</h2>
        </div>
        <FAQs items={s.faqs} />
      </section>
      <section className="section quote-section">
        <div className="wrap quote-grid">
          <div>
            <span className="eyebrow">YOUR NEXT STEP</span>
            <h2>
              Tell us what
              <br />
              you have in mind.
            </h2>
            <p>
              Start with the space, the location and what you want to achieve.
            </p>
          </div>
          <EnquiryForm key={s.slug} service={s.name} />
        </div>
      </section>
      <section className="section wrap">
        <span className="eyebrow">EXPLORE MORE</span>
        <h2>Related services</h2>
        <div className="related">
          {services
            .filter(v => v.slug !== s.slug && (business.preview || v.confirmed))
            .slice(0, 3)
            .map(v => (
              <a href={'#services/' + v.slug} key={v.slug}>
                {v.name}
                <ArrowUpRight size={21} />
              </a>
            ))}
        </div>
      </section>
    </>
  );
}
function ProjectGallery({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState('All');
  const verified = projects.filter(p => p.verified);
  const visible = verified.filter(
    p => filter === 'All' || p.category === filter
  );
  return (
    <section className="section wrap">
      <span className="eyebrow">PROJECT JOURNAL</span>
      <h2>See the detail in our work.</h2>
      {verified.length ? (
        <>
          <div className="filters">
            {[
              'All',
              'Ceilings',
              'Partitions',
              'Decorative Work',
              'Commercial',
            ].map(f => (
              <button
                key={f}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="service-grid">
            {visible.slice(0, compact ? 3 : undefined).map(p => (
              <a key={p.slug} href={'#projects/' + p.slug}>
                <img className="project-photo" src={p.images[0]} alt={p.name} />
                <h3>{p.name}</h3>
                <p>
                  {p.type} · {p.location}
                </p>
              </a>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-projects">
          <Layers size={34} />
          <h3>A portfolio built on real work.</h3>
          <p>
            Verified project photographs and case studies will appear here when
            available. In the meantime, explore design references and tell us
            what you have in mind.
          </p>
          <LinkButton href="#inspiration">
            Explore Design Inspiration
          </LinkButton>
        </div>
      )}
    </section>
  );
}
function ProjectDetail({ slug }: { slug: string }) {
  const p = projects.find(p => p.slug === slug && p.verified);
  const [selected, setSelected] = useState(-1);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected >= 0) dialog.current?.showModal();
  }, [selected]);
  if (!p) return <NotFound />;
  return (
    <section className="section wrap">
      <a className="text-link" href="#projects">
        ← All projects
      </a>
      <h1>{p.name}</h1>
      <p>
        {p.type} · {p.location}
      </p>
      <div className="inspiration-grid">
        {p.images.map((src, i) => (
          <button onClick={() => setSelected(i)} key={src}>
            <img src={src} alt={p.name + ' completed view ' + (i + 1)} />
          </button>
        ))}
      </div>
      <div className="two-col">
        <div>
          <h2>The brief</h2>
          <p>{p.requirement}</p>
          <h3>Scope completed</h3>
          <p>{p.scope}</p>
        </div>
        <div>
          <h3>Design & installation</h3>
          <p>{p.considerations}</p>
          {p.materials && <p>Materials: {p.materials}</p>}
          {p.duration && <p>Duration: {p.duration}</p>}
        </div>
      </div>
      <LinkButton href={quote('', p.name)}>
        Request a Similar Project
      </LinkButton>
      <dialog
        ref={dialog}
        onClose={() => setSelected(-1)}
        onKeyDown={e => {
          if (e.key === 'ArrowRight')
            setSelected((selected + 1) % p.images.length);
          if (e.key === 'ArrowLeft')
            setSelected((selected - 1 + p.images.length) % p.images.length);
        }}
      >
        <button
          className="close"
          aria-label="Close image"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        {selected >= 0 && (
          <img src={p.images[selected]} alt={p.name + ' enlarged view'} />
        )}
        <button onClick={() => setSelected((selected + 1) % p.images.length)}>
          Next image →
        </button>
      </dialog>
    </section>
  );
}
function About() {
  return (
    <>
      <section className="section wrap page-intro">
        <span className="eyebrow">ABOUT THE COMPANY</span>
        <h1>
          Considered spaces.
          <br />
          Clearly defined work.
        </h1>
        <p className="lead">
          Gypsum work sits at the meeting point of architecture and everyday
          life.
        </p>
      </section>
      <section className="wrap about-photo">
        <Photo
          id={images[2]}
          alt="Calm contemporary residential interior — inspiration"
          eager
        />
        <span className="photo-note">INTERIOR INSPIRATION</span>
      </section>
      <section className="section wrap two-col">
        <div>
          <span className="eyebrow">A PRACTICAL START</span>
          <h2>
            Good questions make
            <br />
            better beginnings.
          </h2>
        </div>
        <div>
          <p>
            This website is being prepared for {business.name}, a gypsum works
            contractor. The proposed service collection covers ceilings,
            partitions and interior finishing for residential and commercial
            spaces.
          </p>
          <p>
            Homeowners, villa owners, interior designers, office managers,
            retail businesses and fit-out contractors can use the enquiry form
            to outline their requirements.
          </p>
          <p>
            Before any work is agreed, the scope should establish the design,
            site conditions, material specification, interfaces with other
            trades and finishing requirements.
          </p>
          <p className="form-notice">
            Company details, confirmed services and coverage are awaiting
            verification. No experience, certification or warranty claims are
            made in this preview.
          </p>
          <LinkButton>Discuss Your Project</LinkButton>
        </div>
      </section>
      <Process />
    </>
  );
}
function Contact() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  return (
    <>
      <section className="section wrap page-intro">
        <span className="eyebrow">LET'S CREATE SOMETHING CONSIDERED</span>
        <h1>
          Tell us about your
          <br />
          gypsum project.
        </h1>
        <p className="lead">
          Planning a new ceiling, dividing a room, or repairing an existing
          finish? Send your requirements so we can understand the work.
        </p>
      </section>
      <section className="wrap contact-grid">
        <EnquiryForm
          key={window.location.hash}
          service={params.get('service') || ''}
          style={params.get('style') || ''}
        />
        <aside className="contact-aside">
          <h3>A conversation starts here.</h3>
          <p>A few practical details help define the next step.</p>
          <ContactDetails />
          <div className="visit-note">
            <h4>Planning a site visit?</h4>
            <p>
              Visit availability and any charges are confirmed on enquiry.
              Preferred dates are requests, not confirmed bookings.
            </p>
          </div>
          <Photo id={images[5]} alt="Interior finishing reference" />
        </aside>
      </section>
      <section className="section wrap faq-layout">
        <div>
          <span className="eyebrow">BEFORE YOU ENQUIRE</span>
          <h2>A few useful details.</h2>
        </div>
        <FAQs items={commonFaqs.slice(0, 3)} />
      </section>
    </>
  );
}
function ContactDetails() {
  return (
    <div className="contact-details">
      {business.phone && (
        <a
          href={'tel:' + business.phone}
          onClick={() => track('telephone_click')}
        >
          <Phone size={17} />
          {business.phone}
        </a>
      )}
      {business.email && (
        <a href={'mailto:' + business.email}>{business.email}</a>
      )}
      {business.whatsapp && (
        <a
          href={
            'https://wa.me/' +
            business.whatsapp.replace(/\D/g, '') +
            '?text=' +
            encodeURIComponent(
              'Hello, I would like to enquire about a gypsum project.'
            )
          }
          target="_blank"
          rel="noreferrer"
          onClick={() => track('whatsapp_click')}
        >
          WhatsApp ↗
        </a>
      )}
      {!business.phone && !business.email && (
        <p className="caption">
          Telephone, WhatsApp and email details are awaiting confirmation.
        </p>
      )}
      <div>
        <span className="eyebrow">SERVICE COVERAGE</span>
        <p>
          {business.areas.join(', ') ||
            'Locations to be confirmed. Please include your project area in your enquiry.'}
        </p>
      </div>
      {business.address && <p>{business.address}</p>}
      {business.hours && <p>{business.hours}</p>}
    </div>
  );
}
function Privacy() {
  return (
    <section className="section wrap legal">
      <span className="eyebrow">YOUR INFORMATION</span>
      <h1>Privacy Policy</h1>
      <p className="lead">
        This preview does not deliver enquiries until the business configures
        its receiving service.
      </p>
      <h2>Information you choose to provide</h2>
      <p>
        The enquiry form requests a name, telephone number, location, service
        and project description. Optional information can help define the work.
        Form entries are held in the current page while you complete them and
        are not saved to browser storage.
      </p>
      <h2>How an enquiry is used</h2>
      <p>
        When delivery is enabled, details will be sent to the company's
        configured email or CRM service to review the project and contact you.
        Enquiries are not used to subscribe you to marketing.
      </p>
      <h2>Images and drawings</h2>
      <p>
        Uploads are disabled until restricted storage and server-side file
        checks have been configured. Do not send confidential drawings or
        personal information about other people without their permission.
      </p>
      <h2>Technical information</h2>
      <p>
        The hosting provider may process request information for delivery and
        security. A short-lived, hashed network identifier may be used for
        submission limits. The website emits anonymous interaction events
        locally; no analytics destination is currently connected. External
        inspiration images are served by Unsplash and may involve requests to
        that provider.
      </p>
      <h2>Retention and requests</h2>
      <p>
        The business must publish its verified identity, privacy contact,
        retention period and applicable service-provider details before launch.
        Until that information is provided, enquiry delivery remains
        unconfigured.
      </p>
      <a href="#contact" className="text-link">
        Return to contact <ArrowRight size={17} />
      </a>
    </section>
  );
}
function NotFound() {
  return (
    <section className="section wrap page-intro">
      <h1>Page not available.</h1>
      <p>This page may not have been published yet.</p>
      <LinkButton href="#home">Back to Home</LinkButton>
    </section>
  );
}
function App() {
  const [route, setRoute] = useState(
    window.location.hash.slice(1).split('?')[0] || 'home'
  );
  const [menu, setMenu] = useState(false);
  const [notice, setNotice] = useState('');
  const [fullHash, setFullHash] = useState(window.location.hash);
  useEffect(() => {
    const change = () => {
      setRoute(window.location.hash.slice(1).split('?')[0] || 'home');
      setFullHash(window.location.hash);
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => {
    const title = route.startsWith('services/')
      ? services.find(s => route.endsWith(s.slug))?.name
      : (
          {
            home: 'Gypsum Ceilings & Interior Finishing',
            about: 'About Us',
            services: 'Gypsum Ceiling, Partition & Finishing Services',
            projects: 'Project Journal',
            contact: 'Tell Us About Your Gypsum Project',
            privacy: 'Privacy Policy',
            inspiration: 'Interior Design Inspiration',
          } as Record<string, string>
        )[route];
    document.title = (title || 'Page') + ' | ' + business.name;
    const desc = route.startsWith('services/')
      ? services.find(s => route.endsWith(s.slug))?.intro
      : 'Explore considered gypsum ceilings, partitions and finishing. Share your project requirements for a clearly defined quotation.';
    for (const key of ['description', 'og:description']) {
      let meta = document.querySelector(
        'meta[' +
          (key.startsWith('og:') ? 'property' : 'name') +
          '="' +
          key +
          '"]'
      );
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(key.startsWith('og:') ? 'property' : 'name', key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', desc || '');
    }
  }, [route]);
  function contact(kind: string) {
    if (kind === 'call' && business.phone) {
      track('telephone_click');
      window.location.href = 'tel:' + business.phone;
    } else if (kind === 'whatsapp' && business.whatsapp) {
      track('whatsapp_click');
      const service =
        services.find(s => route.endsWith(s.slug))?.name || 'gypsum works';
      window.open(
        'https://wa.me/' +
          business.whatsapp.replace(/\D/g, '') +
          '?text=' +
          encodeURIComponent(
            'Hello, I would like to enquire about ' +
              service +
              '. My project location is: '
          ),
        '_blank',
        'noopener,noreferrer'
      );
    } else {
      setNotice(
        kind === 'call'
          ? 'The company telephone number has not been configured yet.'
          : 'The company WhatsApp number has not been configured yet. No message has been sent.'
      );
    }
  }
  let page;
  if (route === 'home') page = <Home />;
  else if (route === 'services')
    page = (
      <>
        <section className="section wrap page-intro">
          <span className="eyebrow">FROM STRUCTURE TO SURFACE</span>
          <h1>
            Gypsum ceiling, partition
            <br />& finishing services.
          </h1>
          <p className="lead">
            Explore practical and decorative gypsum solutions for residential
            and commercial interiors. Find the service that fits your space,
            then share your requirements.
          </p>
          <p className="caption">
            Proposed services · Company confirmation required before launch.
          </p>
        </section>
        <section className="wrap">
          <ServiceCards />
        </section>
        <section className="section wrap pricing">
          <h2>
            Not sure which
            <br />
            service you need?
          </h2>
          <div>
            <p>
              Tell us what you want to change. A short description of your space
              is a useful place to start.
            </p>
            <LinkButton href={quote('Not sure — please advise')}>
              Let's Talk
            </LinkButton>
          </div>
        </section>
      </>
    );
  else if (route.startsWith('services/'))
    page = <ServicePage slug={route.split('/')[1]} />;
  else if (route === 'about') page = <About />;
  else if (route === 'contact') page = <Contact key={fullHash} />;
  else if (route === 'projects')
    page = (
      <>
        <section className="section wrap page-intro">
          <span className="eyebrow">THE PROJECT COLLECTION</span>
          <h1>
            Spaces. Details.
            <br />
            Work to share.
          </h1>
          <p className="lead">
            A place for completed work, documented with care.
          </p>
        </section>
        <ProjectGallery />
        <Inspiration />
      </>
    );
  else if (route.startsWith('projects/'))
    page = <ProjectDetail slug={route.split('/')[1]} />;
  else if (route === 'privacy') page = <Privacy />;
  else if (route === 'inspiration')
    page = (
      <>
        <div className="wrap page-intro section">
          <span className="eyebrow">DESIGN REFERENCES</span>
          <h1>A direction for your space.</h1>
        </div>
        <Inspiration />
      </>
    );
  else page = <NotFound />;
  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={e => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      {business.preview && (
        <div className="preview-bar">
          DESIGN PREVIEW{' '}
          <span>
            Business details & service availability awaiting confirmation
          </span>
        </div>
      )}
      <header>
        <div className="wrap header-inner">
          <a className="brand" href="#home" aria-label="Company home">
            <span className="brand-mark">
              <i />
              <i />
              <i />
            </span>
            <span>
              {business.name}
              <small>GYPSUM & INTERIOR WORKS</small>
            </span>
          </a>
          <nav aria-label="Main navigation" className={menu ? 'open' : ''}>
            {[
              ['home', 'Home'],
              ['about', 'About Us'],
              ['services', 'Services'],
              ['projects', 'Projects'],
              ['contact', 'Contact Us'],
            ].map(([path, label]) => (
              <a
                key={path}
                href={'#' + path}
                aria-current={
                  route === path || route.startsWith(path + '/')
                    ? 'page'
                    : undefined
                }
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="wa-button"
              aria-label="WhatsApp"
              onClick={() => contact('whatsapp')}
            >
              <MessageCircle size={20} />
            </button>
            <LinkButton>Request a Quote</LinkButton>
          </div>
          <button
            className="menu-toggle"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {page}
      </main>
      <footer>
        <div className="wrap footer-top">
          <div>
            <a className="brand" href="#home">
              <span className="brand-mark">
                <i />
                <i />
                <i />
              </span>
              <span>
                {business.name}
                <small>GYPSUM & INTERIOR WORKS</small>
              </span>
            </a>
            <p>
              Considered ceilings.
              <br />
              Beautifully finished spaces.
            </p>
          </div>
          <div>
            <span className="eyebrow">EXPLORE</span>
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact Us</a>
          </div>
          <div>
            <span className="eyebrow">LET'S PLAN YOUR PROJECT</span>
            <p>
              Start with an idea.
              <br />
              We’ll help define the next step.
            </p>
            <a className="text-link" href={quote()}>
              Request a Quote <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          <span>Inspiration imagery is not company project photography.</span>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </footer>
      <div className="mobile-bar">
        <button onClick={() => contact('call')}>
          <Phone size={18} />
          Call
        </button>
        <button onClick={() => contact('whatsapp')}>
          <MessageCircle size={18} />
          WhatsApp
        </button>
        <a href={quote()}>
          <ArrowUpRight size={18} />
          Quote
        </a>
      </div>
      {notice && (
        <div className="notice" role="status">
          <p>{notice}</p>
          <button onClick={() => setNotice('')} aria-label="Dismiss notice">
            <X size={18} />
          </button>
        </div>
      )}
    </>
  );
}
export default App;


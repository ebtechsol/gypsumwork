# Gypsum website handover

## Current state
A responsive English design preview with Home, About, Services, six individual service pages, Projects, verified-project detail templates, Inspiration, Contact and Privacy. The preview is noindex. All service offerings are drafts pending confirmation. No testimonials, invented projects, credentials, prices or coverage claims are published.

## Editing
- src/content.ts: company identity, confirmed coverage, contact information, service content and availability, FAQs, inspiration and verified project records.
- src/App.tsx: page structure, enquiry flow, verified-only project gallery and keyboard-operable image dialog.
- src/design.css: responsive design system.
- backend/index.ts: validation, delivery status, enquiry delivery and a basic persisted submission limit.
- tests/tests.json: five deployment QA workflows.

## Required before launch
Supply company name and logo; city and confirmed service areas; confirmed services; telephone, WhatsApp, email, address and hours; site visit policy; documented warranty terms; verified experience or credentials if desired; real project photography and permission to publish; supported languages. English only is implemented; no nonfunctional Arabic switch appears.

Replace the bracketed company name. Confirm individual services, set confirmed=true only for actual offerings, and disable business.preview. Update remaining preview notices and the privacy policy with business identity, retention period, hosting/CRM processors and privacy contact. No map appears without a verified address.

## Enquiry delivery
AppDeploy exposes encrypted backend secrets through its SDK rather than process.env.
Configure ENQUIRY_WEBHOOK_URL (HTTPS), ENQUIRY_WEBHOOK_TOKEN and LAUNCH_APPROVED=true after all launch facts are confirmed. The webhook must authenticate the bearer token, accept JSON, store/deliver into the actual CRM or email provider, and return JSON { "accepted": true } only after durable acceptance. No secrets belong in frontend files.
The form keeps its input on errors and only shows success on explicit acknowledgement. No real delivery or configured-success test has been performed because no integration credentials were supplied.
Five attempts per network hash/hour are tracked in bounded logical tables. This is a basic non-atomic limit; add an atomic edge limit/CAPTCHA and automated expiry of rate records before enabling production traffic. Ambiguous network timeouts may require checking the receiving system before resubmitting. Add end-to-end idempotency if the receiver does not support duplicate detection.

## Attachments
Uploads are honestly disabled, including server rejection of attachment payloads. Do not enable file inputs until authenticated restricted storage, server signature/MIME checks, size/count limits, malware scanning and retention cleanup are configured. Intended limits: JPG/PNG/PDF, max 5 MB each, max 3 files. No insecure public upload endpoint is included.

## Projects
Add only verified records to projects in src/content.ts. Each supports name, general location, property type, category, brief, scope, considerations, images and optional documented materials/duration. No private addresses. Gallery filters and detail lightbox appear only when verified records exist. Before/after pairs require additional verified assets and component wiring.

## Images
External Unsplash images are visual references, explicitly labelled inspiration. They are not company projects. Replace with approved licensed company assets, verify usage rights and image relevance, and keep responsive sizes. No logo file was supplied.

## SEO limitation
AppDeploy requires relative/hash SPA routing. This implementation uses hash routes with per-route document titles and descriptions and a noindex preview. This is not equivalent to separately crawlable production service URLs. Before SEO launch, move to a host supporting server-rendered/path-based pages (or a compatible static multipage build), configure the verified canonical domain, generate sitemap.xml, unique canonicals and complete social metadata, and add verified LocalBusiness structured data. Do not publish location pages without confirmed coverage. Hreflang is unnecessary until real translations exist.

## Analytics
The site dispatches gypsum:analytics events for acknowledged submissions, configured telephone clicks and configured WhatsApp clicks. They contain only an event name. No analytics destination or tracking cookies are enabled. Connect a consent-appropriate analytics provider without enquiry details.

## Checks
Automated AppDeploy QA covers service-to-enquiry flow, validation and unconfigured rejection, mobile menu and inspiration prefill, missing-contact guardrails, FAQ keyboard operation and proof boundaries. A configured successful delivery, real uploads, populated project gallery/lightbox and production SEO require verification after configuration.


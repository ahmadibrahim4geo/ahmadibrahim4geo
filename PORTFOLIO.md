# Ahmad Ibrahim — Professional Portfolio

A bilingual portfolio for infrastructure GIS, stormwater networks, hydrological drafting, geospatial development and geographic atlases.

Live: [ahmadibrahim4geo.github.io/ahmadibrahim4geo](https://ahmadibrahim4geo.github.io/ahmadibrahim4geo/)

## Content and design

The November 2026 design adapts the owner's supplied HTML reference: deep navy surfaces, teal/blue accents, rounded capability and software cards, compact typography, metric panels and a career timeline. It preserves the original personal calligraphy logo and portrait, bilingual content and verified contact flow. Six capability cards follow the CV's specialized expertise. Navigation highlights the current section and a floating control returns to the top.

The orthographic globe is an optional explorer inside the profile card, keeping the professional summary prominent. Visitors can drag it or use arrow keys, pause rotation, and reset the view. Natural Earth geometry and D3 are served locally with source and license records. The globe illustrates geographic context; it does not show live project data. The engineering network diagram remains explicitly labelled as a schematic. The attached reference is used for visual direction; its generic profile-only GitHub links and browser-print substitute for CV downloads are not used.

All professional claims and project descriptions are based on the supplied CV. The software catalog contains 17 entries: 10 GIS/scientific projects (including the local curriculum-atlas application) and 7 general applications. MIRSAD Desktop and Z EARTH retain their development status. A local project has no invented GitHub link. NetMax and the old legacy utilities are not listed because they are absent from this supplied CV.

The publication index includes all six authored atlases, their deposit numbers and ISBNs. Experience, education, training, research contributions and language proficiency follow the CV. Contact controls remain icon-only, with accessible labels.

## Source files

| File | Purpose |
|---|---|
| `index.html` | Profile, engineering workflow, experience, education, contact and CV actions; paired English/Arabic text |
| `portfolio-data.js` | Bilingual engineering project details, software descriptions, repository slugs and atlas registrations |
| `app.js` | Language persistence, mobile navigation, software filters and accessible project dialogs |
| `styles.css` | Responsive layout, RTL styles, reduced motion and print styles |
| `atlas-theme.css` | Dark atlas composition, work index and publication layouts |
| `globe.js` | Canvas globe, keyboard/pointer rotation, pause/reset and reduced-motion support |
| `site-effects.js` | Scroll progress and progressive section reveals |
| `contact.js` | Multipart in-page message delivery, validation, attachment selection and feedback |
| `contact-config.js` | Public FormSubmit.app endpoint; contains no secret |
| `assets/maps/` | Local land geometry, SVG fallback and source attribution |
| `assets/vendor/` | D3 7.9.0 with its ISC license |
| `assets/network-study.svg` | Original illustrative network schematic |
| `assets/ahmad-ibrahim.png` | Existing professional portrait |
| `assets/Ahmad_Ibrahim_CV_Final_Improved.pdf` | Exact user-supplied 2026 PDF |
| `assets/Ahmad_Ibrahim_CV_Final_Improved.docx` | Exact user-supplied 2026 Word document |

## CV updates

The two stable asset paths above replace the old CV files. The source files supplied for this update were `Ahmad_Ibrahim_CV_Final_Improved_2026.pdf` and `.docx`. Buttons distinguish PDF view/print, PDF download and Word download. Cache query strings are based on the file hashes; update them in `index.html` and `app.js` when replacing the documents.

The certificates section groups 17 distinct certified courses under seven issuers, including both Cartography completion dates (2018 and 2025). The existing Planning and Geographic Information Systems course remains under additional training because its issuer is not identified in the supplied documents. All course names and dates are available in English and Arabic.

The Software I use section follows the latest CV Software / Tools line: InfraWizard, ArcMap ArcGIS Desktop, ArcGIS Pro, QGIS, Global Mapper, AutoCAD, Civil 3D, SewerGEMS, StormCAD, SAS Planet, Microsoft Office Suite, Google Earth Pro, Google Earth Engine, Payazed Menu. Illustrator, Photoshop and InDesign are grouped separately under Additional technical skills. The Software I developed section contains the 17 CV projects, their development status and the separate AI-assisted programming technologies. No data formats are presented as software, and no training-only tools or inferred project dependencies are added to the working list.

Project logos are audited against the original owner repositories in assets/project-logos/SOURCES.json, including the approved Z EARTH PNG, MIRSAD, GIS Development Skills and the drainage dashboard. Projects without a verified logo show no substitute symbol. Global Mapper and Microsoft Office publisher sources are recorded in assets/brands/manifest.json and the shipped credits page.

SHA-256 for this revision:

```text
PDF   6C3DF8C0CB90DE1F8DE60A4CEE24A1C00E2311B320D6B277D943F974A6487CC8
DOCX  E168406685D6A670049D115AF9EBE7F50DFB5F664F5A27A51A296526A9850C67
```

## Preview and deployment

No build step or package installation is required. Serve the repository with any static HTTP server, for example:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. The existing GitHub Actions workflow publishes the repository root to GitHub Pages when `main` changes.

The site uses Google Fonts. The original personal logo, portrait, map geometry, D3, schematic and CV files are served from this repository. Visitors need no account. No analytics or private API credentials are included.

## In-page contact and attachments

The owner-provided endpoint is `https://formsubmit.app/f/g3jgg47dsb`. Messages use a `FormData` POST with `Accept: application/json`; visitors stay on the portfolio. Both an HTTP success and literal `ok: true` are required before clearing the form. Failures and uncertain network outcomes retain the text and files. There is no `mailto:` redirect from the submit button.

The form allows three optional attachments totalling 4 MB, below the provider's approximately 4.5 MB multipart request limit. Name, email, subject and message are required. File selection supports removal, duplicate filtering and drag-and-drop. The provider handles server-side acceptance and spam filtering; the page includes its honeypot and timing field. The browser never exposes SMTP credentials.

FormSubmit.app sends an email notification to the owner's configured recipient. Files are stored by the service and linked from the email, rather than being raw Gmail MIME attachments. The documented free tier includes 50 submissions per month and 100 MB of file storage; download links expire after seven days. These are provider limits, separate from Gmail storage. See the [free plan](https://formsubmit.app/pricing), [multipart/AJAX contract](https://formsubmit.app/docs/ajax-javascript), and [upload and retention rules](https://formsubmit.app/docs/file-uploads).

The initial integration was tested with a clearly identified synthetic message and small text file. Its notification was observed in the intended Gmail inbox, including a link named `contact-test.txt`. The old `formsubmit.co` service was not retained after returning HTTP 522 during setup.

## العربية

ملف أعمال عربي وإنجليزي يعرض الخبرات والمشاريع الهندسية والأدوات البرمجية والأطالس المسجلة وفق نسختَي السيرة الذاتية المقدمتين. يدعم اتجاه RTL والموبايل، وتصفية البرمجيات، ونوافذ تفاصيل المشاريع، وعرض السيرة الذاتية وتحميلها بصيغتَي PDF وWord. لا يتضمن ادعاءات رقمية عن تحسن الأداء أو نتائج غير مذكورة في السيرة الذاتية.


## Logo verification

Illustrator, Photoshop and InDesign use the original full-color Adobe SVG files referenced by Adobe’s official site, matching the refreshed app-icon system documented by Adobe Design. The owner project logos are verified against their original repository blobs; projects without a published logo remain text-only. Source URLs, dates and file hashes are recorded in the asset manifests.

The educational curriculum atlas card uses the original Logo/Logo.PNG supplied by the owner, stored unchanged as assets/project-logos/curriculum-atlas.png. Its dimensions and hashes are recorded in the project logo source manifest.

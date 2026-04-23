import PropTypes from 'prop-types';
import { BLOCK_SECTION_IDS, CmsImage, CmsLinkButton, DEFAULT_PERSONA_VISUALS, pickVisual } from './shared';

export default function PersonaGridBlock({ block, locale, onNavigate }) {
  const personas = Array.isArray(block.personas) ? block.personas.filter((item) => item?.persona) : [];
  const isArabic = locale === 'ar';

  if (personas.length === 0) {
    return null;
  }

  return (
    <section className="section" id={BLOCK_SECTION_IDS['blocks.persona-grid']}>
      <div className="layout-content-compact">
        <div className="section-head" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
          {block.eyebrow ? <p className="section-head-kicker">{block.eyebrow}</p> : null}
          {block.heading ? (
            <h2 className="section-title text-center">
              {block.heading}
            </h2>
          ) : null}
          {block.description ? <p className="section-head-lead">{block.description}</p> : null}
        </div>
      </div>

      <div className="mt-[34px] grid gap-[21px] md:grid-cols-2">
        {personas.map((persona, index) => (
          <article
            key={`${persona.persona}-${index}`}
            className="grid gap-[13px] rounded-[26px] border border-[rgba(8,66,153,0.12)] bg-white p-[21px] shadow-[0_14px_34px_rgba(8,41,89,0.06)] sm:grid-cols-[1fr_144px] sm:items-center"
          >
            <div>
              <h3 className="text-xl tracking-[-0.02em] text-[#0a2546]">{persona.persona}</h3>
              {persona.pain ? <p className="mt-[13px] text-sm leading-7 text-[#4f6a89]">{persona.pain}</p> : null}
              {persona.desire ? <p className="mt-[13px] text-sm leading-7 text-[#4f6a89]">{persona.desire}</p> : null}
              {persona.result ? <p className="mt-[13px] text-sm leading-7 text-[#0b4f8c]">{persona.result}</p> : null}
              <div className="mt-[21px]">
                <CmsLinkButton link={persona.cta} onNavigate={onNavigate} className="!h-10" />
              </div>
            </div>

            <figure className="overflow-hidden rounded-2xl border border-[rgba(8,66,153,0.08)] bg-[#f5f8ff] p-2">
              <CmsImage
                media={persona.visual || persona.media || persona.image}
                src={pickVisual(DEFAULT_PERSONA_VISUALS, index, '/media/image1.png')}
                alt={persona.persona || 'Persona visual'}
                width={220}
                height={220}
                className="h-auto w-full object-contain"
                sizes="(max-width: 768px) 45vw, 180px"
              />
            </figure>
          </article>
        ))}
      </div>
    </section>
  );
}

PersonaGridBlock.propTypes = {
  block: PropTypes.shape({
    eyebrow: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string,
    personas: PropTypes.array,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']),
  onNavigate: PropTypes.func,
};

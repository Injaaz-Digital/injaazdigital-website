import PropTypes from 'prop-types';

export default function TrustRowBlock({ block }) {
  const items = Array.isArray(block.items) ? block.items.filter((item) => item?.title) : [];

  if (items.length === 0) return null;

  return (
    <section className="section section--tight">
      <div className="grid gap-[13px] rounded-[32px] corner-squircle border border-[rgba(8,66,153,0.12)] bg-white p-[21px] shadow-[0_10px_24px_rgba(8,41,89,0.05)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-[26px] corner-squircle border border-[rgba(8,66,153,0.08)] bg-[#f8fbff] px-[13px] py-[13px]">
            <h3 className="text-sm font-semibold text-[#0a2546]">{item.title}</h3>
            {item.description ? <p className="mt-[8px] text-xs leading-6 text-[#5c7696]">{item.description}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

TrustRowBlock.propTypes = {
  block: PropTypes.shape({
    items: PropTypes.array,
  }).isRequired,
};

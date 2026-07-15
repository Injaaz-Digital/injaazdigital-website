import PropTypes from 'prop-types';
import { CMS_BLOCK_REGISTRY } from '@/features/cms/blocks/registry';

const toAllowedSet = (value) => {
  if (!value) return null;
  if (value instanceof Set) return value;
  if (Array.isArray(value)) return new Set(value);
  return null;
};

export default function CmsBlocksRenderer({
  blocks,
  locale,
  route,
  onNavigate,
  allowedComponents,
  registry = CMS_BLOCK_REGISTRY,
}) {
  const list = Array.isArray(blocks) ? blocks : [];
  const allowed = toAllowedSet(allowedComponents);

  return (
    <>
      {list.map((block, index) => {
        const componentName = block?.__component;
        if (!componentName) {
          return null;
        }

        if (allowed && !allowed.has(componentName)) {
          return null;
        }

        const renderBlock = registry[componentName];
        return renderBlock ? renderBlock({ block, index, locale, route, onNavigate }) : null;
      })}
    </>
  );
}

CmsBlocksRenderer.propTypes = {
  blocks: PropTypes.array,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
  route: PropTypes.string,
  onNavigate: PropTypes.func,
  allowedComponents: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.instanceOf(Set)]),
  registry: PropTypes.object,
};

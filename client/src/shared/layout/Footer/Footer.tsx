import LegacyFooter from '../Footer.jsx';
import type { FooterProps } from './footer.types';
export default function Footer(props: FooterProps) { const Component = LegacyFooter as React.ComponentType<FooterProps>; return <Component {...props} />; }

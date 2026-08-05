'use client';
import LegacyHeader from '../Header.jsx';
import type { HeaderProps } from './header.types';
export default function Header(props: HeaderProps) { const Component = LegacyHeader as React.ComponentType<HeaderProps>; return <Component {...props} />; }

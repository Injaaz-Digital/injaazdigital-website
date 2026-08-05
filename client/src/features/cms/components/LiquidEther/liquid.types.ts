import type { CSSProperties } from 'react';
import type { VisualQuality } from '@/lib/visual/visual-quality';
export interface LiquidEtherProps { mouseForce?: number; cursorSize?: number; isViscous?: boolean; viscous?: number; iterationsViscous?: number; iterationsPoisson?: number; dt?: number; BFECC?: boolean; resolution?: number; isBounce?: boolean; colors?: string[]; style?: CSSProperties; className?: string; autoDemo?: boolean; autoSpeed?: number; autoIntensity?: number; takeoverDuration?: number; autoResumeDelay?: number; autoRampDuration?: number; quality?: VisualQuality }

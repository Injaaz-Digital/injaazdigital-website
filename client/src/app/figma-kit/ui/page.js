'use client';

import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import Textarea from '@/shared/ui/Textarea';
import RadioGroup from '@/shared/ui/RadioGroup';

const noop = () => {};

const buttonVariants = ['primary', 'outline', 'ghost', 'danger', 'warning', 'success', 'info'];
const buttonSizes = ['xs', 'sm', 'md', 'lg', 'xl'];

export default function FigmaKitUiPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4fb_0%,#f8fbff_48%,#ffffff_100%)] px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-[rgba(8,66,153,0.1)] bg-white/86 p-8 shadow-[0_30px_80px_rgba(8,41,89,0.08)] backdrop-blur-sm sm:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6d85a1]">UI Kit</p>
          <h1 className="mt-4 text-[clamp(2.4rem,5vw,4.6rem)] tracking-[-0.05em] text-[#0a2546]">
            Shared interface primitives from <span className="text-[#0b4f8c]">client</span>.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#536d8a]">
            This board is built from the real React components so it can be captured into Figma as a clean reference
            for buttons, inputs, selects, textareas, and radio groups.
          </p>
        </section>

        <section
          data-figma="button-primitives"
          className="rounded-[28px] border border-[rgba(8,66,153,0.1)] bg-white p-8 shadow-[0_18px_40px_rgba(8,41,89,0.06)] sm:p-10"
        >
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d85a1]">Buttons</p>
            <h2 className="mt-3 text-3xl tracking-[-0.04em] text-[#0a2546]">Variants and sizes</h2>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {buttonVariants.map((variant) => (
              <article key={variant} className="rounded-[24px] border border-[rgba(8,66,153,0.08)] bg-[#f8fbff] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b91ab]">{variant}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {buttonSizes.map((size) => (
                    <Button key={`${variant}-${size}`} variant={variant} size={size}>
                      {`${variant} ${size}`}
                    </Button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          data-figma="form-primitives"
          className="rounded-[28px] border border-[rgba(8,66,153,0.1)] bg-white p-8 shadow-[0_18px_40px_rgba(8,41,89,0.06)] sm:p-10"
        >
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d85a1]">Forms</p>
            <h2 className="mt-3 text-3xl tracking-[-0.04em] text-[#0a2546]">Inputs and field states</h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[24px] border border-[rgba(8,66,153,0.08)] bg-[#f8fbff] p-6">
              <Input id="preview-name" name="preview-name" label="Full name" hint="Helper text for an input field." placeholder="Aymen El Hamiani" />
            </div>

            <div className="rounded-[24px] border border-[rgba(8,66,153,0.08)] bg-[#f8fbff] p-6">
              <Input
                id="preview-email"
                name="preview-email"
                type="email"
                label="Email"
                error="Please use a valid business email."
                value="hello@"
                onChange={noop}
              />
            </div>

            <div className="rounded-[24px] border border-[rgba(8,66,153,0.08)] bg-[#f8fbff] p-6">
              <Select id="preview-service" name="preview-service" label="Primary service" defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                <option value="growth">Growth Engine</option>
                <option value="studio">Web Studio</option>
                <option value="audit">Funnel Audit</option>
              </Select>
            </div>

            <div className="rounded-[24px] border border-[rgba(8,66,153,0.08)] bg-[#f8fbff] p-6">
              <Textarea
                id="preview-brief"
                name="preview-brief"
                label="Project brief"
                hint="A longer text pattern for discovery forms and contact pages."
                placeholder="We need a cleaner website, stronger CTA structure, and a tighter lead flow."
              />
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-[rgba(8,66,153,0.08)] bg-[#f8fbff] p-6">
            <RadioGroup
              id="preview-budget"
              name="preview-budget"
              label="Budget range"
              value="10000-20000"
              onChange={noop}
              options={[
                { value: '5000-10000', label: '5K-10K' },
                { value: '10000-20000', label: '10K-20K' },
                { value: '20000+', label: '20K+' },
                { value: 'discuss', label: 'Need to discuss' },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

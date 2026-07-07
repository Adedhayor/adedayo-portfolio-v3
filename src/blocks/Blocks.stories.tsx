import type { Meta, StoryObj } from '@storybook/react-vite'
import Nav from './Nav'
import Hero from './Hero'
import ProjectGrid from './ProjectGrid'
import ClientLogos from './ClientLogos'
import Services from './Services'
import TestimonialBand from './TestimonialBand'
import Contact from './Contact'
import FooterWordmark from './FooterWordmark'

// Composable portfolio blocks. Each is a full-width section; the
// FullPage story shows them assembled into a portfolio.
const meta = {
  title: 'Blocks',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const NavBlock: Story = { name: 'Nav', render: () => <Nav /> }
export const HeroBlock: Story = { name: 'Hero', render: () => <Hero /> }
export const ProjectGridBlock: Story = { name: 'Projects', render: () => <ProjectGrid /> }
export const ClientLogosBlock: Story = { name: 'ClientLogos', render: () => <ClientLogos /> }
export const ServicesBlock: Story = { name: 'Services', render: () => <Services /> }
export const TestimonialBandBlock: Story = { name: 'TestimonialBand', render: () => <TestimonialBand /> }
export const ContactBlock: Story = { name: 'Contact', render: () => <Contact /> }
export const FooterWordmarkBlock: Story = { name: 'Footer', render: () => <FooterWordmark /> }

/* ---------- Responsive variants (mobile viewport) ---------- */
export const NavMobile: Story = {
  name: 'Nav — Mobile',
  globals: { viewport: { value: 'mobile' } },
  render: () => <Nav />,
}
export const HeroMobile: Story = {
  name: 'Hero — Mobile',
  globals: { viewport: { value: 'mobile' } },
  render: () => <Hero />,
}
export const ServicesMobile: Story = {
  name: 'Services — Mobile',
  globals: { viewport: { value: 'mobile' } },
  render: () => <Services />,
}
export const ContactMobile: Story = {
  name: 'Contact — Mobile',
  globals: { viewport: { value: 'mobile' } },
  render: () => <Contact />,
}

/* ---------- Content variants ---------- */
export const ServicesTight: Story = {
  name: 'Services — Three',
  render: () => (
    <Services
      title="What I do."
      services={[
        { name: 'Design Systems', note: 'Token-based, accessible' },
        { name: 'Product Design', note: 'Complex flows made simple' },
        { name: 'Design Engineering', note: 'Design + ship in code' },
      ]}
    />
  ),
}

/** All blocks stacked — a full portfolio composed from Optimus. */
export const FullPage: Story = {
  name: 'Full Page (composed)',
  render: () => (
    <div className="bg-opt-surface-base">
      <Nav />
      <Hero />
      <ClientLogos />
      <ProjectGrid />
      <Services />
      <TestimonialBand />
      <Contact />
      <FooterWordmark />
    </div>
  ),
}

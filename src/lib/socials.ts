import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";
import { type SocialType } from "@/components/ui/social-hover-card";
import resumeData from "@/data/resume.json";
import socialsData from "@/data/socials.json";

export interface SocialLinkItem {
  href: string;
  icon: typeof GitHubIcon;
  label: string;
  type: SocialType;
}

export const socialLinks: SocialLinkItem[] = [
  {
    href: socialsData.github?.url || resumeData.personal.github,
    icon: GitHubIcon,
    label: socialsData.github?.platform || "GitHub",
    type: "github",
  },
  {
    href: socialsData.linkedin?.url || resumeData.personal.linkedin,
    icon: LinkedInIcon,
    label: socialsData.linkedin?.platform || "LinkedIn",
    type: "linkedin",
  },
  {
    href: `mailto:${socialsData.email?.address || resumeData.personal.email}`,
    icon: MailIcon,
    label: socialsData.email?.platform || "Email",
    type: "email",
  },
];

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Clickdown",
  description: "Clickdown é uma ferramenta estilo kanban. Organize suas tarefas de forma visual e eficiente.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Sobre",
      href: "/sobre",
    },
    {
      label: "Contato",
      href: "/contato",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Equipes",
      href: "/Equipes",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/ClickDown99",
  },
};

export interface MenuItemTypes {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  parentKey?: string;
  target?: string;
  children?: MenuItemTypes[];
}

const MENU_ITEMS: MenuItemTypes[] = [
  {
    key: 'menu',
    label: 'Menu Setting',
    isTitle: true,
  },
  {
    key: 'home',
    label: 'Home',
    isTitle: false,
    icon: 'mgc_home_3_line',
    url: '/home'
  },
  {
    key: 'workplace',
    label: 'Work Place',
    isTitle: false,
    icon: 'mgc_home_3_line',
    url: '/workplace'
  },
  {
    key: 'agency',
    label: 'Agency',
    isTitle: false,
    icon: 'mgc_home_3_line',
    url: '/agency'
  },
  {
    key: 'jobtype',
    label: 'Job Type',
    isTitle: false,
    icon: 'mgc_home_3_line',
    url: '/jobtype'
  },
  {
    key: 'question-choice',
    label: 'Question And Choice',
    isTitle: false,
    icon: 'mgc_home_3_line',
    url: '/question-choice'
  }
];

export { MENU_ITEMS };

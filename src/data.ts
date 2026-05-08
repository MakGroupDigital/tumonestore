export interface AppData {
  id: string;
  name: string;
  developer: string;
  category: string;
  rating: number;
  reviews: string;
  size: string;
  icon: string;
  description: string;
  screenshots: string[];
  iosUrl?: string;
  pwaUrl?: string;
  isVerified: boolean;
}

export const APPS: AppData[] = [
  {
    id: '1',
    name: 'Ekonzo',
    developer: 'Groupe Tumone SARLU',
    category: 'Shopping',
    rating: 5.0,
    reviews: '2.5K',
    size: '15.2 MB',
    icon: 'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646601/tumone-store/apps/ekonzo/ekonzoLogo.png',
    description: 'Ekonzo révolutionne l\'achat avec son système d\'achat progressif. Achetez électroménager, mobilier, meubles, services et bien plus encore de manière progressive et flexible. Une nouvelle façon d\'acquérir ce dont vous avez besoin sans contraintes financières.',
    screenshots: [
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646660/tumone-store/apps/ekonzo/Ekonzo._Screen_1.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646664/tumone-store/apps/ekonzo/Ekonzo._Screen_2.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646669/tumone-store/apps/ekonzo/Ekonzo._Screen_3.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646673/tumone-store/apps/ekonzo/Ekonzo._Screen_4.png',
    ],
    pwaUrl: 'https://ekonzoapp.gtsarlu.com/',
    iosUrl: 'https://ekonzoapp.gtsarlu.com/',
    isVerified: true,
  },
  {
    id: '2',
    name: 'ChooseMe',
    developer: 'Groupe Tumone SARLU',
    category: 'Sports',
    rating: 4.9,
    reviews: '15K',
    size: '28.7 MB',
    icon: 'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646606/tumone-store/apps/ChooseMe/choosemelogo.png',
    description: 'ChooseMe est le réseau social du scouting sportif. Jeunes talents sportifs, postez vos vidéos de performance et soyez repérés par des recruteurs et clubs du monde entier. Votre tremplin vers une carrière sportive professionnelle.',
    screenshots: [
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611931/tumone-store/apps/ChooseMe/Choo._Screen01.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611927/tumone-store/apps/ChooseMe/Choo._Screen_02.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611930/tumone-store/apps/ChooseMe/Choo._Screen_03.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611933/tumone-store/apps/ChooseMe/Choo._Screen04.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611934/tumone-store/apps/ChooseMe/Choo._Screen05.png',
    ],
    pwaUrl: 'https://choosemeapp.gtsarlu.com/',
    iosUrl: 'https://choosemeapp.gtsarlu.com/',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Un+',
    developer: 'Groupe Tumone SARLU',
    category: 'Education',
    rating: 4.8,
    reviews: '8.2K',
    size: '12.4 MB',
    icon: 'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646613/tumone-store/apps/Un%2B/logo.png',
    description: 'Un+ est votre plateforme de formations en ligne avec des professionnels experts. Accédez à des cours de qualité, développez vos compétences et apprenez auprès des meilleurs dans leur domaine. L\'éducation professionnelle à portée de main.',
    screenshots: [
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646678/tumone-store/apps/Un%2B/ecran_Un_1.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646686/tumone-store/apps/Un%2B/ecran_Un_2.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646691/tumone-store/apps/Un%2B/ecran_Un_3.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646697/tumone-store/apps/Un%2B/ecran_Un_4.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646701/tumone-store/apps/Un%2B/ecran_Un_5.png',
    ],
    pwaUrl: 'https://unplus.groupetumone-sarlu.com',
    iosUrl: 'https://unplus.groupetumone-sarlu.com',
    isVerified: true,
  },
];

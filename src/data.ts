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
  androidUrl?: string;
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
    size: '25 MB',
    icon: 'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646601/tumone-store/apps/ekonzo/ekonzoLogo.png',
    description: 'Ekonzo révolutionne l\'achat avec son système d\'achat progressif. Achetez électroménager, mobilier, meubles, services et bien plus encore de manière progressive et flexible. Une nouvelle façon d\'acquérir ce dont vous avez besoin sans contraintes financières.',
    screenshots: [
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646660/tumone-store/apps/ekonzo/Ekonzo._Screen_1.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646664/tumone-store/apps/ekonzo/Ekonzo._Screen_2.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646669/tumone-store/apps/ekonzo/Ekonzo._Screen_3.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646673/tumone-store/apps/ekonzo/Ekonzo._Screen_4.png',
    ],
    androidUrl: '/App/ekonzo/ekonzo-vercel-v2.0.0-20260314_150437.apk',
    isVerified: true,
  },
  {
    id: '2',
    name: 'ChooseMe',
    developer: 'Groupe Tumone SARLU',
    category: 'Sports',
    rating: 4.9,
    reviews: '15K',
    size: '32 MB',
    icon: 'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646606/tumone-store/apps/ChooseMe/choosemelogo.png',
    description: 'ChooseMe est le réseau social du scouting sportif. Jeunes talents sportifs, postez vos vidéos de performance et soyez repérés par des recruteurs et clubs du monde entier. Votre tremplin vers une carrière sportive professionnelle.',
    screenshots: [
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611931/tumone-store/apps/ChooseMe/Choo._Screen01.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611927/tumone-store/apps/ChooseMe/Choo._Screen_02.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611930/tumone-store/apps/ChooseMe/Choo._Screen_03.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611933/tumone-store/apps/ChooseMe/Choo._Screen04.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773611934/tumone-store/apps/ChooseMe/Choo._Screen05.png',
    ],
    androidUrl: '/App/ChooseMe/choose-me-release.apk',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Un+',
    developer: 'Groupe Tumone SARLU',
    category: 'Education',
    rating: 4.8,
    reviews: '8.2K',
    size: '28 MB',
    icon: 'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646613/tumone-store/apps/Un%2B/logo.png',
    description: 'Un+ est votre plateforme de formations en ligne avec des professionnels experts. Accédez à des cours de qualité, développez vos compétences et apprenez auprès des meilleurs dans leur domaine. L\'éducation professionnelle à portée de main.',
    screenshots: [
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646678/tumone-store/apps/Un%2B/ecran_Un_1.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646686/tumone-store/apps/Un%2B/ecran_Un_2.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646691/tumone-store/apps/Un%2B/ecran_Un_3.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646697/tumone-store/apps/Un%2B/ecran_Un_4.png',
      'https://res.cloudinary.com/dy73hzkpm/image/upload/v1773646701/tumone-store/apps/Un%2B/ecran_Un_5.png',
    ],
    androidUrl: '/App/Un+/application-7dc5062e-f269-4d55-885c-6879d261c84c.apk',
    isVerified: true,
  },
  {
    id: '4',
    name: 'WhatsApp',
    developer: 'Meta',
    category: 'Social',
    rating: 4.8,
    reviews: '150M',
    size: '45 MB',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    description: 'Simple. Reliable. Private. WhatsApp from Meta is a free messaging and video calling app used by over 2B people in more than 180 countries.',
    screenshots: [
      'https://picsum.photos/seed/wa1/800/1200',
      'https://picsum.photos/seed/wa2/800/1200',
      'https://picsum.photos/seed/wa3/800/1200',
    ],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.whatsapp',
    iosUrl: 'https://apps.apple.com/app/whatsapp-messenger/id310633997',
    isVerified: true,
  },
  {
    id: '5',
    name: 'Instagram',
    developer: 'Meta',
    category: 'Social',
    rating: 4.7,
    reviews: '120M',
    size: '52 MB',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
    description: 'Bringing you closer to the people and things you love. Connect with friends, share what you’re up to, or see what’s new from others all over the world.',
    screenshots: [
      'https://picsum.photos/seed/ig1/800/1200',
      'https://picsum.photos/seed/ig2/800/1200',
    ],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.instagram.android',
    iosUrl: 'https://apps.apple.com/app/instagram/id389801252',
    isVerified: true,
  },
  {
    id: '6',
    name: 'Spotify',
    developer: 'Spotify AB',
    category: 'Music',
    rating: 4.9,
    reviews: '80M',
    size: '38 MB',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    description: 'With Spotify, you have access to a world of free music, curated playlists, artists, and podcasts you love. Discover new music, podcasts, top songs or listen to your favorite artists, albums.',
    screenshots: [
      'https://picsum.photos/seed/sp1/800/1200',
      'https://picsum.photos/seed/sp2/800/1200',
    ],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.spotify.music',
    iosUrl: 'https://apps.apple.com/app/spotify-music/id324684580',
    isVerified: true,
  },
  {
    id: '7',
    name: 'Tumone Pay',
    developer: 'Tumone Corp',
    category: 'Finance',
    rating: 5.0,
    reviews: '10K',
    size: '12 MB',
    icon: 'https://picsum.photos/seed/tumone/200/200',
    description: 'The fastest way to pay and receive money. Secure, elegant, and built for the future of finance.',
    screenshots: [
      'https://picsum.photos/seed/tp1/800/1200',
      'https://picsum.photos/seed/tp2/800/1200',
    ],
    pwaUrl: 'https://pay.tumone.com',
    isVerified: true,
  },
  {
    id: '8',
    name: 'CapCut',
    developer: 'Bytedance Pte. Ltd.',
    category: 'Video',
    rating: 4.6,
    reviews: '1.1M',
    size: '835 MB',
    icon: '/assets/apps/capcut/icon.png',
    description: 'CapCut is a free, all-in-one video editor with templates, auto captions, and advanced effects.',
    screenshots: [
      'https://play-lh.googleusercontent.com/vKLYSTe8y2IQ9qYRkk9h4jCBf19HarELDRFBEZa9GtD9fhXXBQporQe2z9kSBx9TfK4E',
      'https://play-lh.googleusercontent.com/tYhbP7MFgRa1lvNn3MOeu3wZNFucZOS4Of--sDOgCS7duVmyCYS-iM1XOeV8vpEEL7M',
      'https://play-lh.googleusercontent.com/IVQkGcsI12Qca4a7RoH0FtrlnXnmY0eo9OgTQy3EhZaHHoFZB9IGr-4D04MjP1r5dY8',
    ],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.lemon.lvoverseas',
    iosUrl: 'https://apps.apple.com/app/capcut-video-editor/id1500855883',
    isVerified: true,
  },
  {
    id: '9',
    name: 'TikTok',
    developer: 'TikTok Ltd.',
    category: 'Social',
    rating: 4.7,
    reviews: '18M',
    size: '738.2 MB',
    icon: '/assets/apps/tiktok/icon.png',
    description: 'TikTok is the destination for short-form video. Watch, create, and share videos from creators worldwide.',
    screenshots: [
      '/assets/apps/tiktok/screens/01.png',
      '/assets/apps/tiktok/screens/02.png',
      '/assets/apps/tiktok/screens/03.png',
      '/assets/apps/tiktok/screens/04.png',
    ],
    androidUrl: 'https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically',
    iosUrl: 'https://apps.apple.com/app/tiktok/id1235601822',
    isVerified: true,
  }
];

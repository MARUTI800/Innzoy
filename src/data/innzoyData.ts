import { Property, Review } from '../types';

const IMG = 'https://innzoy.in/wp-content/uploads';

export const BRAND = {
  name: 'INNZOY',
  subname: 'HOTELS & GUEST HOUSES',
  headline: 'Experience Affordable Luxury in the Heart of Hyderabad',
  tagline: 'Stay. Explore. Repeat.',
  heroImage: `${IMG}/2025/10/Hotel-Main-Elevation-e1763746501737.jpg`,
  stats: [
    { value: '4.8', label: 'Overall Rating' },
    { value: '98%', label: 'Guest Satisfaction' },
    { value: '24/7', label: 'Guest Service' },
  ],
  contact: {
    email: 'enquiry@innzoy.in',
    phone: '+91 85209 63096',
    whatsapp: '918520963096',
    instagram: 'https://www.instagram.com/innzoy_hotels/',
    headOffice:
      'Innzoy Hotels and Guesthouses, 4th Floor, Sri Sai Sigma 2, Kondapur, Hyderabad, Telangana 500084',
  },
  desks: [
    { name: 'Khajaguda', phone: '+91 96666 37773', whatsapp: '919666637773' },
    { name: 'DLF Road', phone: '+91 87906 67333', whatsapp: '918790667333' },
    { name: 'TNGO Colony', phone: '+91 87906 45333', whatsapp: '918790645333' },
    { name: 'Guest Houses', phone: '+91 85209 63096', whatsapp: '918520963096' },
  ],
};

export const waLink = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const CORPORATE_BOOKING_URL = waLink(
  BRAND.contact.whatsapp,
  'Hello, I am interested in a corporate booking at Innzoy Hotels. Please share details on corporate rates, availability and invoicing.'
);

const HOTEL_AMENITIES = [
  'Free Wi-Fi',
  'Air Conditioning',
  'Daily Housekeeping',
  '24/7 Front Desk',
  'Power Backup',
  'CCTV Security',
  'Room Service',
  'Free Parking',
];

const GUESTHOUSE_AMENITIES = [
  'Free Wi-Fi',
  'Air Conditioning',
  'Fully Equipped Kitchen',
  'Washing Machine',
  'Housekeeping',
  'Free Parking',
  'Self Check-in',
  'Workspace',
];

export const PROPERTIES: Property[] = [
  {
    id: 'khajaguda',
    name: 'Khajaguda',
    slug: 'khajaguda',
    category: 'hotel',
    label: 'Innzoy Hotels',
    locality: 'Khajaguda, Hyderabad',
    address:
      'H.No: 3, 73/40/P/36, Chitrapuri Colony High Tower Rd, opp. Klay School, Chitrapuri Colony, Khajaguda, Hyderabad, Telangana 500104',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Innzoy+Hotels+Chitrapuri+Colony+Khajaguda+Hyderabad',
    description:
      'Our Khajaguda hotel sits minutes from Chitrapuri Colony and the Outer Ring Road, with clean, well-appointed rooms for business and family stays.',
    heroImage: `${IMG}/2025/10/khajaguda1-1024x683.webp`,
    gallery: [
      `${IMG}/2025/10/khajaguda1-1024x683.webp`,
      `${IMG}/2025/10/khajaguda2-1024x683.webp`,
      `${IMG}/2025/10/khajaguda3-1024x683.webp`,
      `${IMG}/2025/10/khajaguda4-1-683x1024.webp`,
      `${IMG}/2025/10/khajaguda5-683x1024.webp`,
    ],
    amenities: HOTEL_AMENITIES,
    weekdayPrice: '₹1499',
    weekendPrice: '₹1999',
    startingPrice: 1499,
    whatsapp: '919666637773',
    phoneDisplay: '+91 96666 37773',
  },
  {
    id: 'dlf-road',
    name: 'DLF Road',
    slug: 'dlf-road',
    category: 'hotel',
    label: 'Innzoy Hotels',
    locality: 'Gachibowli, Hyderabad',
    address:
      'RK Square, House No 155, Hig A, Survey No 132, Phase 4, AP Housing Board Colony, Gachibowli, Rangareddy District, Telangana 500032',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=INNZOY+Hotels+DLF+Road+Gachibowli+Hyderabad',
    description:
      'Close to the DLF and Gachibowli business corridor, this property is built for short work trips and weekend stays alike.',
    heroImage: `${IMG}/2025/10/Premium-Room-Main-Picture-1-1024x683.webp`,
    gallery: [
      `${IMG}/2025/10/Premium-Room-Main-Picture-1-1024x683.webp`,
      `${IMG}/2025/10/Premium-Room-4-1024x768.webp`,
      `${IMG}/2025/10/Reception-Area-1-scaled-e1763746659674-1014x1024.jpg`,
      `${IMG}/2025/10/IMG-20250327-WA0060-scaled-e1763746778450-1024x730.webp`,
      `${IMG}/2025/10/Premium-Bathroom-scaled-e1761123063348-734x1024.webp`,
    ],
    amenities: HOTEL_AMENITIES,
    weekdayPrice: '₹1799',
    weekendPrice: '₹2199',
    startingPrice: 1799,
    whatsapp: '918790667333',
    phoneDisplay: '+91 87906 67333',
  },
  {
    id: 'tngo-colony',
    name: 'TNGO Colony',
    slug: 'tngo-colony',
    category: 'hotel',
    label: 'Innzoy Hotels',
    locality: 'Manikonda, Hyderabad',
    address:
      'Sri Venkateshwara Nilayam, Plot No: 572/A, TNGOS Colony, Manikonda Jagir Village, Gachibowli, Hyderabad, Rangareddy District, Telangana 500032',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Innzoy+Hotels+TNGO+Colony+Manikonda+Hyderabad',
    description:
      'A quiet residential address in TNGO Colony, within easy reach of Manikonda, Gachibowli and the Financial District.',
    heroImage: `${IMG}/2025/10/Hotel-Elevation-scaled-e1763746717718-1024x879.jpg`,
    gallery: [
      `${IMG}/2025/10/Hotel-Elevation-scaled-e1763746717718-1024x879.jpg`,
      `${IMG}/2025/10/Deluxe-Room-1-1024x683.jpg`,
      `${IMG}/2025/10/Deluxe-Room-2-1024x683.jpg`,
      `${IMG}/2025/10/Executive-Room-2-1024x683.jpg`,
      `${IMG}/2025/10/Executive-Bathroom-1-683x1024.jpg`,
    ],
    amenities: HOTEL_AMENITIES,
    weekdayPrice: '₹1299',
    weekendPrice: '₹1799',
    startingPrice: 1299,
    whatsapp: '918790645333',
    phoneDisplay: '+91 87906 45333',
  },
  {
    id: 'hitec-city',
    name: 'HITEC City',
    slug: 'hitec-city',
    category: 'hotel',
    label: 'Innzoy Comforts',
    locality: 'HITEC City, Hyderabad',
    address:
      'Street Number 5, behind Medicover Hospitals Road, Patrika Nagar, HITEC City, Hyderabad, Telangana 500081',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Innzoy+Comforts+Patrika+Nagar+HITEC+City+Hyderabad',
    description:
      'Our newest address in Patrika Nagar, steps from the HITEC City tech parks and Medicover Hospitals.',
    heroImage: `${IMG}/2026/02/1-1.png`,
    gallery: [
      `${IMG}/2026/02/1-1.png`,
      `${IMG}/2026/02/2-1.png`,
      `${IMG}/2026/02/3-1.png`,
      `${IMG}/2026/02/4-1.png`,
      `${IMG}/2026/02/5-1.png`,
    ],
    amenities: HOTEL_AMENITIES,
    weekdayPrice: '₹1899',
    weekendPrice: '₹2199',
    startingPrice: 1899,
    whatsapp: '918520963096',
    phoneDisplay: '+91 85209 63096',
  },
  {
    id: 'jubilee-hills',
    name: 'Jubilee Hills',
    slug: 'jubilee-hills',
    category: 'guesthouse',
    label: 'Innzoy Guest House',
    locality: 'Jubilee Hills, Hyderabad',
    address: 'MP and MLAs Colony, Jubilee Hills, Hyderabad, Telangana 500033',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Innzoy+Guest+Houses+Jubilee+Hills+Hyderabad',
    description:
      'A full guest house in MP and MLAs Colony — private rooms, a shared kitchen and living space, suited to longer stays.',
    heroImage: `${IMG}/2025/10/jublie-hills-room-view-768x1024.jpg`,
    gallery: [
      `${IMG}/2025/10/jublie-hills-room-view-768x1024.jpg`,
      `${IMG}/2025/10/jublie-hill-bedroom-2-768x1024.jpg`,
      `${IMG}/2025/10/jublie-hill-dining-area-768x1024.jpg`,
      `${IMG}/2025/10/jublie-hills-classy-washroom-768x1024.jpg`,
      `${IMG}/2025/10/jublie-hills-balcony-768x1024.jpg`,
    ],
    amenities: GUESTHOUSE_AMENITIES,
    whatsapp: '918520963096',
    phoneDisplay: '+91 85209 63096',
    bookingUrl: 'https://www.airbnb.co.in/rooms/1203364949527640045',
  },
  {
    id: 'manikonda',
    name: 'Manikonda',
    slug: 'manikonda',
    category: 'guesthouse',
    label: 'Innzoy Guest House',
    locality: 'Manikonda, Hyderabad',
    address: 'O.U Colony, Reddy Street, Manikonda, Hyderabad, Telangana 500104',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Innzoy+Guest+House+OU+Colony+Reddy+Street+Manikonda+Hyderabad',
    description:
      'A self-contained guest house on Reddy Street, close to Manikonda market and a short drive from Gachibowli.',
    heroImage: `${IMG}/2025/10/Manikonda-hall-1024x768.jpg`,
    gallery: [
      `${IMG}/2025/10/Manikonda-hall-1024x768.jpg`,
      `${IMG}/2025/10/Manikonda-bedroom-768x1024.jpg`,
      `${IMG}/2025/10/Manikonda-kitchen2-768x1024.jpg`,
      `${IMG}/2025/10/Manikonda-chilling-area-768x1024.jpg`,
      `${IMG}/2025/10/Manikonda-washroom-768x1024.jpg`,
    ],
    amenities: GUESTHOUSE_AMENITIES,
    whatsapp: '918520963096',
    phoneDisplay: '+91 85209 63096',
    bookingUrl: 'https://airbnb.com/h/svnpenthouse',
  },
  {
    id: 'kondapur',
    name: 'Kondapur',
    slug: 'kondapur',
    category: 'guesthouse',
    label: 'Innzoy Penthouse',
    locality: 'Kondapur, Hyderabad',
    address: '1902, Kondapur, JV Hills, Hyderabad, Telangana 500084',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Innzoy+Guest+House+Kondapur+JV+Hills+Hyderabad',
    description:
      'A penthouse stay in JV Hills with open terrace space, a full kitchen and room for families or small groups.',
    heroImage: `${IMG}/2025/11/cozy-1bhk-penthouse-8-1024x768.avif`,
    gallery: [
      `${IMG}/2025/11/cozy-1bhk-penthouse-8-1024x768.avif`,
      `${IMG}/2025/11/cozy-1bhk-penthouse-7-1024x768.avif`,
      `${IMG}/2025/11/cozy-1bhk-penthouse-3.avif`,
      `${IMG}/2025/11/cozy-1bhk-penthouse-4.avif`,
      `${IMG}/2025/11/cozy-1bhk-penthouse-6.avif`,
    ],
    amenities: GUESTHOUSE_AMENITIES,
    whatsapp: '918520963096',
    phoneDisplay: '+91 85209 63096',
    bookingUrl: 'https://airbnb.com/h/nnest',
  },
  {
    id: 'gopanpally',
    name: 'Gopanpally',
    slug: 'gopanpally',
    category: 'guesthouse',
    label: 'Innzoy Living',
    locality: 'Gopanpally, Hyderabad',
    address:
      'Road No 27, Plot No 319, Journalists Colony, Gopanpally, Hyderabad, Telangana 500046',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Innzoy+Living+Journalists+Colony+Gopanpally+Hyderabad',
    description:
      'A quiet Journalists Colony address in Gopanpally, close to the Financial District and ISB.',
    heroImage: `${IMG}/2026/02/7-1.png`,
    gallery: [
      `${IMG}/2026/02/7-1.png`,
      `${IMG}/2026/02/8-1.png`,
      `${IMG}/2026/02/9-1.png`,
      `${IMG}/2026/02/10-1.png`,
      `${IMG}/2026/02/11-1.png`,
    ],
    amenities: GUESTHOUSE_AMENITIES,
    whatsapp: '918520963096',
    phoneDisplay: '+91 85209 63096',
    bookingUrl: 'https://www.airbnb.co.in/rooms/1544890117082598124',
  },
  {
    id: 'mokila',
    name: 'Mokila',
    slug: 'mokila',
    category: 'guesthouse',
    label: 'Innzoy Guest House',
    locality: 'Mokila, Hyderabad',
    address: 'Mokila, Hyderabad, Telangana',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mokila+Hyderabad',
    description: 'Our next guest house, opening soon in Mokila.',
    heroImage: `${IMG}/2025/10/Frame-38.webp`,
    gallery: [`${IMG}/2025/10/Frame-38.webp`],
    amenities: GUESTHOUSE_AMENITIES,
    comingSoon: true,
    whatsapp: '918520963096',
    phoneDisplay: '+91 85209 63096',
  },
];

export const HOTELS = PROPERTIES.filter((p) => p.category === 'hotel');
export const GUEST_HOUSES = PROPERTIES.filter((p) => p.category === 'guesthouse');

export const REVIEWS: Review[] = [
  {
    name: 'Pranav R',
    rating: '4.9',
    title: 'Great service & comfort',
    text: 'Innzoy Hotels delivers great service with warm and comfortable staff. The rooms are spotless, neat, and well maintained, making the stay truly pleasant.',
  },
  {
    name: 'Dr. Jawwad Patel',
    rating: '5.0',
    title: 'Excellent experience',
    text: 'An absolutely wonderful hotel experience! The staff were extremely friendly and welcoming, and the check-in was unbelievably fast — just 2 minutes. The ambience is comfortable and pleasant. I highly recommend Innzoy for anyone staying near the Khajaguda location.',
  },
  {
    name: 'Neha Saurabh',
    rating: '4.8',
    title: 'Premium yet affordable',
    text: 'Excellent rooms with all essential amenities and highly professional, well mannered staff. Ideal for both business and family stays. Great ambience, spotless maintenance, cooperative staff, all at a very affordable price.',
  },
  {
    name: 'Sudhindra Kar',
    rating: '4.7',
    title: 'Friendly staff',
    text: 'Wonderful service by the INNZOY team. The staff are very friendly and always ready to help, making the stay smooth and enjoyable.',
  },
];

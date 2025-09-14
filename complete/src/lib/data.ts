export type Item = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  dateLost: string;
  category: "Electronics" | "Laptops & Chargers" | "Keys" | "Wallets" | "Student IDs" | "Clothing" | "Bags" | "Water Bottles" | "Books" | "Personal Items" | "Other";
  status: "Lost" | "Found" | "Claimed";
  userId: string;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Message = {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  receiverId: string;
}

export const users: User[] = [
  { id: 'user-1', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/user-1/40/40' },
  { id: 'user-2', name: 'Bob', avatarUrl: 'https://picsum.photos/seed/user-2/40/40' },
];

export const items: Item[] = [
  {
    id: "7",
    name: "Blue Student ID Card",
    description: "A student ID for RGUKT with the name 'Test User'. It's in a clear plastic sleeve.",
    imageUrl: "https://picsum.photos/seed/item-7/600/400",
    location: "Library, 2nd Floor",
    dateLost: new Date().toISOString(),
    category: "Student IDs",
    status: "Lost",
    userId: 'user-2',
  },
  {
    id: "1",
    name: "Classic Ray-Ban Sunglasses",
    description: "A pair of black Ray-Ban Wayfarer sunglasses in a black case. Last seen near the main fountain in the central park. They have a small scratch on the right lens.",
    imageUrl: "https://picsum.photos/seed/item-1/600/400",
    location: "Central Park, by the fountain",
    dateLost: "2024-07-15",
    category: "Personal Items",
    status: "Lost",
    userId: 'user-1',
  },
  {
    id: "2",
    name: "iPhone 14 Pro",
    description: "A deep purple iPhone 14 Pro with a clear case. The wallpaper is a picture of a golden retriever puppy. It has a small crack on the top left corner of the screen.",
    imageUrl: "https://picsum.photos/seed/item-2/600/400",
    location: "Seat 14C, Flight UA482 to SFO",
    dateLost: "2024-07-20",
    category: "Electronics",
    status: "Lost",
    userId: 'user-2',
  },
  {
    id: "3",
    name: "Leather Wallet",
    description: "Brown leather bifold wallet, slightly worn. Contained a driver's license for 'John Smith' and a few credit cards. Also had a sentimental photo of a family.",
    imageUrl: "https://picsum.photos/seed/item-3/600/400",
    location: "Grand Central Terminal, near track 23",
    dateLost: "2024-07-21",
    category: "Wallets",
    status: "Found",
    userId: 'user-1',
  },
  {
    id: "4",
    name: "Car Keys - Toyota",
    description: "A single Toyota car key with a small silver keychain that has the initial 'B' on it. There's also a small grocery store loyalty tag attached.",
    imageUrl: "https://picsum.photos/seed/item-4/600/400",
    location: "Parking Lot 4B, Westfield Mall",
    dateLost: "2024-07-18",
    category: "Keys",
    status: "Lost",
    userId: 'user-2',
  },
   {
    id: "5",
    name: "Kindle Paperwhite",
    description: "Black Kindle Paperwhite with a dark blue cover. The screen saver shows abstract art. It was left on a bench at the city library's garden.",
    imageUrl: "https://picsum.photos/seed/item-5/600/400",
    location: "City Library Garden",
    dateLost: "2024-07-22",
    category: "Electronics",
    status: "Claimed",
    userId: 'user-1',
  },
  {
    id: "6",
    name: "Red Umbrella",
    description: "A large, bright red umbrella with a wooden handle. It has no brand name on it. Left on the 5th Ave bus.",
    imageUrl: "https://picsum.photos/seed/item-6/600/400",
    location: "5th Avenue Bus",
    dateLost: "2024-07-19",
    category: "Other",
    status: "Lost",
    userId: 'user-2',
  },
];

export const messages = {
  '1': [
    { id: 'msg-1', text: "Hi, I think you might have my sunglasses. Can you describe the scratch on them?", timestamp: "2024-07-23T10:00:00Z", senderId: 'user-1', receiverId: 'finder-1' },
    { id: 'msg-2', text: "Sure, it's a small vertical scratch on the right lens, near the top.", timestamp: "2024-07-23T10:02:00Z", senderId: 'finder-1', receiverId: 'user-1' },
    { id: 'msg-3', text: "That's them! Thank you so much for finding them. Where can I meet you to pick them up?", timestamp: "2024-07-23T10:03:00Z", senderId: 'user-1', receiverId: 'finder-1' },
  ]
};

    
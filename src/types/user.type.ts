export type TUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin"; // extend if needed
  photoUrl?: string;
  phone?: string;
  fullAddress?: string;
  country?: string;
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export type TResponseUser = {
  name: string;
  email: string;
  role: "user" | "admin";
  exp: number;
  iat: number;
};

// export type TDecodedUser = {
//   name: string;
//   email: string;
//   role: "user" | "admin";
// };

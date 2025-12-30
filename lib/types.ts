export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  presentation: string;
  image?: string;
  priceContainer: string;
  pricePallet: string;
  priceBox: string;
  status: 'active' | 'offer' | 'featured';
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  phones: string[];
  whatsapps: string[];
}

export interface LocalDelivery {
  capacity: string;
  priceRange: string;
}

export interface NationalDelivery {
  cities: Array<{
    name: string;
    province: string;
  }>;
}

export interface CatalogData {
  products: Product[];
  contact: ContactInfo;
  localDelivery: LocalDelivery;
  nationalDelivery: NationalDelivery;
  companyName: string;
  companyTagline: string;
  catalogIntro: string;
}

export interface AdminUser {
  username: string;
  password: string; // Hasheado
}

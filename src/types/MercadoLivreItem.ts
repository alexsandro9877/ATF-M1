export interface MercadoLivreRespItem {
  id: string;
  site_id: string;
  title: string;
  seller_id: number;
  category_id: string;
  user_product_id: string;
  official_store_id: number | null;
  price: number;
  base_price: number;
  original_price: number | null;
  inventory_id: string | null;
  currency_id: string;
  initial_quantity: number;
  available_quantity: number;
  sold_quantity: number;
  sale_terms: any[]; // Pode ser tipado se houver estrutura fixa
  buying_mode: string;
  listing_type_id: string;
  start_time: string; // ISO date
  stop_time: string; // ISO date
  end_time: string; // ISO date
  expiration_time: string; // ISO date
  condition: string;
  permalink: string;
  pictures: Array<{
    id: string;
    url: string;
    secure_url: string;
    size: string;
    max_size: string;
    quality: string;
  }>;
  video_id: string | null;
  descriptions: any[];
  accepts_mercadopago: boolean;
  non_mercado_pago_payment_methods: any[];
  shipping: {
    mode: string;
    local_pick_up: boolean;
    free_shipping: boolean;
    methods: any[];
    dimensions: string | null;
    tags: string[];
    logistic_type: string;
    store_pick_up: boolean;
  };
  international_delivery_mode: string;
  seller_address: {
    id: number;
    comment: string;
    address_line: string;
    zip_code: string;
    city: {
      id: string;
      name: string;
    };
    state: {
      id: string;
      name: string;
    };
    country: {
      id: string;
      name: string;
    };
    latitude: number;
    longitude: number;
    search_location: {
      neighborhood: {
        id: string;
        name: string;
      };
      city: {
        id: string;
        name: string;
      };
      state: {
        id: string;
        name: string;
      };
    };
  };
  seller_contact: any | null;
  location: Record<string, unknown>;
  geolocation: {
    latitude: number;
    longitude: number;
  };
  coverage_areas: any[];
  attributes: Array<{
    id: string;
    name: string;
    value_id: string | null;
    value_name: string;
    values: Array<{
      id: string | null;
      name: string;
      struct: any | null;
    }>;
    value_type: string;
  }>;
  warnings: Array<{
    department: string;
    cause_id: number;
    code: string;
    message: string;
    references: string[];
  }>;
  listing_source: string;
  variations: any[];
  thumbnail_id: string;
  thumbnail: string;
  status: string;
  sub_status: string[];
  tags: string[];
  warranty: string | null;
  catalog_product_id: string | null;
  domain_id: string;
  seller_custom_field: string | null;
  parent_item_id: string | null;
  differential_pricing: any | null;
  deal_ids: any[];
  automatic_relist: boolean;
  date_created: string; // ISO date
  last_updated: string; // ISO date
  health: number | null;
  catalog_listing: boolean;
  item_relations: any[];
  channels: string[];
}


export interface MercadoLivreSendItem {
  title: string;
  category_id: string;
  price: number;
  currency_id: string;
  available_quantity: number;
  buying_mode: string;
  listing_type_id: string;
  condition: string;
  description: {
    plain_text: string;
  };
  pictures: Array<{
    source: string;
  }>;
  attributes: Array<{
    id: string;
    value_name: string;
  }>;
  shipping: {
    mode: string;
    free_shipping: boolean;
    local_pick_up: boolean;
  };
}

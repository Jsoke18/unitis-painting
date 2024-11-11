// app/types/clients.ts
export interface Client {
    id?: number;
    src: string;
    alt: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ClientsContent {
    heading: string;
    clients: Client[];
  }
  
  export const defaultClientsContent: ClientsContent = {
    heading: "Notable Clients",
    clients: [
      { 
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/0057f7c4d4561963734f5078a3464f4d4f0af798c40d4a924a58b830b4ccfe9d?apiKey=a05a9fe5da54475091abff9f564d40f8&", 
        alt: "Staples" 
      },
      { 
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/23e45d0ae41deb68f3a4886e27af289f43b8a92d7f244d0372457c1157ff9ca2?apiKey=a05a9fe5da54475091abff9f564d40f8&", 
        alt: "Best Buy" 
      },
      { 
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/7aa19ae66818b5dc74ed754a7bd4356c6e3d9a4131664e24b27c51154ef7e8cb?apiKey=a05a9fe5da54475091abff9f564d40f8&", 
        alt: "Shoppers Drug Mart" 
      },
      { 
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a8c6de74e7315654a3462be197bf2fe564cdb8aee213d0ce07eb6d99341b9d59?apiKey=a05a9fe5da54475091abff9f564d40f8&", 
        alt: "Real Canadian Superstore" 
      },
      { 
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a3319b354ea81da0086bfd6959b6a3a8ddca4939377fa04e0b036aad4d56216e?apiKey=a05a9fe5da54475091abff9f564d40f8&", 
        alt: "Save On Foods" 
      },
      { 
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a31d639dda1fcd12e87def942d33b49296f0a7062659d83adc2280b32f839258?apiKey=a05a9fe5da54475091abff9f564d40f8&", 
        alt: "Costco" 
      },
      { 
        src: "/photos/bentallgreenoak-logo-vector.png", 
        alt: "BentallGreenOak" 
      },
      { 
        src: "/photos/U-Haul_logo.svg.png", 
        alt: "U-Haul" 
      },
      { 
        src: "/photos/8c06fe178644610f128fd0f4fe9bfee6.png", 
        alt: "Client Logo" 
      },
      { 
        src: "/photos/991f54639ff69806a441ffc039296a53.webp", 
        alt: "Client Logo" 
      },
      { 
        src: "/photos/Four-Seasons-Logo.png", 
        alt: "Four Seasons" 
      },
      { 
        src: "/photos/home-depot.png", 
        alt: "Home Depot" 
      },
      { 
        src: "/photos/Honda-logo-1920x1080.webp", 
        alt: "Honda" 
      },
      { 
        src: "/photos/Houle_Electric.jpg", 
        alt: "Houle Electric" 
      },
      { 
        src: "/photos/icbc.png", 
        alt: "ICBC" 
      },
      { 
        src: "/photos/images (1).png", 
        alt: "Client Logo" 
      },
      { 
        src: "/photos/images.jpg", 
        alt: "Client Logo" 
      },
      { 
        src: "/photos/images.png", 
        alt: "Client Logo" 
      },
      { 
        src: "/photos/loblaws.png", 
        alt: "Loblaws" 
      },
      { 
        src: "/photos/Public_Storage_Logo.svg.png", 
        alt: "Public Storage" 
      },
      { 
        src: "/photos/Rancho-Management.png", 
        alt: "Rancho Management" 
      }
    ]
  };
  
  // API Response types
  export interface ApiResponse {
    message?: string;
    content?: ClientsContent;
    error?: string;
  }
  
  // Form types for CMS
  export interface ClientFormData {
    heading: string;
    clients: Client[];
  }
  
  // Validation schemas (if using Zod or similar)
  export const clientValidationRules = {
    src: { required: true, message: 'Please input the logo URL!' },
    alt: { required: true, message: 'Please input alt text!' }
  };
  
  // Upload types for CMS
  export interface UploadResponse {
    url: string;
    success: boolean;
    error?: string;
  }
  
  // Sort options type
  export type SortOption = 'name' | 'dateAdded' | 'dateUpdated';
  
  // Filter options type
  export interface FilterOptions {
    search?: string;
    category?: string;
    dateRange?: [Date, Date];
  }
  
  // Pagination type
  export interface PaginationParams {
    page: number;
    pageSize: number;
    total: number;
  }
  
  // State management types
  export interface ClientsState {
    content: ClientsContent;
    isLoading: boolean;
    error: string | null;
    pagination?: PaginationParams;
    filters?: FilterOptions;
    sortBy?: SortOption;
  }
  
  // Action types for state management
  export type ClientsAction = 
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: ClientsContent }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'UPDATE_FILTERS'; payload: FilterOptions }
    | { type: 'UPDATE_SORT'; payload: SortOption }
    | { type: 'UPDATE_PAGINATION'; payload: PaginationParams };
  
  // Initial state
  export const initialClientsState: ClientsState = {
    content: defaultClientsContent,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    },
    filters: {},
    sortBy: 'dateUpdated'
  };
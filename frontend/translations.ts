
export interface Translation {
  // Login Page
  welcome: string;
  signInContinue: string;
  username: string;
  password: string;
  rememberMe: string;
  signIn: string;
  selectRole: string;
  admin: string;
  technician: string;

  // Sidebar (Admin)
  dashboard: string;
  inventory: string;
  pos: string;
  tickets: string;
  settings: string;

  // Sidebar (Technician)
  repairDashboard: string;
  workOrders: string;
  clients: string;
  partsInventory: string;

  // Header
  pageTitle: string;
  userAvatarAlt: string;

  // Dashboard
  totalSales: string;
  productsInStock: string;
  totalTickets: string;
  weeklySales: string;
  recentTickets: string;
  ticketId: string;
  date: string;
  items: string;
  total: string;

  // Inventory
  searchProductsPlaceholder: string;
  addNewProduct: string;
  productName: string;
  brand: string;
  stock: string;
  price: string;
  actions: string;
  edit: string;

  // POS
  currentTicket: string;
  cartEmpty: string;
  subtotal: string;
  tax: string;
  completeSale: string;

  // Tickets
  ticketDetails: string;
  close: string;
  viewDetails: string;

  // Settings
  changeLanguage: string;
  language: string;
  english: string;
  spanish: string;
  generalSettings: string;
  appName: string;
  backgroundImage: string;
  uploadImage: string;
  removeImage: string;
  languageSettings: string;

  // Repair Dashboard
  pendingDevices: string;
  repairsInProgress: string;
  readyForPickup: string;
  lowStockParts: string;
  recentWorkOrders: string;

  // Work Orders
  workOrderId: string;
  customer: string;
  device: string;
  issue: string;
  status: string;
  receivedDate: string;
  searchWorkOrders: string;
  registerNewDevice: string;

  // Parts Inventory
  partName: string;
  sku: string;
  compatibleModels: string;
  searchPartsPlaceholder: string;
  addNewPart: string;
}

export const translations: { [key: string]: Translation } = {
  en: {
    welcome: "Welcome",
    signInContinue: "Sign in to continue",
    username: "Username",
    password: "Password",
    rememberMe: "Remember me for 30 days",
    signIn: "Sign In",
    selectRole: "Select your role",
    admin: "Admin",
    technician: "Technician",
    dashboard: "Dashboard",
    inventory: "Inventory",
    pos: "Sales",
    tickets: "Tickets",
    settings: "Settings",
    pageTitle: "Page Title",
    userAvatarAlt: "User avatar",
    totalSales: "Total Sales",
    productsInStock: "Products in Stock",
    totalTickets: "Total Tickets",
    weeklySales: "Weekly Sales",
    recentTickets: "Recent Tickets",
    ticketId: "Ticket ID",
    date: "Date",
    items: "Items",
    total: "Total",
    searchProductsPlaceholder: "Search products...",
    addNewProduct: "Add New Product",
    productName: "Product Name",
    brand: "Brand",
    stock: "Stock",
    price: "Price",
    actions: "Actions",
    edit: "Edit",
    currentTicket: "Current Ticket",
    cartEmpty: "Your cart is empty.",
    subtotal: "Subtotal",
    tax: "Tax (8%)",
    completeSale: "Complete Sale",
    ticketDetails: "Ticket Details",
    close: "Close",
    viewDetails: "View Details",
    changeLanguage: "Change Language",
    language: "Language",
    english: "English",
    spanish: "Spanish",
    generalSettings: "General Settings",
    appName: "Application Name",
    backgroundImage: "Background Image",
    uploadImage: "Upload Image",
    removeImage: "Remove",
    languageSettings: "Language Settings",
    repairDashboard: "Repair Dashboard",
    workOrders: "Work Orders",
    clients: "Clients",
    partsInventory: "Parts Inventory",
    pendingDevices: "Pending Devices",
    repairsInProgress: "Repairs in Progress",
    readyForPickup: "Ready for Pickup",
    lowStockParts: "Low Stock Parts",
    recentWorkOrders: "Recent Work Orders",
    workOrderId: "Order ID",
    customer: "Customer",
    device: "Device",
    issue: "Issue",
    status: "Status",
    receivedDate: "Received Date",
    searchWorkOrders: "Search by customer or device...",
    registerNewDevice: "Register New Device",
    partName: "Part Name",
    sku: "SKU",
    compatibleModels: "Compatible Models",
    searchPartsPlaceholder: "Search parts...",
    addNewPart: "Add New Part",
  },
  es: {
    welcome: "Bienvenido",
    signInContinue: "Inicia sesión para continuar",
    username: "Usuario",
    password: "Contraseña",
    rememberMe: "Recordar sesión por 30 días",
    signIn: "Iniciar Sesión",
    selectRole: "Selecciona tu rol",
    admin: "Admin",
    technician: "Técnico",
    dashboard: "Dashboard",
    inventory: "Inventario",
    pos: "Ventas",
    tickets: "Tickets",
    settings: "Ajustes",
    pageTitle: "Título de la Página",
    userAvatarAlt: "Avatar de usuario",
    totalSales: "Ventas Totales",
    productsInStock: "Productos en Stock",
    totalTickets: "Tickets Totales",
    weeklySales: "Ventas Semanales",
    recentTickets: "Tickets Recientes",
    ticketId: "ID Ticket",
    date: "Fecha",
    items: "Artículos",
    total: "Total",
    searchProductsPlaceholder: "Buscar productos...",
    addNewProduct: "Añadir Nuevo Producto",
    productName: "Nombre del Producto",
    brand: "Marca",
    stock: "Stock",
    price: "Precio",
    actions: "Acciones",
    edit: "Editar",
    currentTicket: "Ticket Actual",
    cartEmpty: "Tu carrito está vacío.",
    subtotal: "Subtotal",
    tax: "Impuesto (8%)",
    completeSale: "Completar Venta",
    ticketDetails: "Detalles del Ticket",
    close: "Cerrar",
    viewDetails: "Ver Detalles",
    changeLanguage: "Cambiar Idioma",
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
    generalSettings: "Ajustes Generales",
    appName: "Nombre de la Aplicación",
    backgroundImage: "Imagen de Fondo",
    uploadImage: "Subir Imagen",
    removeImage: "Eliminar",
    languageSettings: "Ajustes de Idioma",
    repairDashboard: "Dashboard de Reparación",
    workOrders: "Órdenes de Trabajo",
    clients: "Gestión de Clientes",
    partsInventory: "Inventario de Partes",
    pendingDevices: "Equipos Pendientes",
    repairsInProgress: "Reparaciones en Progreso",
    readyForPickup: "Listos para Recoger",
    lowStockParts: "Partes con Bajo Stock",
    recentWorkOrders: "Órdenes de Trabajo Recientes",
    workOrderId: "ID de Orden",
    customer: "Cliente",
    device: "Dispositivo",
    issue: "Problema Reportado",
    status: "Estado",
    receivedDate: "Fecha de Recepción",
    searchWorkOrders: "Buscar por cliente o dispositivo...",
    registerNewDevice: "Registrar Nuevo Equipo",
    partName: "Nombre de la Parte",
    sku: "SKU",
    compatibleModels: "Modelos Compatibles",
    searchPartsPlaceholder: "Buscar partes...",
    addNewPart: "Añadir Nueva Parte",
  },
};

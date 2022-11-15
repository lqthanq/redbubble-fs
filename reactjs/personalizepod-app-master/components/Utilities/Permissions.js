export const permissions = {
  ArtworkCreate: "ArtworkCreate", //createArtwork, importArtworkFromPSD, duplicateArtwork
  ArtworkUpdate: "ArtworkUpdate", //changeLockStatus, updateArtwork
  DeleteArtwork: "DeleteArtwork", //DeleteArtwork
  // ArtworkUpdateTeam:"ArtworkUpdateTeam",
  // ArtworkUpdateAny:"ArtworkUpdateAny",
  ArtworkList: "ArtworkList", //artwork, artworks
  ArtworkListTeam: "ArtworkListTeam",
  ArtworkListAny: "ArtworkListAny",
  ArtworkCategoryCreate: "ArtworkCategoryCreate", //createArtworkCategory, duplicateArtworkCategory
  ArtworkCategoryUpdate: "ArtworkCategoryUpdate", //updateArtworkCategory
  ArtworkCategoryDelete: "ArtworkCategoryDelete", //ArtworkCategoryDelete
  ArtworkCategoryUpdateAny: "ArtworkCategoryUpdateAny",
  ArtworkCategoryList: "ArtworkCategoryList",
  ArtworkCategoryListTeam: "ArtworkCategoryListTeam",
  ArtworkCategoryListAny: "ArtworkCategoryListAny",
  CampaignListAny: "CampaignListAny",
  CampaignListTeam: "CampaignListTeam",
  CampaignList: "CampaignList",
  CampaignCreate: "CampaignCreate", //createCampaign, duplicateCampaign
  CampaignUpdate: "CampaignUpdate", //updateCampaign, retryPushCampaign, pushCampaign
  CampaignDelete: "CampaignDelete", //deleteCampaign
  ClipartCreate: "ClipartCreate", //createClipart
  ClipartUpdate: "ClipartUpdate", //updateClipartTitle, updateClipartColor
  ClipartDelete: "ClipartDelete", //clipartDelete
  ClipartUpdateTeam: "ClipartUpdateTeam",
  ClipartUpdateAny: "ClipartUpdateAny",
  ClipartList: "ClipartList",
  ClipartListTeam: "ClipartListTeam",
  ClipartListAny: "ClipartListAny",
  ClipartCategoryCreate: "ClipartCategoryCreate", //createClipartCategory,duplicateClipartCategory
  ClipartCategoryUpdate: "ClipartCategoryUpdate", // updateClipartCategory, updateClipartCategoryDisplaySettings
  ClipartCategoryUpdateAny: "ClipartCategoryUpdateAny",
  ClipartCategoryDelete: "ClipartCategoryDelete", //ClipartCategoryDelete
  ClipartCategoryList: "ClipartCategoryList",
  ClipartCategoryListTeam: "ClipartCategoryListTeam",
  ClipartCategoryListAny: "ClipartCategoryListAny",
  ClipmaskCreate: "ClipmaskCreate",
  ClipmaskList: "ClipmaskList",
  ClipmaskListTeam: "ClipmaskListTeam",
  ClipmaskListAny: "ClipmaskListAny",
  ColorsFetch: "ColorsFetch", //fetchColors
  ColorAdd: "ColorAdd", //AddColor
  ColorUpdate: "ColorUpdate", //updateColor
  DesignCreate: "DesignCreate", //createDesign, //importFromPSD
  DesignUpdate: "DesignUpdate", //updateDesign
  DesignList: "DesignList",
  DesignListTeam: "DesignListTeam",
  DesignListAny: "DesignListAny",
  ExportTemplateCreate: "ExportTemplateCreate", //createExportTemplate, cloneExportTemplate
  ExportTemplateUpdate: "ExportTemplateUpdate", //editExportTemplate
  ExportTemplateDelete: "ExportTemplateDelete", //deleteExportTemplate
  ExportTemplateList: "ExportTemplateList",
  ExportTemplateListTeam: "ExportTemplateListTeam",
  ExportTemplateListAny: "ExportTemplateListAny",
  FileCreate: "FileCreate",
  FileDelete: "FileDelete",
  FileList: "FileList",
  FileListOwner: "FileListOwner",
  FileListAny: "FileListAny",
  FileUpdate: "FileUpdate",
  FileListTeam: "FileListTeam",
  FontCreate: "FontCreate", //FontCreate
  FontList: "FontList",
  FontListTeam: "FontListTeam",
  FontListAny: "FontListAny",
  FontListPublic: "FontListPublic",
  MockupCreate: "MockupCreate", // createMockup
  MockupUpdate: "MockupUpdate", // updateMockup
  MockupList: "MockupList",
  MockupDelete: "MockupDelete", // deleteMockup
  OrderList: "OrderList",
  OrderListTeam: "OrderListTeam",
  OrderListAny: "OrderListAny",
  OrderUpdate: "OrderUpdate", //updateOrderStatus, updateOrder, acceptDesign, cancelOrder, reSubmitOrder, reGeneratePrintFile
  OrderFetch: "OrderFetch", //OrderFetch
  OrderCreate: "OrderCreate",
  OrderUploadDesign: "OrderUploadDesign", //uploadDesign
  OrderExport: "OrderExport", //exportOrders
  PatternCreate: "PatternCreate", //createPattern
  PatternList: "PatternList",
  PatternListTeam: "PatternListTeam",
  PatternListAny: "PatternListAny",
  PhotoCreate: "PhotoCreate", //createPhoto
  PhotoList: "PhotoList",
  PhotoListTeam: "PhotoListTeam",
  PhotoListAny: "PhotoListAny",
  PhotoListPublic: "PhotoListPublic",
  ProductList: "ProductList",
  ProductListAny: "ProductListAny",
  ProductListTeam: "ProductListTeam",
  ProductUpdate: "ProductUpdate",
  ProductCreate: "ProductCreate",
  CollectionList: "CollectionList",
  CollectionListAny: "CollectionListAny",
  CollectionListTeam: "CollectionListTeam",
  CollectionCreate: "CollectionCreate",
  CollectionUpdate: "CollectionUpdate",
  ProductBaseCategoryList: "ProductBaseCategoryList",
  ProductBaseCategoryListAny: "ProductBaseCategoryListAny",
  ProductBaseCategoryListTeam: "ProductBaseCategoryListTeam",
  ProductBaseCategoryCreate: "ProductBaseCategoryCreate", //createProductBaseCategory
  ProductBaseCategoryUpdate: "ProductBaseCategoryUpdate", //updateProductBaseCategory
  ProductBaseCategoryDelete: "ProductBaseCategoryDelete", //deleteProductBaseCategory
  FulfillmentServiceList: "FulfillmentServiceList",
  FulfillmentServiceListAny: "FulfillmentServiceListAny",
  FulfillmentServiceListTeam: "FulfillmentServiceListTeam",
  FulfillmentServiceUpdate: "FulfillmentServiceUpdate", //updateFulfillment, updateFulfillmentService
  FulfillmentServiceCreate: "FulfillmentServiceCreate", //createFulfillment, createFulfillmentService
  FulfillmentServiceDelete: "FulfillmentServiceDelete", //deleteFulfillment, deleteFulfillmentService
  FulfillmentServiceConfig: "FulfillmentServiceConfig", //configApi
  CreateProductBase: "CreateProductBase", //duplicateProductBase, createProductBase
  UpdateProductBase: "UpdateProductBase", //updateProductBase
  DeleteProductBase: "DeleteProductBase", //deleteProductBase
  ProductBaseList: "ProductBaseList",
  ProductBaseListAny: "ProductBaseListAny",
  ProductBaseListTeam: "ProductBaseListTeam",
  SettingCreate: "SettingCreate", //createSetting
  SettingUpdate: "SettingUpdate", //updateSetting
  SettingList: "SettingList",
  SettingListAny: "SettingListAny",
  SettingListTeam: "SettingListTeam",
  StoreCreate: "StoreCreate", //createStore
  StoreUpdate: "StoreUpdate", //disconnectStore, removeStore, reconnectStore, updateStoreSettings
  StoreList: "StoreList",
  StoreListAny: "StoreListAny",
  StoreListTeam: "StoreListTeam",
  StoreUpdateAny: "StoreUpdateAny",
  UserRegister: "UserRegister", //UserRegister
  UserCreate: "UserCreate", //UserCreate
  UserUpdateAny: "UserUpdateAny",
  UserDelete: "UserDelete", //UserDelete
  UserManager: "UserManager",
  UserTeamManager: "UserTeamManager:",
};

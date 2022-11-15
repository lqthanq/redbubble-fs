import { MOCKUP, ARTWORK, CAMPAIGN, APP } from "./actions";
import { setCookie, destroyCookie } from "nookies";
import { cloneDeep, get, indexOf } from "lodash";

export const initState = {
  currentUser: null,
  sellerId: null,
  menuCollapsed: false,
  workspace: {
    artworks: [],
    artwork: {
      title: "",
      width: 0,
      height: 0,
      templates: [
        {
          title: "",
          isDefault: true,
          data: { layers: [] },
        },
      ],
    },
    clipboard: null,
    selectedTemplate: 0,
    selectedLayers: [],
    ctrl: false,
  },
  mockupWorkspace: {
    clipboard: null,
    mockup: {
      layers: [],
    },
    selectedLayers: [],
    mockupsManage: [],
  },
  campaign: {
    productBases: [],
    baseSelected: null,
    productInput: null,
    selectedArtwork: {
      printFileId: null,
      artworkId: null,
    },
    settings: {},
  },
  productBaseImport: null,
  newOrder: {
    variantsSelected: [],
  },
  baseVariants: [],
  artworkPreviews: {},
};

export const isClient = () => {
  return typeof window === "object";
};

export const updateLayer = (layers, update) => {
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].id === update.id) {
      layers[i] = { ...layers[i], ...update };
      break;
    }
    if (layers[i].layers) {
      updateLayer(layers[i].layers, update);
    }
  }
};

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case APP.SET_CURRENT_USER:
      if (action.payload === null) {
        //remove token
        localStorage.removeItem("sellerId");
        destroyCookie(null, process.env.COOKIE_JWT_TOKEN);
        if (isClient()) {
          localStorage.removeItem(process.env.COOKIE_JWT_TOKEN);
        }
      }
      return {
        ...state,
        currentUser: action.payload,
        sellerId: action.payload ? state.sellerId : null,
      };
    case "setSellerId":
      return {
        ...state,
        sellerId: action.payload,
      };
    case "login":
      setCookie(null, process.env.COOKIE_JWT_TOKEN, action.payload.token, {
        maxAge: action.payload.expires_in,
      });
      if (isClient()) {
        localStorage.setItem(
          process.env.COOKIE_JWT_TOKEN,
          action.payload.token
        );
      }
      return {
        ...state,
        currentUser: action.payload.user,
      };
    case "logout":
      destroyCookie(null, process.env.COOKIE_JWT_TOKEN);
      if (isClient()) {
        localStorage.removeItem(process.env.COOKIE_JWT_TOKEN);
      }
      return {
        ...state,
        currentUser: null,
      };
    case ARTWORK.SET:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          artwork: action.payload,
        },
      };
    case ARTWORK.SET_SELECTED_TEMPLATE:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          selectedTemplate: action.payload,
        },
      };
    case ARTWORK.SET_LAYERS:
      var { selectedTemplate, artwork } = state.workspace;
      var { templates } = artwork;
      if (selectedTemplate === -1) {
        return {
          ...state,
          workspace: {
            ...state.workspace,
            artwork: {
              ...artwork,
              sharedLayers: action.payload,
            },
          },
        };
      }
      return {
        ...state,
        workspace: {
          ...state.workspace,
          artwork: {
            ...artwork,
            templates: templates.map((tpl, index) =>
              index === selectedTemplate
                ? {
                    ...tpl,
                    layers: action.payload,
                  }
                : tpl
            ),
          },
        },
      };
    case ARTWORK.SET_SELECTED_LAYERS:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          selectedLayers: action.payload,
        },
      };
    case ARTWORK.SET_LAYER:
      var { selectedTemplate, artwork } = state.workspace;
      var { templates, sharedLayers } = artwork;
      var layers = [];
      if (selectedTemplate === -1) {
        layers = [...sharedLayers];
        updateLayer(layers, action.payload);
        return {
          ...state,
          workspace: {
            ...state.workspace,
            artwork: {
              ...artwork,
              sharedLayers: layers,
            },
          },
        };
      } else {
        layers = [...templates[selectedTemplate].layers];
      }
      updateLayer(layers, action.payload);
      return {
        ...state,
        workspace: {
          ...state.workspace,
          artwork: {
            ...artwork,
            templates: templates.map((template, index) =>
              index === selectedTemplate
                ? { ...template, layers: layers }
                : template
            ),
          },
        },
      };
    case ARTWORK.SET_CLIPBOARD:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          clipboard: action.payload,
        },
      };
    case ARTWORK.SET_THUMBNAIL:
      var { selectedTemplate, artwork } = state.workspace;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          artwork: {
            ...artwork,
            templates: artwork.templates.map((template, index) =>
              index === selectedTemplate
                ? { ...template, thumbnail: action.payload }
                : template
            ),
          },
        },
      };
    case ARTWORK.UNDO:
      return {
        ...state,
      };
    case ARTWORK.SET_CTRL:
      return {
        ...state,
        workspace: {
          ...state.workspace,
          ctrl: action.payload,
        },
      };
    case ARTWORK.ADD_LAYER:
      var { workspace } = state;
      var { selectedTemplate, artwork, selectedLayers } = workspace;
      var newLayers = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      newLayers.forEach((newLayer) => {
        var firstSelectedLayer = null,
          layers = [];
        if (selectedTemplate !== -1) {
          layers = get(artwork, `templates[${selectedTemplate}].layers`);
        } else {
          layers = get(artwork, "sharedLayers", []);
        }
        if (selectedLayers.length > 0) {
          firstSelectedLayer = layers.search(selectedLayers[0]);
        }
        if (firstSelectedLayer && firstSelectedLayer.parent) {
          newLayer.parent = firstSelectedLayer.parent;
          //Insert new layer to group
          var parent = layers.search(firstSelectedLayer.parent);
          var firstSelectedLayerIndex = indexOf(
            parent.layers,
            firstSelectedLayer
          );
          parent.layers.splice(firstSelectedLayerIndex + 1, 0, newLayer);
        } else {
          if (firstSelectedLayer) {
            var firstSelectedLayerIndex = indexOf(layers, firstSelectedLayer);
            layers.splice(firstSelectedLayerIndex + 1, 0, newLayer);
          } else {
            layers.push(newLayer);
          }
        }
      });
      return {
        ...state,
        workspace: {
          ...state.workspace,
          selectedLayers: newLayers.map((l) => l.id),
        },
      };
    case ARTWORK.SET_PREVIEW:
      return {
        ...state,
        artworkPreviews: { ...state.artworkPreviews, ...action.payload },
      };
    case MOCKUP.SET:
      return {
        ...state,
        mockupWorkspace: {
          ...state.mockupWorkspace,
          mockup: action.payload,
        },
      };
    case MOCKUP.SET_SELECTED_LAYERS:
      return {
        ...state,
        mockupWorkspace: {
          ...state.mockupWorkspace,
          selectedLayers: action.payload,
        },
      };
    case MOCKUP.SET_LAYERS:
      return {
        ...state,
        mockupWorkspace: {
          ...state.mockupWorkspace,
          mockup: {
            ...state.mockupWorkspace.mockup,
            layers: action.payload,
          },
        },
      };
    case MOCKUP.SET_LAYER:
      var { mockupsManage, mockup } = state.mockupWorkspace;
      var layers = [...mockup.layers];
      updateLayer(layers, action.payload);
      let newListMockup = cloneDeep(mockupsManage);
      if (newListMockup.length) {
        newListMockup = newListMockup.map((item) => {
          if (item.id === mockup.id) {
            return {
              ...mockup,
              layers: layers,
            };
          }
          return { ...item };
        });
      }
      return {
        ...state,
        mockupWorkspace: {
          ...state.mockupWorkspace,
          mockup: {
            ...state.mockupWorkspace.mockup,
            layers: layers,
          },
          mockupsManage: newListMockup,
        },
      };
    case MOCKUP.SET_CTRL:
      return {
        ...state,
        mockupWorkspace: {
          ...state.mockupWorkspace,
          ctrl: action.payload,
        },
      };
    case MOCKUP.SET_CLIPBOARD:
      return {
        ...state,
        mockupWorkspace: {
          ...state.mockupWorkspace,
          clipboard: action.payload,
        },
      };
    case MOCKUP.SET_MOCKUPS:
      return {
        ...state,
        mockupWorkspace: {
          ...state.mockupWorkspace,
          mockupsManage: action.payload,
        },
      };
    case CAMPAIGN.SET:
      return {
        ...state,
        productBases: action.payload,
        ...action.payload,
      };
    case CAMPAIGN.SET_SETTINGS:
      return {
        ...state,
        campaign: {
          ...state.campaign,
          settings: {
            ...state.campaign.settings,
            ...action.payload,
          },
        },
        // productBases: action.payload,
        // ...action.payload,
      };
    case CAMPAIGN.RESET:
      return {
        ...state,
        campaign: {
          productBases: [],
          baseSelected: null,
          productInput: null,
          selectedArtwork: {
            printFileId: null,
            artworkId: null,
          },
        },
        mockupWorkspace: {
          clipboard: null,
          mockup: {
            layers: [],
          },
          selectedLayers: [],
          mockupsManage: [],
        },
      };
    case CAMPAIGN.SET_SELECTED_ARTWORK:
      return {
        ...state,
        campaign: {
          ...state.campaign,
          selectedArtwork: action.payload,
        },
      };
    case "clearWorkspace":
      return {
        ...state,
        workspace: initState.workspace,
      };
    case "toggleMenuCollapsed":
      return {
        ...state,
        menuCollapsed: !state.menuCollapsed,
      };
    case "setProductBaseImport":
      return {
        ...state,
        productBaseImport: action.payload.productBaseImport,
      };
    case "setVariantsSelected":
      return {
        ...state,
        ...action.payload,
      };
    case "changeActiveVariant":
      return {
        ...state,
        baseVariants: action.payload.baseVariants,
      };
    default:
      return state;
  }
};

import { Alert, Button, Space } from "antd";
import { useMemo } from "react";
import styled from "styled-components";
import ArtwordFormPreview from "components/Artworks/ArtworkFormPreview";
import Attributes from "./CampaignForm-Attributes";
import { useAppValue } from "context";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { CAMPAIGN } from "actions";
import { FaPlusCircle } from "react-icons/fa";
import { get } from "lodash";

const Container = styled.div`
  .ant-tag {
    display: inline-block;
    border: 1px solid var(--primary-color);
    margin-bottom: 5px;
  }
`;

const PreviewDetail = ({ setAddMorePage }) => {
  const [{ campaign }, dispatch] = useAppValue();
  const {
    baseSelected,
    selectedArtwork,
    productInput,
    productBases,
    settings,
  } = campaign;
  const newVariantAttributes = useMemo(() => {
    const allVariants = baseSelected?.variants;
    if (allVariants?.length) {
      let allAttributesFromVariant = _.concat(
        ...allVariants.map((item) => item.attributes)
      );
      // unique attributes
      allAttributesFromVariant = _.uniqWith(
        allAttributesFromVariant,
        _.isEqual
      );
      const variantAttributes = allAttributesFromVariant.reduce((init, el) => {
        const key = el.slug;
        if (!init[key]) {
          init[key] = [];
        }
        // get variants with the same attribute
        const variantContainAttributes = allVariants.filter(
          (varr) =>
            _.differenceWith([el], varr.attributes, _.isEqual)?.length === 0
        );
        // checked tag if one or multiple variants variantContainAttributes contain status is true
        const attributeChecked = variantContainAttributes.find(
          (v) => v.active === true
        );
        if (attributeChecked) {
          init[key].push({
            ...el,
            checked: !!attributeChecked,
          });
        }
        return init;
      }, {});
      return variantAttributes;
    }
    return {};
  }, [baseSelected.variants]);

  return (
    <Container>
      <h2>{productInput?.title}</h2>
      <span style={{ fontWeight: 500 }}>
        $ {baseSelected?.variants[0]?.salePrice}
        {baseSelected?.variants[0]?.salePrice <
        baseSelected?.variants[0]?.regularPrice ? (
          <del style={{ color: "gray", marginLeft: 10 }}>
            $ {baseSelected?.variants[0]?.regularPrice}
          </del>
        ) : null}
      </span>
      <div>
        <div className="mt-15">Product Type</div>
        <div style={{ display: "block" }}>
          {productBases.map((base) => (
            <CheckableTag
              onClick={() => {
                dispatch({
                  type: CAMPAIGN.SET,
                  payload: {
                    campaign: {
                      ...campaign,
                      baseSelected: base,
                    },
                  },
                });
              }}
              key={base.id}
              checked={baseSelected.id === base.id}
            >
              {base.title}
            </CheckableTag>
          ))}
          <Button
            type="link"
            icon={<FaPlusCircle className="anticon" />}
            onClick={() => setAddMorePage(true)}
            style={{ display: "inline-block", padding: 0 }}
          >
            Add product bases
          </Button>
        </div>
      </div>
      <Space
        direction="vertical"
        size={30}
        style={{ width: "100%", marginTop: 15 }}
      >
        <Attributes
          checkEnable={false}
          attributes={newVariantAttributes}
          disableOnChange={true}
        />
        {selectedArtwork?.artworkId ? (
          <ArtwordFormPreview
            artworkId={selectedArtwork.artworkId}
            personalized={get(
              settings,
              `default[${selectedArtwork.artworkId}]`,
              {}
            )}
            onPersonalized={(personalized) => {
              dispatch({
                type: CAMPAIGN.SET_SETTINGS,
                payload: {
                  default: {
                    ...get(settings, "default", {}),
                    [selectedArtwork.artworkId]: personalized,
                  },
                },
              });
            }}
            ordering={get(
              settings,
              `ordering[${selectedArtwork.artworkId}]`,
              []
            )}
            onOrdering={(ordering) =>
              dispatch({
                type: CAMPAIGN.SET_SETTINGS,
                payload: {
                  ordering: {
                    ...get(settings, "ordering", {}),
                    [selectedArtwork.artworkId]: ordering,
                  },
                },
              })
            }
          />
        ) : (
          <Alert
            type="info"
            message="No artwork selected yet. Please select an artwork to continue!"
          />
        )}
      </Space>
    </Container>
  );
};

export default PreviewDetail;

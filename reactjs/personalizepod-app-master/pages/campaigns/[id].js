import { CAMPAIGN } from "actions";
import { Skeleton } from "antd";
import { useAppValue } from "context";
import { CAMPAIGN_BY_ID } from "graphql/queries/campaign/campaignQuery";
import CampaignLayout from "layouts/campaign";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import AddCampaignStep2 from "./new/step-2";
import Head from "next/head";
import ErrorPage from "next/error";

const Campaign = () => {
  const router = useRouter();
  const [{ campaign }, dispatch] = useAppValue();
  const { id } = router.query;

  const variantsByProductBases = (productBases, variants, printAreas) => {
    let newProductBases =
      productBases && !productBases.includes(null) && productBases.length
        ? productBases.map((base) => {
            const newVariants = [];
            variants?.forEach((vari) => {
              if (vari.productBaseId === base.id) {
                base.variants?.forEach((variant) => {
                  if (vari.productBaseVariantId === variant.id) {
                    newVariants.push({
                      ...vari,
                      attributes: variant.attributes,
                      cost: variant.cost,
                    });
                  }
                });
              }
            });
            base.variants = newVariants;
            base.printAreas = base.printAreas?.map((printFile) => {
              const matchPrintFile = printAreas?.find(
                (printItem) => printItem.productBasePrintAreaId === printFile.id
              );
              if (matchPrintFile) {
                return matchPrintFile;
              }
              return printFile;
            });
            return base;
          })
        : [];
    return newProductBases;
  };

  const { data, loading, error } = useQuery(CAMPAIGN_BY_ID, {
    variables: {
      id,
    },
    fetchPolicy: "no-cache",
    skip: !id,
    onCompleted: (data) => {
      const newproductBases = variantsByProductBases(
        data.campaign?.products[0]?.productBases,
        data.campaign?.products[0]?.variants,
        data.campaign?.products[0]?.printAreas
      );
      dispatch({
        type: CAMPAIGN.SET,
        payload: {
          campaign: {
            ...campaign,
            settings: data?.campaign?.settings,
            productBases: newproductBases,
            productInput: {
              ...data?.campaign?.products[0],
              productId: data?.campaign?.products[0].id,
              campaignId: data?.campaign.id,
              campaignStores: data?.campaign?.campaignStores,
              updatedAt: data?.campaign?.updatedAt,
            },
          },
        },
      });
    },
  });

  if (loading) return <Skeleton active={true} />;

  if (error) return <ErrorPage statusCode={404} />;

  return (
    <div>
      <Head>
        <title>Edit Campaign {data?.campaign?.title}</title>
      </Head>
      <AddCampaignStep2 storesData={data?.campaign?.stores} />
    </div>
  );
};
Campaign.Layout = CampaignLayout;
export default Campaign;

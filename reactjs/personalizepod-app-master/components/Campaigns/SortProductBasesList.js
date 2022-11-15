import { AiFillPlayCircle, AiOutlineClose } from "react-icons/ai";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { FaPlusCircle } from "react-icons/fa";
import { Button } from "antd";
import { BiMoveVertical } from "react-icons/bi";
import { useAppValue } from "context";
import { useRouter } from "next/router";
import CustomizePopconfirm from "components/Utilities/CustomizePopconfirm";
import { CAMPAIGN } from "actions";
import { get } from "lodash";

const DragHandle = SortableHandle(() => (
  <BiMoveVertical className="anticon custom-icon" style={{ fontSize: 15 }} />
));

const SortableItem = SortableElement(({ base, setAddMorePage, baseFixed }) => {
  const router = useRouter();
  const [{ campaign }, dispatch] = useAppValue();
  const { productBases, baseSelected, productInput } = campaign;
  return (
    <li
      style={{
        listStyle: "none",
        padding: 5,
        borderBottom: "1px solid #f0f0f0",
        background: baseSelected?.id === base.id ? "#fafafa" : "inherit",
        display: "grid",
        gridTemplateColumns: "auto 20px",
        cursor: "pointer",
      }}
      key={base.id}
      className="drag-visible"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "20px 50px auto",
          alignItems: "center",
        }}
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
      >
        <DragHandle />
        <div
          className="clipart"
          style={{
            backgroundImage: base.image
              ? `url(${process.env.CDN_URL}/300x300/${base.image.key})`
              : "url(/no-preview.jpg)",
          }}
        />
        <div className="ml-15 flex item-center space-between">
          <span>{base.title}</span>
        </div>
      </div>
      <CustomizePopconfirm
        disabled={baseFixed}
        onConfirm={() => {
          let newproductBases = productBases?.filter((el) => el.id !== base.id);
          if (!newproductBases.length) {
            if (!productInput) {
              router.push("/campaigns/new", "/campaigns/new");
            } else {
              setAddMorePage(true);
            }
          }
          dispatch({
            type: CAMPAIGN.SET,
            payload: {
              campaign: {
                ...campaign,
                productBases: newproductBases,
              },
            },
          });
        }}
        icon={
          <AiOutlineClose
            style={{
              color: baseFixed ? "unset" : "var(--error-color)",
              cursor: baseFixed ? "not-allowed" : "pointer",
            }}
            className="custom-icon anticon "
          />
        }
        title="Are you sure to delete this product base?"
        okButtonProps={{
          danger: true,
        }}
      />
    </li>
  );
});
const SortableList = SortableContainer(
  ({
    setAddMorePage,
    addMorePage,
    productBases,
    baseSelected,
    productInput,
  }) => (
    <ul style={{ padding: 0 }} className="drag-visible">
      {productBases?.map((base, index) => {
        const baseFixed = productInput?.productBases?.find(
          (exitedBase) => exitedBase.id === base.id
        );
        return (
          <SortableItem
            baseFixed={!!baseFixed}
            addMorePage={addMorePage}
            setAddMorePage={setAddMorePage}
            key={base.id}
            index={index}
            base={base}
            productBases={productBases}
            baseSelected={baseSelected}
          />
        );
      })}
    </ul>
  )
);
const SortProductBasesList = ({ setAddMorePage, addMorePage }) => {
  const [{ campaign }, dispatch] = useAppValue();

  const { productBases, baseSelected, productInput } = campaign;
  const router = useRouter();

  const onSortEnd = ({ oldIndex, newIndex }) => {
    dispatch({
      type: CAMPAIGN.SET,
      payload: {
        campaign: {
          ...campaign,
          productBases: arrayMove(productBases, oldIndex, newIndex),
        },
      },
    });
  };

  return (
    <div>
      <SortableList
        productInput={productInput}
        addMorePage={addMorePage}
        setAddMorePage={setAddMorePage}
        baseSelected={baseSelected}
        productBases={productBases}
        lockAxis="y"
        useDragHandle
        onSortEnd={onSortEnd}
        helperClass="row-dragging"
      />
      <Button
        type="link"
        className="flex item-center"
        onClick={() => {
          productInput
            ? setAddMorePage(!addMorePage)
            : router.push("/campaigns/new", "/campaigns/new");
        }}
        disabled={!productBases.length && get(router, "query.id", false)}
        icon={
          addMorePage ? (
            <AiFillPlayCircle size={18} className="anticon" />
          ) : (
            <FaPlusCircle size={18} className="anticon" />
          )
        }
      >
        {addMorePage ? "Continue" : "Add more product bases"}
      </Button>
    </div>
  );
};

export default SortProductBasesList;

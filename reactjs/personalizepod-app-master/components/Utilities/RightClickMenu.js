import { Menu } from "antd";
import AuthElement from "components/User/AuthElement";
import { AiFillFolderAdd, AiFillSetting } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import CategoryDelete from "./CategoryDelete";
import CategoryDuplicate from "./CategoryDuplicate";
import { permissionCheck } from "./PermissionCheck";
import { permissions } from "./Permissions";

const RightClickMenu = (props) => {
  const {
    tmpStyle,
    setClickRight,
    setShowAddNew,
    showChildren,
    setShowAddNewTo,
    setShowRename,
    clickRight,
    setSettings,
  } = props;

  const availableUpdate = permissionCheck(permissions.ArtworkCategoryUpdate);
  const availableDelete = permissionCheck(permissions.ArtworkCategoryDelete);
  const availableCreate = permissionCheck(permissions.ArtworkCategoryCreate);

  return (
    <AuthElement
      name={[
        permissions.ArtworkCategoryCreate,
        permissions.ArtworkCategoryUpdate,
        permissions.ArtworkCategoryDelete,
      ]}
    >
      <Menu
        className="p-menu"
        style={!clickRight.visible ? { display: "none" } : { ...tmpStyle }}
      >
        <Menu.Item
          disabled={
            showChildren.number && showChildren.__typename == "ClipartCategory"
          }
          hidden={!availableCreate}
        >
          <a
            href="/#"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowAddNewTo(showChildren);
              setShowAddNew(true);
              setClickRight({ visible: false, pageX: null, pageY: null });
            }}
          >
            <AiFillFolderAdd className="custom-icon anticon" /> New category
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            href="/#"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowAddNewTo(null);
              setShowRename(showChildren);
              setClickRight({ visible: false, pageX: null, pageY: null });
            }}
            hidden={!availableUpdate}
          >
            <BiEditAlt className="custom-icon anticon" /> Rename
          </a>
        </Menu.Item>
        {showChildren.__typename == "ClipartCategory" && (
          <Menu.Item
            disabled={!showChildren.parentID && !showChildren.isFolder}
          >
            <a
              href="/#"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSettings(showChildren);
                setClickRight({ visible: false, pageX: null, pageY: null });
              }}
            >
              <AiFillSetting className="custom-icon anticon" /> Setting
            </a>
          </Menu.Item>
        )}
        <Menu.Item hidden={!availableCreate}>
          <CategoryDuplicate
            setClickRight={setClickRight}
            id={showChildren.id}
          />
        </Menu.Item>
        {availableDelete ? (
          <>
            <Menu.Divider />
            <Menu.Item>
              <CategoryDelete
                setClickRight={setClickRight}
                id={showChildren.id}
              />
            </Menu.Item>
          </>
        ) : null}
      </Menu>
      <div
        style={
          !clickRight.visible
            ? { display: "none" }
            : {
                width: "100%",
                height: "100vh",
                backgroundColor: "transparent",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 99,
              }
        }
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setClickRight({ visible: false, pageX: null, pageY: null });
        }}
      />
    </AuthElement>
  );
};

export default RightClickMenu;

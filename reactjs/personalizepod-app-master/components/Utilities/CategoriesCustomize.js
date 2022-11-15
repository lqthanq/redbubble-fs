import { Button, Tree, Input } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CarryOutOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { get, cloneDeep, sumBy } from "lodash";
import RightClickMenu from "./RightClickMenu";
import Scrollbars from "./Scrollbars";
import CategoryArtworkModal from "./CategoryArtworkModal";
import CategoryClipartModal from "./CategoryClipartModal";
import ClipartCategoryDisplaySetting from "components/Clipart/ClipartCategoryDisplaySetting";
import AuthElement from "components/User/AuthElement";
import { permissions } from "./Permissions";

const Container = styled.div`
  .header-filter {
    margin-bottom: 20px;
  }
  .header-category {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
const CategoriesCustomize = ({
  categories,
  customBase,
  height,
  categoryImportBase,
  setCategorySelect,
  categorySelect,
  artworkCustom,
  type,
  refetch,
  expandedKey = [],
}) => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [showAddNewTo, setShowAddNewTo] = useState(null);
  const [showRename, setShowRename] = useState(null);
  const [dataSource, setDataSource] = useState(categories);
  const [clickRight, setClickRight] = useState({
    visible: false,
    display: "block",
    pageX: null,
    pageY: null,
  });
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [expanded, setExpanded] = useState([
    ...expandedKey,
    router.query.categoryID,
  ]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const letExpandedKey = [];
  const [settings, setSettings] = useState(null);
  const getSum = (cat) => {
    var total = cat.number;
    if (cat.children) {
      for (let sub of cat.children) {
        total += getSum(sub);
      }
    }
    return total;
  };

  useEffect(() => {
    if (!customBase) {
      setExpanded([...new Set([...expanded, ...expandedKey])]);
    }
  }, [expandedKey]);
  const renderTree = (cats, setFont) => {
    return (
      cats &&
      cats.map((cat) => {
        if (showAddNewTo && cat.id === showAddNewTo) {
          return {
            key: cat && cat.id,
            title: (
              <div
                className="p-title-category"
                style={setFont === true ? { fontSize: 13.5 } : { fontSize: 14 }}
              >
                <div>
                  {cat && cat.title}
                  {showAddNewTo && getNodeTreeRightClickMenu(cat)}
                </div>
                <div style={{ fontSize: 13, color: "#999" }}>
                  {type !== "artworks"
                    ? categoryImportBase
                      ? null
                      : getSum(cat)
                    : cat.children
                    ? sumBy(cat.children, "number")
                    : cat.number}
                </div>
              </div>
            ),
            icon: <CarryOutOutlined />,
            children:
              cat && cat.children ? renderTree(cat && cat.children, true) : [],
            isLeaf: cat && cat.children === null,
          };
        }
        return {
          key: cat && cat.id,
          title: (
            <div
              className="p-title-category"
              style={setFont === true ? { fontSize: 13.5 } : { fontSize: 14 }}
            >
              <div>{cat && cat.title}</div>
              <div style={{ fontSize: 13, color: "#999" }}>
                {type !== "artworks"
                  ? categoryImportBase
                    ? null
                    : getSum(cat)
                  : cat.children
                  ? sumBy(cat.children, "number")
                  : cat.number}
              </div>
            </div>
          ),
          icon: <CarryOutOutlined />,
          children:
            cat && cat.children ? renderTree(cat && cat.children, true) : [],
          isLeaf: cat && cat.children === null,
        };
      })
    );
  };
  const treeNodeonRightClick = (e) => {
    if (e.node.key) {
      if (showAddNewTo === e.node.key) {
        setClickRight({
          visible: false,
          pageX: null,
          pageY: null,
        });
        setShowAddNewTo();
      } else {
        var elmnt = document.getElementById("__next");
        if (elmnt.offsetHeight - e.event.clientY < 165) {
          setClickRight({
            visible: true,
            pageX: e.event.clientX,
            pageY: e.event.clientY - 165,
          });
        } else {
          setClickRight({
            visible: true,
            pageX: e.event.clientX,
            pageY: e.event.clientY,
          });
        }
        setShowAddNewTo(e.node.key);
      }
    }
  };
  const getNodeTreeRightClickMenu = (cat) => {
    const tmpStyle = {
      position: "fixed",
      left: `${clickRight.pageX - 0}px`,
      top: `${clickRight.pageY + 3}px`,
      display: clickRight.display,
      border: "1px solid #D7D7D7",
      zIndex: 999,
    };
    const menu = (
      <RightClickMenu
        setShowAddNew={setShowAddNew}
        setShowAddNewTo={setShowAddNewTo}
        setClickRight={setClickRight}
        tmpStyle={tmpStyle}
        showChildren={cat}
        setShowRename={setShowRename}
        clickRight={clickRight}
        setSettings={(value) => setSettings(value)}
      />
    );
    return clickRight.pageX == "" ? "" : menu;
  };
  useEffect(() => {
    if (categories) {
      setDataSource(categories);
    }
  }, [categories]);

  const handleChangeSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    setExpanded((prevState) => {
      if (prevState && !value) {
        return [];
      }
      return getAllValuesFromNodes(categories, true);
    });
    setAutoExpandParent(true);
  };

  const getAllValuesFromNodes = (nodes, firstLevel) => {
    if (firstLevel) {
      const values = [];
      for (var n of nodes) {
        values.push(n.title);
        if (n.children) {
          values.push(...getAllValuesFromNodes(n.children, false));
        }
      }
      return values;
    } else {
      const values = [];
      for (var n of nodes) {
        values.push(n.title);
        if (n.children) {
          values.push(...getAllValuesFromNodes(n.children, false));
        }
      }
      return values;
    }
  };

  const keywordFilter = (nodes, search) => {
    var newNodes = [];
    for (var n of nodes) {
      if (n.children) {
        const nextNodes = keywordFilter(n.children, search);
        if (nextNodes.length > 0) {
          n.children = nextNodes;
        } else if (
          n.title.toString().toLowerCase().includes(search.toLowerCase())
        ) {
          n.children = nextNodes.length > 0 ? nextNodes : [];
        }
        if (
          nextNodes.length > 0 ||
          n.title.toString().toLowerCase().includes(search.toLowerCase())
        ) {
          newNodes.push(n);
          letExpandedKey.push(n.id);
        }
      } else {
        if (n.title.toString().toLowerCase().includes(search.toLowerCase())) {
          newNodes.push(n);
          letExpandedKey.push(n);
        }
      }
    }
    setExpanded([...expanded, ...letExpandedKey]);
    setDataSource(newNodes);
    return newNodes;
  };

  useEffect(() => {
    if (!search) {
      setDataSource(categories);
    } else {
      keywordFilter(cloneDeep(categories), search);
    }
  }, [search]);
  return (
    <Container
      style={{ categoryImportBase } ? null : { background: "#F4F6F8" }}
      className="customize-category p-15"
    >
      {!customBase && !artworkCustom && (
        <div className="pb-15 header-category">
          <div>Categories</div>
          <AuthElement name={permissions.ArtworkCategoryCreate}>
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddNew(true);
                setShowAddNewTo(null);
              }}
            >
              New category
            </Button>
          </AuthElement>
        </div>
      )}
      {!customBase && (
        <div className="header-filter">
          <Input.Search
            onChange={(event) => handleChangeSearch(event)}
            placeholder="Search..."
          />
        </div>
      )}
      <Scrollbars
        style={{ width: "100%", height: `calc(100vh - ${height}px)` }}
      >
        <Tree
          className="tree-categories"
          style={{ width: `calc(100% - 6px)` }}
          onExpand={(expanded) => {
            setExpanded([...new Set(expanded)]);
            setAutoExpandParent(false);
          }}
          expandedKeys={expanded}
          autoExpandParent={autoExpandParent}
          selectedKeys={
            categorySelect
              ? [categorySelect !== null ? categorySelect : "all-category"]
              : [get(router, "query.categoryID", "all-category")]
          }
          treeData={[
            {
              key: "all-category",
              title: (
                <div className="p-title-category">
                  <div>All Categories</div>
                  <div style={{ fontSize: 13.5, color: "#999" }}>
                    {type !== "artworks"
                      ? categoryImportBase
                        ? null
                        : getSum({ children: dataSource, number: 0 })
                      : sumBy(dataSource, "number")}
                  </div>
                </div>
              ),
              children: [],
            },
            ...renderTree(dataSource),
          ]}
          multiple={false}
          showIcon={false}
          showLine={{ showLeafIcon: false }}
          onSelect={(id, event) => {
            if (type !== "artworks" && settings) {
              let rootSelectedCategory = categories.find(
                (el) => el.id === id[0]
              );
              if (rootSelectedCategory && !rootSelectedCategory.isFolder) {
                setSettings(null);
              } else {
                setSettings({ id: id[0] });
              }
            }
            if (customBase || artworkCustom) {
              if (!id.includes("all-category")) {
                setCategorySelect(id);
              } else {
                setCategorySelect([]);
              }
            } else {
              if (!id.includes("all-category") && id.length) {
                delete router.query.page;
                router.query.categoryID = id;
                router.push(router);
              } else {
                if (event.node.key === id || id.includes("all-category")) {
                  delete router.query.page;
                  router.query.categoryID = [];
                  router.push(router);
                }
              }
            }
          }}
          onRightClick={(e) => {
            if (!customBase) {
              treeNodeonRightClick(e);
            }
          }}
        />
      </Scrollbars>
      {type === "artworks" ? (
        <CategoryArtworkModal
          title={`${showRename !== null ? "Edit category" : "Add category"}`}
          visible={showRename !== null ? showRename : showAddNew}
          showAddNewTo={showAddNewTo}
          setShowAddNew={setShowAddNew}
          showAddNew={showAddNew}
          showRename={showRename}
          setShowRename={setShowRename}
          categories={categories}
        />
      ) : (
        <CategoryClipartModal
          refetch={refetch}
          title={`${showRename !== null ? "Edit category" : "Add category"}`}
          visible={showRename !== null ? showRename : showAddNew}
          showAddNewTo={showAddNewTo}
          setShowAddNew={setShowAddNew}
          showAddNew={showAddNew}
          showRename={showRename}
          setShowRename={setShowRename}
          categories={categories}
        />
      )}
      {settings && (
        <ClipartCategoryDisplaySetting
          categoryID={settings.id}
          onClose={() => setSettings(null)}
        />
      )}
    </Container>
  );
};
export default CategoriesCustomize;

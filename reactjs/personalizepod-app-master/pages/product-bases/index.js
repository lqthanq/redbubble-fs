import ProductBaseList from "components/ProductBase/ProductBaseList";
import React from "react";
import Head from "next/head";

const Bases = () => {
  return (
    <div>
      <Head>
        <meta title="Product Bases" />
      </Head>
      <ProductBaseList />
    </div>
  );
};
export default Bases;

import DefaultLayout from "../layouts/default";
import "../styles/antd.less";
import "../styles/style.less";
import withApollo from "next-with-apollo";
import { ApolloProvider } from "@apollo/client";
import { AppProvider, useAppValue } from "../context";
import { reducer, initState } from "../reducer";
import initApollo from "../lib/apollo";
import me from "../graphql/queries/me";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import { Query } from "@apollo/client/react/components";
import Loading from "../components/Utilities/Loading";
import { APP } from "actions";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const AppInit = ({ children }) => {
  const [{ currentUser }, dispatch] = useAppValue();
  const router = useRouter();
  const unLoginRouters = [
    "/",
    "/test",
    "/register",
    "/forgot-password",
    "/verify",
  ];
  if (!currentUser) {
    return (
      <Query
        query={me}
        fetchPolicy="network-only"
        onCompleted={(data) => {
          if (data.me === null) {
            if (unLoginRouters.indexOf(router.pathname) !== -1) {
              return children;
            } else {
              router.push("/", "/");
            }
          } else {
            dispatch({
              type: APP.SET_CURRENT_USER,
              payload: data.me.user,
            });
          }
        }}
      >
        {({ data, loading, error }) => {
          if (error) {
            if (unLoginRouters.indexOf(router.pathname) !== -1) {
              return children;
            }
          }
          if (loading) {
            return <Loading />;
          }
          if (data && data.me) {
            return children;
          } else {
            if (unLoginRouters.indexOf(router.pathname) !== -1) {
              return children;
            } else {
              router.push("/", "/");
              return <Loading />;
            }
          }
        }}
      </Query>
    );
  }
  return children;
};

const App = ({ Component, pageProps, apollo }) => {
  const Layout = Component.Layout || DefaultLayout;

  return (
    <AppProvider initialState={initState} reducer={reducer}>
      <ApolloProvider client={apollo}>
        <AppInit>
          <Layout
            title={Component.title}
            customizeHeader={Component.customizeHeader}
            routerPush={Component.routerPush}
          >
            <Component {...pageProps} />
          </Layout>
        </AppInit>
      </ApolloProvider>
    </AppProvider>
  );
};

export default withApollo(({ initialState }) => {
  const env = {
    GRAPHQL_SERVER: process.env.GRAPHQL_SERVER,
    GRAPHQL_WS_SERVER: process.env.GRAPHQL_WS_SERVER,
    COOKIE_JWT_TOKEN: process.env.COOKIE_JWT_TOKEN,
  };
  return initApollo(env, initialState);
})(App);

import React from "react";

/**
 * コンテナにプレゼンテーションコンポネントです。
 * @param {JSX.Element} Container コンテナ
 * @param {JSX.Element} Presententer プレゼンテーション
 * @param {function} プロパティを受けてコンポネントを返すメソッド
 */
export function containerPresententer(Container, Presententer) {
    return (props) => (
        <Container
            render={(container) => <Presententer {...container} />}
            {...props}
        />
    );
}

/**
 * コンポーネントがrefのフォワーディングを行えるようにします。
 * @param {JSX.Element} Component 対象のコンポーネント
 * @returns {JSX.Element}
 */
export const withForwardRef = (Component) => {
    class Custom extends React.Component {
        render() {
            const { forwardedRef, ...props } = this.props;

            return <Component ref={forwardedRef} {...props} />;
        }
    }

    return React.forwardRef((props, ref) => {
        return <Custom {...props} forwardedRef={ref} />;
    });
};

import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      border-bottom: 1px solid #f5f5f5;
      a {
        line-height: 40px;
        padding: 0 20px;
        display: block;
      }
    }
  }
`;
const Menu = () => {
  return (
    <Container>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/cliparts">
            <a>Cliparts</a>
          </Link>
        </li>
        <li>
          <Link href="/designs">
            <a>Designs</a>
          </Link>
        </li>
        <li>
          <Link href="/design/[id]" as="/design/99">
            <a>Design 99</a>
          </Link>
        </li>
      </ul>
    </Container>
  );
};

export default Menu;

import FromEmailTemplate from "../../components/EmailTemplates/FormEmailTemplate";
import { useRouter } from "next/router";

const EditTemplates = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <FromEmailTemplate id={id} />
    </div>
  );
};
export default EditTemplates;

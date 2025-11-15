import { getAllCategoriesFromDB } from "@/app/actions/categories";
import Container from "@/components/shared/Ui/Container";
import SectionTitle from "@/components/shared/Ui/Title/SectionTitle";
import CategoriesSlider from "./CategoriesSlider";

const Categories = async () => {
  const categoriesResponse = await getAllCategoriesFromDB();

  return (
    <Container className="pt-12 md:pt-16">
      <div className="shadow-cardLightShadow dark:shadow-cardDarkShadow rounded-xl section-space-for-shadow">
        <SectionTitle title="Popular Categories" />

        <CategoriesSlider categories={categoriesResponse?.data} />
      </div>
    </Container>
  );
};

export default Categories;

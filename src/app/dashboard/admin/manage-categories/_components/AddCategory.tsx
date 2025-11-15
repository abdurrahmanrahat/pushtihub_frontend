import { getAllCategoriesFromDB } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TCategory } from "@/types";
import ParentCategoryForm from "./ParentCategoryForm";
import SubCategoryForm from "./SubCategoryForm";

export default async function AddCategory() {
  const categoriesResponse = await getAllCategoriesFromDB();

  const parentCategories = categoriesResponse?.data.map(
    (category: TCategory) => ({
      value: category._id,
      label: category.name,
    })
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white hover:bg-primary/90">
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary font-semibold">
            Add Category
          </DialogTitle>
          <DialogDescription>
            Add a new category to organize your products better.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="parent" className="w-full">
          <TabsList className=" ">
            <TabsTrigger value="parent">Parent</TabsTrigger>
            <TabsTrigger value="sub">Subcategory</TabsTrigger>
          </TabsList>

          {/* Parent Category Form */}
          <TabsContent value="parent" className="mt-2">
            <ParentCategoryForm />
          </TabsContent>

          {/* Subcategory Form */}
          <TabsContent value="sub" className="mt-2">
            <SubCategoryForm parentCategories={parentCategories} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

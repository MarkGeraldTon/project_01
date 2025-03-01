import Products from "./components/products";

// right sidebar
import QuickActions from "../dashboard/components/QuickActions";
import RecentActivity from "@/components/global/RecentActivity";

// types
// providers
import { ProductProvider } from "./provider/product-provider";

const ProductsPage = () => {
  return (
    <div className="py-16 px-8 space-y-8 grid grid-cols-1 xl:grid-cols-3">
      <div className="p-0 lg:p-6 space-y-6 col-span-1 xl:col-span-2">
        <ProductProvider>
          <Products />
        </ProductProvider>
      </div>
      <div className="col-span-1 p-0 lg:p-4 mx:p-8 flex xl:block items-start gap-8 flex-col-reverse sm:flex-row">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
};

export default ProductsPage;

"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import Image from "next/image";
import { useEdgeStore } from "@/components/context/EdgesProvider";

import CategorySearch from "./category-search";
import BrandSearch from "./brand-search";
import SupplierSearch from "./supplier-search";

import { Progress } from "@/components/ui/progress";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Product } from "@/prisma/type";

import { ThreeDots } from "react-loader-spinner";
import { useEffect } from "react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (
    product: Omit<Product, "product_id" | "order_items" | "adjustments">
  ) => void;
  loadingAddProduct: boolean;
}

const productSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  category_id: z.number().int().positive("Category is required."),
  quantity_in_stock: z.number().int().min(0, "Quantity must be 0 or greater"),
  unit_price: z
    .number()
    .min(0, "Unit price must be 0 or greater")
    .max(10000, "Unit price cannot exceed 10,000"),
  cost_price: z
    .number()
    .min(0, "Cost price must be 0 or greater")
    .max(10000, "Cost price cannot exceed 10,000"),
  supplier_id: z.number().int().positive("Supplier is required."),
  brand_id: z.number().int().positive("Brand is required."),
  date_of_entry: z
    .date()
    .refine(
      (date) => date <= new Date(),
      "Date of entry cannot be in the future"
    ),
  size: z
    .string()
    .regex(
      /^(\d+|\d+(?:\.\d+)?|XS|S|M|L|XL|XXL)$/,
      "Size must be numeric or standard sizes like XS, S, M, etc."
    )
    .optional(),
  color: z
    .string()
    .min(1, "Color is required")
    .max(30, "Color cannot exceed 30 characters")
    .optional(),

  product_image: z.string().optional(),

  expiration_date: z
    .date()
    .optional()
    .refine(
      (date) => !date || date > new Date(),
      "Expiration date must be in the future"
    ),
  status: z
    .string()
    .min(1, "Status is required")
    .max(20, "Status cannot exceed 20 characters"),

  discount: z.number().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductModal({
  isOpen,
  onClose,
  onAdd,
  loadingAddProduct,
}: AddProductModalProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category_id: undefined,
      quantity_in_stock: 0,
      unit_price: 0,
      cost_price: 0,
      supplier_id: undefined,
      date_of_entry: new Date(),
      size: "",
      color: "",
      product_image: "",
      brand_id: undefined,
      expiration_date: undefined,
      status: "active",
      discount: 0,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (onAdd) {
      const productData: Omit<
        Product,
        "product_id" | "order_items" | "adjustments"
      > = {
        ...data,
        date_of_entry: new Date(),
      };
      onAdd(productData);
    }
  };

  useEffect(() => {
    if (!loadingAddProduct) {
      form.reset();
      onClose();
    }
  }, [loadingAddProduct]);

  const { edgestore } = useEdgeStore();
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (file: File) => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          // you can use this to show a progress bar
          console.log(progress);
          setProgress(progress);
        },
      });
      // you can run some server action or api here
      // to add the necessary data to your database
      console.log(res);
      form.setValue("product_image", res.url);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-4/6 overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4 grid-cols-2">
              {/* General Information */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold">General Information</h2>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product Description"
                          {...field}
                          className="h-[200px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing & Stock */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold">Pricing & Stock</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity_in_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity In Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cost_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold">Additional Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="out_of_stock">
                                Out of Stock
                              </SelectItem>
                              <SelectItem value="pre_order">
                                Pre-Order
                              </SelectItem>
                              <SelectItem value="discontinued">
                                Discontinued
                              </SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          {/* <Input type="number" {...field} /> */}
                          <CategorySearch
                            value={field.value}
                            onChange={(categoryId) =>
                              field.onChange(categoryId)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplier_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          {/* <Input type="number" {...field} /> */}
                          <SupplierSearch
                            value={field.value}
                            onChange={(supplierId) =>
                              field.onChange(supplierId)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="brand_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          {/* <Input type="number" {...field} /> */}
                          <BrandSearch
                            value={field.value}
                            onChange={(brandId) => field.onChange(brandId)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Product Attributes */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold">Product Attributes</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <FormControl>
                          <Input placeholder="Barcode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input placeholder="Size" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold">Image Upload</h2>
                <FormField
                  control={form.control}
                  name="product_image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Upload Product Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              setProgress(0);
                              handleFileUpload(file);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <div>
                        <Progress value={progress} />
                        {progress === 100 && (
                          <div className="upload-complete text-green-500">
                            Upload complete!
                          </div>
                        )}
                        {/* {form.getValues("product_image") !== "" && (
                          <Image
                            src={
                              form.getValues("product_image")?.toString() ?? ""
                            }
                            alt="Product Image"
                            className="w-full h-auto"
                            width={100}
                            height={100}
                          />
                        )} */}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={loadingAddProduct}
                className="w-full"
              >
                {loadingAddProduct ? (
                  <ThreeDots width="30" color="#fff" />
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

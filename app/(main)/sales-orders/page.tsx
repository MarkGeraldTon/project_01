"use client";

import React from "react";
import SalesDashboard from "./components/sales-dashboard";

// right sidebar
import QuickActions from "../dashboard/components/QuickActions";
import RecentActivity from "@/components/global/RecentActivity";

const SalesOrderPage = () => {
  return (
    <>
      <div className="py-16 px-8 space-y-8 grid grid-cols-1 xl:grid-cols-3">
        <div className="p-0 lg:p-6 space-y-6 col-span-1 xl:col-span-2">
          <SalesDashboard />
        </div>
        <div className="col-span-1 p-0 lg:p-4 mx:p-8 flex xl:block items-start gap-8 flex-col-reverse sm:flex-row">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </>
  );
};

export default SalesOrderPage;

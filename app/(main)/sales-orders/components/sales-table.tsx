"use client";

import * as React from "react";
import { useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";

// import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LineWave } from "react-loader-spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Pagination from "@/components/global/pagination";

interface SalesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  error: string;
  setPeriod: (period: string) => void;
}

export default function SalesTable<TData, TValue>({
  columns,
  data,
  loading,
  error,
  setPeriod,
}: SalesTableProps<TData, TValue>) {
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10; // Update to 10 items per page
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: itemsPerPage,
      },
      globalFilter, // Add this
    },
    pageCount: Math.ceil(data.length / itemsPerPage),
    onGlobalFilterChange: setGlobalFilter, // Add this
  });

  return (
    <div className="w-full space-y-6">
      <div className="rounded-lg border bg-card">
        <div className="relative w-full overflow-auto">
          <div className="space-y-4">
            {/* Add the Select component here */}
            <div className="flex justify-end space-x-4 p-4">
              <Select defaultValue="7days" onValueChange={setPeriod}>
                <SelectTrigger className="w-[130px] text-[#00A3FF]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table className="w-full">
              <TableHeader>
                {table?.getHeaderGroups().map((headerGroup) => (
                  <TableRow className="bg-slate-50" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <LineWave
                        visible={true}
                        height="100"
                        width="100"
                        color="#00a3ff"
                        ariaLabel="line-wave-loading"
                        wrapperStyle={{}}
                        wrapperClass="justify-center h-[300px] items-center"
                        firstLineColor=""
                        middleLineColor=""
                        lastLineColor=""
                      />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-red-500"
                    >
                      Error loading data: {error}
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4 px-2">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <Pagination
                totalPages={totalPages}
                page={page}
                setPage={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

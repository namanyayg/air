"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type CityData = {
  aqi: number | string;
  name: string;
  pm25: number | null;
  pm10: number | null;
  co: number | null;
  no2: number | null;
  so2: number | null;
  o3: number | null;
  timestamp: string;
}

type AirData = {
  [city: string]: CityData;
}

// Update the table data type
type CityAQIData = {
  name: string;
  aqi: number | string;
  pm25: number | null;
}

const columns: ColumnDef<CityAQIData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold text-muted-foreground hover:text-foreground"
      >
        City
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "aqi",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold text-muted-foreground hover:text-foreground"
      >
        AQI
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const aqi = row.getValue("aqi") as number | string;
      let className = "font-medium";
      
      if (typeof aqi === 'number') {
        if (aqi > 300) className += " text-red-500";
        else if (aqi > 200) className += " text-orange-500";
        else if (aqi > 100) className += " text-yellow-500";
        else className += " text-green-500";
      }
      
      return <div className={className}>{aqi}</div>;
    },
  },
  {
    accessorKey: "pm25",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold text-muted-foreground hover:text-foreground"
      >
        PM2.5
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
];

export default function AQITable({ airData }: { airData: AirData }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "aqi", desc: true }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const data: CityAQIData[] = useMemo(() => 
    Object.entries(airData)
      .map(([cityName, cityData]) => ({
        name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
        aqi: cityData.aqi,
        pm25: cityData.pm25,
      }))
      .filter(city => typeof city.aqi === 'number')
      .sort((a, b) => {
        const aqiA = typeof a.aqi === 'number' ? a.aqi : -1;
        const aqiB = typeof b.aqi === 'number' ? b.aqi : -1;
        return aqiB - aqiA;
      }),
    [airData]
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card dark">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
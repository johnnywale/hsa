"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    type UniqueIdentifier,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {restrictToVerticalAxis} from "@dnd-kit/modifiers"
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconLayoutColumns,
} from "@tabler/icons-react"
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {z} from "zod"
import {Badge} from "@/registry/new-york-v4/ui/badge"
import {Button} from "@/registry/new-york-v4/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import {Label} from "@/registry/new-york-v4/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/registry/new-york-v4/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/registry/new-york-v4/ui/table"
import {Tabs, TabsContent, TabsList, TabsTrigger,} from "@/registry/new-york-v4/ui/tabs"
import {useIsMobile} from "@/registry/new-york-v4/hooks/use-mobile";

import {FormColumnConfig} from "@/lib/schema";
import {generateColumns} from "@/app/(app)/admin/components/table-columns";
import CreateDrawer from "@/app/(app)/admin/components/create-drawer";
import {DynamicSearchDropdown, FilterItem} from "@/app/(app)/admin/components/search";


function DraggableRow<T extends z.ZodTypeAny>({
                                                  row
                                              }: {
    row: Row<z.infer<T>>
}) {
    const {transform, transition, setNodeRef, isDragging} = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}


export function DataTable<T extends z.ZodTypeAny>({
                                                      data: initialData,
                                                      baseUrl,
                                                      config,
                                                      schema
                                                  }: {
    data: z.infer<T>[],
    baseUrl: string
    config: FormColumnConfig [],
    schema: T
}) {

    const isMobile = useIsMobile();
    const [data, setData] = React.useState<z.infer<T>[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const [externalFilters, setExternalFilters] = React.useState<FilterItem[]>([])  // ⬅️ 新增


    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )


    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({id}) => id) || [],
        [data]
    )

    const onUpdate = (updated: z.infer<T>) => {
        setData((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
        )
    }
    // const loadData = React.useCallback(async () => {
    //     try {
    //         setLoading(true)
    //         setError(null)
    //
    //         const token = localStorage.getItem("token")
    //         const res = await fetch(baseUrl, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })
    //         if (!res.ok) throw new Error(`Error ${res.status}`)
    //
    //         const json = await res.json()
    //         const parsed = z.array(schema).safeParse(json.items)
    //         if (!parsed.success) throw new Error("Invalid data format")
    //
    //         setData(parsed.data)
    //     } catch (err: any) {
    //         setError(err.message)
    //     } finally {
    //         setLoading(false)
    //     }
    // }, [schema])
    //
    // React.useEffect(() => {
    //     loadData()
    // }, [loadData, initialData])


    // ⬅️ 加载数据：始终更新 data，而不是 filteredData
    const loadData = React.useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem("token")
            const res = await fetch(baseUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (!res.ok) throw new Error(`Error ${res.status}`)

            const json = await res.json()
            const parsed = z.array(schema).safeParse(json.items)
            if (!parsed.success) throw new Error("Invalid data format")

            setData(parsed.data)   // ✅ 只更新原始 data
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [schema, baseUrl])

    React.useEffect(() => {
        loadData()
    }, [loadData, initialData])


    const filteredData = React.useMemo(() => {
        if (!externalFilters || externalFilters.length === 0) return data;

        return data.filter((row) => {
            return externalFilters.every((f) => {
                if (!f.field || !f.op || f.value === "") return true;
                const val = row[f.field];
                switch (f.op) {
                    case "=":
                        return val == f.value;
                    case "!=":
                        return val != f.value;
                    case ">":
                        return val > f.value;
                    case "<":
                        return val < f.value;
                    case ">=":
                        return val >= f.value;
                    case "<=":
                        return val <= f.value;
                    case "like":
                        return String(val ?? "").toLowerCase().includes(f.value.toLowerCase());
                    default:
                        return true;
                }
            });
        });
    }, [data, externalFilters]);


    const columns = generateColumns(schema, baseUrl, config, onUpdate);
    const table = useReactTable({
        data: filteredData      ,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getColumnCanGlobalFilter: function () {
            return true
        },
        globalFilterFn: (row, columnIds, filterValue) => {
            if (columnIds === "id") {
                return `${row.original.id}` === filterValue;
            } else if (columnIds === "name") {
                return row.original.name === filterValue;
            } else if (columnIds === "age") {
                return `${row.original.age}` === filterValue;
            }
            return false;
        },
    })

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    const handleDeleteSelected = async () => {
        const selectedIds = table.getSelectedRowModel().rows.map((r) => r.original.id)
        if (selectedIds.length === 0) {
            alert("No rows selected")
            return
        }

        if (!confirm(`Delete ${selectedIds.length} record(s)?`)) return

        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${baseUrl}/bulk-delete`, {
                method: "POST", // or DELETE depending on your API
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ids: selectedIds}),
            })

            if (!res.ok) throw new Error("Delete failed")

            // ✅ remove from local state
            setData((prev) => prev.filter((row) => !selectedIds.includes(row.id)))
            table.resetRowSelection()
            alert("✅ Deleted successfully")
        } catch (err) {
            console.error("❌ Delete error:", err)
            alert("Delete failed!")
        }
    }


    if (loading) return <div className="p-4">Loading...</div>
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>

    return (
        <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <Select defaultValue="outline">
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="view-selector"
                    >
                        <SelectValue placeholder="Select a view"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="past-performance">Past Performance</SelectItem>
                        <SelectItem value="key-personnel">Key Personnel</SelectItem>
                        <SelectItem value="focus-documents">Focus Documents</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList
                    className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="outline">Outline</TabsTrigger>
                    <TabsTrigger value="past-performance">
                        Past Performance <Badge variant="secondary">3</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="key-personnel">
                        Key Personnel <Badge variant="secondary">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    {/*<Button*/}
                    {/*    onClick={handleAddFilter}*/}
                    {/*    disabled={table.getTotalSize() === 0}*/}
                    {/*>*/}
                    {/*    Add filter*/}
                    {/*</Button>*/}

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelected}
                        disabled={table.getSelectedRowModel().rows.length === 0}
                    >
                        Delete Selected
                    </Button>


                    <DynamicSearchDropdown onChange={setExternalFilters} schema={schema}/>


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns/>
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CreateDrawer columns={config} baseUrl={baseUrl} isMobile={isMobile} onSuccess={loadData}/>
                </div>
            </div>
            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row}/>
                                        ))}
                                    </SortableContext>
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
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft/>
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft/>
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight/>
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight/>
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent
                value="past-performance"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed">

                    No data


                </div>
            </TabsContent>
            <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>

                No data

            </TabsContent>
            <TabsContent
                value="focus-documents"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    )
}



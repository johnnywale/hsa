import {z, ZodTypeAny} from "zod";
import {useSortable} from "@dnd-kit/sortable";
import {Button} from "@/registry/new-york-v4/ui/button";
import {IconDotsVertical, IconGripVertical,} from "@tabler/icons-react";
import * as React from "react";
import {JSX} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/registry/new-york-v4/ui/checkbox";
import {Badge} from "@/registry/new-york-v4/ui/badge";
import {Switch} from "@/registry/new-york-v4/ui/switch"

import {toast} from "sonner";
import {Input} from "@/registry/new-york-v4/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/registry/new-york-v4/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu";
import {STATUS_OPTIONS, TableCellViewer} from "@/app/(app)/admin/components/table-edit-cell";
import {Label} from "@/registry/new-york-v4/ui/label";
import {Textarea} from "@/registry/new-york-v4/ui/textarea";
import {FormColumnConfig} from "@/lib/schema";


function DragHandle({id}: { id: number }): JSX.Element {
    const {attributes, listeners} = useSortable({id});

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent"
        >
            <IconGripVertical className="text-muted-foreground size-3"/>
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}

// ✅ Generate columns
export function generateColumns<S extends ZodTypeAny>(
    schema: S,
    baseUrl: string,
    config: FormColumnConfig[],
    onUpdate?: (updatedItem: z.infer<S>) => void
): ColumnDef<z.infer<S>>[] {
    type ItemType = z.infer<S>;
    const res = config.map((col): ColumnDef<ItemType> => {
        // @ts-ignore
        const colId = `${col.id ?? col.accessorKey ?? crypto.randomUUID()}`;
        switch (col.type) {
            case "drag":
                return {
                    id: colId,
                    header: () => null,
                    cell: ({row}) => <DragHandle id={row.original.id}/>,
                };

            case "select-all":
                return {
                    id: colId,
                    header: ({table}) => (
                        <div className="flex items-center justify-center">
                            <Checkbox
                                checked={
                                    table.getIsAllPageRowsSelected() ||
                                    (table.getIsSomePageRowsSelected() && "indeterminate")
                                }
                                onCheckedChange={(value) =>
                                    table.toggleAllPageRowsSelected(!!value)
                                }
                            />
                        </div>
                    ),
                    cell: ({row}) => (
                        <div className="flex items-center justify-center">
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                            />
                        </div>
                    ),
                    enableSorting: false,
                    enableHiding: false,
                };

            case "header":
                return {
                    id: colId,
                    accessorKey: col.accessorKey,
                    header: col.label,
                    cell: ({row}) => {
                        return <TableCellViewer schema={schema} baseUrl={baseUrl} rowConfig={config}

                                                onSuccess={onUpdate}
                                                item={row.original}/>
                    },
                    enableHiding: false,
                };

            case "badge":
                return {
                    id: colId,
                    accessorKey: col.accessorKey!,
                    header: col.label,
                    cell: ({row}) => (
                        <div className="w-32">
                            <Badge
                                variant="outline"
                                className="text-muted-foreground px-1.5"
                            >
                                {row.original.type}
                            </Badge>
                        </div>
                    ),
                };

            case "status":
                return {
                    id: colId,
                    accessorKey: col.accessorKey!,
                    header: col.label,
                    cell: ({row}) => {
                        const status = STATUS_OPTIONS.find(s => s.value === row.original.status)

                        if (!status) return null

                        return (
                            <Badge
                                variant="outline"
                                className={`px-1.5 flex gap-1 items-center ${status.className}`}
                            >
                                {status.icon}
                                {status.label}
                            </Badge>
                        )
                    },
                }

            case "input": // alias for clarity
                return {
                    id: colId,
                    header: () => col.label,
                    cell: ({row}) => {
                        return row.original[col.accessorKey!]
                    }
                };

            case "multi-select": // alias for clarity
                return {
                    id: colId,
                    header: () => col.label,
                    cell: ({row}) => {
                        const val = row.original[col.accessorKey!]
                        return Array.isArray(val) ? val.join(", ") : val
                    }
                };

            case "number-input":
                return {
                    id: colId,
                    accessorKey: col.accessorKey!,
                    header: () => (
                        <div className="w-full text-right">{col.header}</div>
                    ),
                    cell: ({row}) => (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                toast.promise(
                                    new Promise((resolve) => setTimeout(resolve, 1000)),
                                    {
                                        loading: `Saving ${row.original.header}`,
                                        success: "Done",
                                        error: "Error",
                                    }
                                );
                            }}
                        >
                            <Label
                                htmlFor={`${row.original.id}-${col.accessorKey}`}
                                className="sr-only"
                            >
                                {col.header}
                            </Label>
                            <Input
                                defaultValue={
                                    col.accessorKey
                                        ? String(row.original[col.accessorKey!] ?? "")
                                        : ""
                                }
                                id={`${row.original.id}-${col.accessorKey}`}
                                className="h-8 w-16 text-right bg-transparent border-transparent shadow-none hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
                            />
                        </form>
                    ),
                };

            case "select":
                return {
                    id: colId,
                    accessorKey: col.accessorKey!,
                    header: col.header,
                    cell: ({row}) => {
                        const isAssigned =
                            row.original.reviewer !== "Assign reviewer";
                        if (isAssigned) return row.original.reviewer;

                        return (
                            <>
                                <Label
                                    htmlFor={`${row.original.id}-reviewer`}
                                    className="sr-only"
                                >
                                    Reviewer
                                </Label>
                                <Select>
                                    <SelectTrigger
                                        className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                                        size="sm"
                                        id={`${row.original.id}-reviewer`}
                                    >
                                        <SelectValue placeholder="Assign reviewer"/>
                                    </SelectTrigger>
                                    <SelectContent align="end">
                                        <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                                        <SelectItem value="Jamik Tashpulatov">
                                            Jamik Tashpulatov
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </>
                        );
                    },
                };
            case "text-area":
                return {
                    id: colId,
                    accessorKey: col.accessorKey!,
                    header: col.header,
                    cell: ({row}) => (
                        <Textarea
                            defaultValue={String(row.original[col.accessorKey!] ?? "")}
                            className="h-16 w-full resize-none"
                            placeholder="Enter text..."
                        />
                    ),
                };

            case "file-upload":
                return {
                    id: colId,
                    accessorKey: col.accessorKey!,
                    header: col.header,
                    cell: ({row}) => (
                        <Input
                            id={`${row.original.id}-${col.accessorKey}`}
                            type="file"
                            className="w-full text-sm"
                        />
                    ),
                };

            case "date-picker":
                return {
                    id: colId,
                    accessorKey: col.accessorKey!,
                    header: col.header,
                    cell: ({row}) => {
                        return row.original[col.accessorKey];
                    },
                }

            case "radio":
                return {
                    id: colId,
                    accessorKey: col.accessorKey!,
                    header: col.header,
                    cell: ({row}) => {
                        const id = `${row.original.id}-${col.accessorKey}-switch`
                        console.log(id)
                        return (
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={id}
                                    defaultChecked={Boolean(row.original[col.accessorKey!])}
                                />
                            </div>
                        )
                    },
                };
            case "actions":
                return {

                    id: colId,
                    cell: () => (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <IconDotsVertical/>
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Make a copy</DropdownMenuItem>
                                <DropdownMenuItem>Favorite</DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem variant="destructive">
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ),
                };
            default:
                return {} as ColumnDef<ItemType>;
        }
    });
    return res
}

import {z, ZodTypeAny} from "zod";
import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {FormColumnConfig} from "@/lib/schema";
import {Label} from "@/registry/new-york-v4/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/registry/new-york-v4/ui/select";
import {Input} from "@/registry/new-york-v4/ui/input";


import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {Button} from "@/registry/new-york-v4/ui/button";
import {Checkbox} from "@/registry/new-york-v4/ui/checkbox";
import {Switch} from "@/registry/new-york-v4/ui/switch";
import {Textarea} from "@/registry/new-york-v4/ui/textarea";
import {Calendar} from "@/registry/new-york-v4/ui/calendar";


import {format} from "node:url";


interface MultiSelectFieldProps {
    field: FormColumnConfig
    value: any
    onChange?: (fieldId: string, value: any) => void
}

export function MultiSelectField({field, value = [], onChange}: MultiSelectFieldProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>(value)
    const [popoverOpen, setPopoverOpen] = useState(false)

    // Sync initial value once on mount
    useEffect(() => {
        setSelectedIds(value)
    }, [])

    const toggleOption = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        )
    }

    const handleClose = () => {
        setPopoverOpen(false)

        // Only call onChange if actually changed
        const prevSorted = [...value].sort()
        const currentSorted = [...selectedIds].sort()
        const changed =
            prevSorted.length !== currentSorted.length ||
            !prevSorted.every((v, i) => v === currentSorted[i])

        if (changed && field.accessorKey) {
            onChange?.(field.accessorKey, selectedIds)
        }
    }

    return (


            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                        role="combobox"
                    >
                        {selectedIds.length > 0 ? selectedIds.join(", ") : `Select ${field.label}`}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[220px] p-2 bg-background text-foreground shadow-lg rounded-lg">
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                        {field.options.map((opt) => (
                            <div
                                key={opt.id}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded-md"
                            >
                                <Checkbox
                                    checked={selectedIds.includes(opt.id)}
                                    onCheckedChange={() => toggleOption(opt.id)}
                                />
                                <Label className="text-sm font-normal cursor-pointer">
                                    {opt.label}
                                </Label>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-2">
                        <Button size="sm" variant="outline" onClick={handleClose}>
                            Done
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

    )
}

type FormFieldsProps<S extends ZodTypeAny> = {
    schema: S;

    item: z.infer<S>;   // <--
    baseUrl: string;
    mode: "create" | "update";
    rowConfig: FormColumnConfig[];
    onChange?: (
        fieldId: string,
        value: z.infer<S>[keyof z.infer<S>]
    ) => void;
};

export function FormFields<S extends ZodTypeAny>({
                                                     schema,
                                                     item,
                                                     mode,
                                                     rowConfig,
                                                     onChange,
                                                 }: FormFieldsProps<S>): JSX.Element {
    const rows: FormColumnConfig[][] = [];
    let tempRow: FormColumnConfig[] = [];

    type ItemType = z.infer<S>;

    console.log("create form with item " + JSON.stringify(item))


    // Split fields into rows
    rowConfig.forEach((field) => {

        // @ts-ignore
        if (["id", "createdAt", "updatedAt"].includes(field.accessorKey!)) return


        if (["actions", "select-all", "drag"].includes(field.type)) return


        if (field.width === "full") {
            if (tempRow.length) {
                rows.push(tempRow);
                tempRow = [];
            }
            rows.push([field]);
        } else {
            tempRow.push(field);
            if (tempRow.length === 2) {
                rows.push(tempRow);
                tempRow = [];
            }
        }
    });
    if (tempRow.length) {
        rows.push(tempRow)
    }
    return (
        <form className="flex flex-col gap-4">
            {rows.map((row, i) => (
                <div
                    key={i}
                    className={`grid gap-4 ${row.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}
                >
                    {row.map((field) => {
                        const value = item[field.accessorKey as keyof ItemType];

                        switch (field.type) {
                            case "select":
                                return (
                                    <div key={field.id} className="flex flex-col gap-3">
                                        <Label htmlFor={field.id}>{field.label}</Label>
                                        <Select
                                            value={String(value ?? "")}
                                            onValueChange={(val) => onChange?.(field.accessorKey, val)}
                                        >
                                            <SelectTrigger id={field.id} className="w-full">
                                                <SelectValue placeholder={`Select ${field.label}`}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map((opt) => (
                                                    <SelectItem key={opt.id} value={opt.id}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                );
                            case "multi-select":
                                return (
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor={field.id}>{field.label}</Label>

                                    <MultiSelectField
                                        key={field.id}
                                        field={field}
                                        value={value}
                                        onChange={onChange}
                                    />
                                    </div>
                                )
                            case "text-area":
                                return (
                                    <div key={field.id} className="flex flex-col gap-3">
                                        <Label htmlFor={field.id}>{field.label}</Label>
                                        <Textarea
                                            id={field.id}
                                            value={String(value ?? "")}
                                            onChange={(e) => onChange?.(field.accessorKey, e.target.value)}
                                            className="resize-none h-24"
                                        />
                                    </div>
                                );

                            case "file-upload":
                                return (
                                    <div key={field.id} className="flex flex-col gap-3">
                                        <Label htmlFor={field.id}>{field.label}</Label>
                                        <Input
                                            id={field.id}
                                            type="file"
                                            className="w-full"
                                            onChange={(e) => onChange?.(field.accessorKey, e.target.files?.[0])}
                                        />
                                    </div>
                                );

                            case "date-picker":
                                return (
                                    <div key={field.id} className="flex flex-col gap-3">
                                        <Label htmlFor={field.id}>{field.label}</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Input
                                                    readOnly
                                                    value={value ? format(new Date(String(value)), "PPP") : ""}
                                                    placeholder="Pick a date"
                                                    className="cursor-pointer"
                                                />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={value ? new Date(String(value)) : undefined}
                                                    onSelect={(d) => onChange?.(field.accessorKey, d)}
                                                    autoFocus={true}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                );
                            case "radio":
                                return (
                                    <div key={field.id} className="flex flex-col gap-3">
                                        <Label htmlFor={field.id}>{field.label}</Label>
                                        <Switch
                                            id={field.id}
                                            checked={Boolean(value)}
                                            onCheckedChange={(checked) => onChange?.(field.accessorKey, checked)}
                                        />
                                    </div>
                                );

                            default:
                                // return <div></div>
                                return (
                                    <div key={field.id} className="flex flex-col gap-3">
                                        <Label htmlFor={field.id}>{field.label}</Label>
                                        {field.accessorKey === "password" ? (
                                            <Input
                                                id={field.id}
                                                type="password"
                                                value={String(value ?? "")}
                                                onChange={(e) => onChange?.(field.accessorKey, e.target.value)}
                                            />
                                        ) : (
                                            <Input
                                                id={field.id}
                                                value={String(value ?? "")}
                                                onChange={(e) => onChange?.(field.accessorKey, e.target.value)}
                                            />
                                        )}
                                    </div>
                                );
                        }
                    })}
                </div>
            ))}
        </form>
    );
}

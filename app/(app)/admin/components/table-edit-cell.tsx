import {z, ZodTypeAny} from "zod";
// import {schema} from "@/app/(app)/admin/components/columns";
import {useIsMobile} from "@/registry/new-york-v4/hooks/use-mobile";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/registry/new-york-v4/ui/drawer";
import {Button} from "@/registry/new-york-v4/ui/button";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/registry/new-york-v4/ui/chart";
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import {Separator} from "@/registry/new-york-v4/ui/separator";
import {IconAlertTriangle, IconCircleCheckFilled, IconClock, IconLoader, IconX} from "@tabler/icons-react";
import {Input} from "@/registry/new-york-v4/ui/input";
import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@radix-ui/react-popover";
import {Label} from "@/registry/new-york-v4/ui/label";
import {FormColumnConfig} from "@/lib/schema";
import {Command, CommandGroup, CommandItem,} from "@/registry/new-york-v4/ui/command"
import {Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {Select,SelectContent, SelectTrigger,SelectValue,SelectItem } from "@/registry/new-york-v4/ui/select"
import {FormFields} from "@/app/(app)/admin/components/form-fields";

// 统一的 status 配置
export const STATUS_OPTIONS = [
    {
        value: "Done",
        label: "Done",
        icon: <IconCircleCheckFilled className="size-4 fill-green-500 dark:fill-green-400"/>,
        className: "text-green-600 dark:text-green-400 border-green-300 dark:border-green-600",
    },
    {
        value: "In Process",
        label: "In Process",
        icon: <IconLoader className="size-4 animate-spin text-blue-500"/>,
        className: "text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600",
    },
    {
        value: "Not Started",
        label: "Not Started",
        icon: <IconClock className="size-4 text-gray-500"/>,
        className: "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600",
    },
    {
        value: "Blocked",
        label: "Blocked",
        icon: <IconAlertTriangle className="size-4 text-yellow-500"/>,
        className: "text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600",
    },
    {
        value: "Error",
        label: "Error",
        icon: <IconX className="size-4 text-red-500"/>,
        className: "text-red-600 dark:text-red-400 border-red-300 dark:border-red-600",
    },
] as const

// // ✅ Infer schema type once
// export type ItemType = z.infer<typeof schema>;

// ✅ Chart data type
export interface ChartDatum {
    month: string;
    desktop: number;
    mobile: number;
}

// Chart data
export const chartData: ChartDatum[] = [
    {month: "January", desktop: 186, mobile: 80},
    {month: "February", desktop: 305, mobile: 200},
    {month: "March", desktop: 237, mobile: 120},
    {month: "April", desktop: 73, mobile: 190},
    {month: "May", desktop: 209, mobile: 130},
    {month: "June", desktop: 214, mobile: 140},
];

// ✅ Chart config for series
export const chartConfig: ChartConfig = {
    desktop: {label: "Desktop", color: "var(--color-desktop)"},
    mobile: {label: "Mobile", color: "var(--color-mobile)"},
};

// ✅ Row field config type
export type RowConfig =
    | {
    id: string;
    label: string;
    type: "input" | "text-area" | "file-upload" | "date-picker" | "radio";
    width: "full" | "half";
    options?: string[]; // only needed for select and radio
}
    | {
    id: string;
    label: string;
    type: "select";
    options: string[];
    width: "full" | "half";
};


// Form & table config


// ✅ Dynamic chart component
function DynamicChart(): JSX.Element {
    return (
        <ChartContainer config={chartConfig}>
            <AreaChart data={chartData} margin={{left: 0, right: 10}}>
                <CartesianGrid vertical={false}/>
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    hide
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot"/>}
                />
                {Object.keys(chartConfig).map((key) => (
                    <Area
                        key={key}
                        dataKey={key}
                        type="natural"
                        fill={chartConfig[key as keyof ChartConfig].color}
                        fillOpacity={0.5}
                        stroke={chartConfig[key as keyof ChartConfig].color}
                        stackId="a"
                    />
                ))}
            </AreaChart>
        </ChartContainer>
    );
}






type InferSchema<T extends ZodTypeAny> = z.infer<T>

export function TableCellViewer<T extends ZodTypeAny>({
                                                          schema,
                                                          baseUrl,
                                                          item,
                                                          rowConfig,
                                                          onSuccess,
                                                      }: {
    schema: T
    baseUrl: string
    item: InferSchema<T>
    rowConfig: FormColumnConfig[]
    onSuccess?: (updatedItem: InferSchema<T>) => void
}): JSX.Element {
    const isMobile = useIsMobile();
    const [formData, setFormData] = React.useState<any>(item)
    const [open, setOpen] = React.useState(false)

    const handleChange = (fieldId: string, value: any) => {
        setFormData((prev: any) => {
            const prevValue = prev[fieldId]
            const same =
                Array.isArray(prevValue) && Array.isArray(value)
                    ? prevValue.length === value.length &&
                    prevValue.every((v, i) => v === value[i])
                    : prevValue === value

            if (same) return prev
            return { ...prev, [fieldId]: value }
        })
    }

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${baseUrl}/${item.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Failed to update")
            const updated = await res.json()

            // ✅ notify
            alert("✅ Record updated successfully")

            // ✅ update parent
            onSuccess?.(updated)

            setOpen(false)
        } catch (err) {
            console.error("❌ Update error:", err)
            alert("Update failed!")
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="text-foreground w-fit px-0 text-left"
                    onClick={() => setFormData(item)} // reset when opening
                >
                    {item.id}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>Edit {item.id}</DrawerTitle>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {!isMobile && <><Separator /><Separator /></>}

                    <FormFields
                        baseUrl={baseUrl}
                        item={formData}
                        schema={schema}
                        mode="update"
                        rowConfig={rowConfig}
                        onChange={handleChange}
                    />
                </div>

                <DrawerFooter>
                    <Button onClick={handleSubmit}>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

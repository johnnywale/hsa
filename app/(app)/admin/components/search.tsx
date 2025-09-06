"use client"

import * as React from "react"
import {z, ZodTypeAny, ZodFirstPartyTypeKind, ZodOptional, ZodNullable} from "zod"
import {Button} from "@/registry/new-york-v4/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/registry/new-york-v4/ui/dropdown-menu"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/registry/new-york-v4/ui/select"
import {Input} from "@/registry/new-york-v4/ui/input"
import {IconChevronDown, IconFilter, IconX} from "@tabler/icons-react"

export type FilterItem = { field: string; op: string; value: string }

const operators = ["=", ">", "<", ">=", "<=", "!=", "like"]

type DynamicSearchDropdownProps<S extends ZodTypeAny> = {
    schema: S
    onChange?: (filters: FilterItem[]) => void
    onRowComplete?: (filter: FilterItem) => void
}

// unwrap optional/nullable
function unwrap(type: ZodTypeAny): ZodTypeAny {
    if (type instanceof ZodOptional || type instanceof ZodNullable) {
        return unwrap(type._def.innerType)
    }
    return type
}

export function DynamicSearchDropdown<S extends ZodTypeAny>({
                                                                schema,
                                                                onChange,
                                                                onRowComplete,
                                                            }: DynamicSearchDropdownProps<S>) {
    const schemaShape = (schema as any).shape
    const schemaFields = Object.keys(schemaShape)

    const [filters, setFilters] = React.useState<FilterItem[]>([
        {field: "", op: "=", value: ""},
    ])

    const updateFilter = (index: number, key: keyof FilterItem, value: string) => {
        setFilters((prev) => {
            console.group(`updateFilter - index ${index}, key: ${key}, value: ${value}`)
            console.log("Previous filters:", prev)

            // 复制数组并更新当前行
            const updated = [...prev]
            updated[index] = { ...updated[index], [key]: value }
            console.log("Updated row:", updated[index])

            // 判断最后一行是否完整
            const last = updated[updated.length - 1]
            const isLastComplete = !!(last.field && last.op && last.value)
            console.log("Last row:", last, "isLastComplete:", isLastComplete)

            // 如果最后一行填满了，触发完成事件 + 新增一行
            if (isLastComplete && index === updated.length - 1) {
                console.log("Trigger onRowComplete for:", last)
                onRowComplete?.(last) // ✅ 触发完成事件
                updated.push({ field: "", op: "=", value: "" })
                console.log("Added new empty row:", updated[updated.length - 1])
            }

            console.log("Updated filters array:", updated)
            console.groupEnd()
            return updated
        })
    }

    const removeFilter = (index: number) => {
        setFilters((prev) => prev.filter((_, i) => i !== index))
    }

    React.useEffect(() => {
        // 只返回完整的 filter
        const valid = filters.filter((f) => f.field && f.value)
        onChange?.(valid)
    }, [filters, onChange])

    const renderValueInput = (f: FilterItem, idx: number) => {
        if (!f.field) {
            return (
                <Input
                    value={f.value}
                    onChange={(e) => updateFilter(idx, "value", e.target.value)}
                    className="flex-1"
                    placeholder="Value"
                />
            )
        }

        const baseType = unwrap(schemaShape[f.field])
        switch (baseType._def.typeName as ZodFirstPartyTypeKind) {
            case z.ZodFirstPartyTypeKind.ZodNumber:
                return (
                    <Input
                        type="number"
                        value={f.value}
                        onChange={(e) => updateFilter(idx, "value", e.target.value)}
                        className="flex-1"
                        placeholder="Number"
                    />
                )
            case z.ZodFirstPartyTypeKind.ZodBoolean:
                return (
                    <Select value={f.value} onValueChange={(val) => updateFilter(idx, "value", val)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Boolean"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                    </Select>
                )
            case z.ZodFirstPartyTypeKind.ZodDate:
                return (
                    <Input
                        type="date"
                        value={f.value}
                        onChange={(e) => updateFilter(idx, "value", e.target.value)}
                        className="flex-1"
                    />
                )
            default:
                return (
                    <Input
                        value={f.value}
                        onChange={(e) => updateFilter(idx, "value", e.target.value)}
                        className="flex-1"
                        placeholder="Value"
                    />
                )
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconFilter/>
                    <span className="hidden lg:inline">Filters</span>
                    <span className="lg:hidden">Filter</span>
                    <IconChevronDown/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[420px] p-4 flex flex-col gap-3">
                {filters.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        {/* Field */}
                        <Select value={f.field} onValueChange={(val) => updateFilter(idx, "field", val)}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Field"/>
                            </SelectTrigger>
                            <SelectContent>
                                {schemaFields.map((field) => (
                                    <SelectItem key={field} value={field}>
                                        {field}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Operator */}
                        <Select value={f.op} onValueChange={(val) => updateFilter(idx, "op", val)}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {operators.map((op) => (
                                    <SelectItem key={op} value={op}>
                                        {op}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Value */}
                        {renderValueInput(f, idx)}

                        {idx !== filters.length - 1 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFilter(idx)}
                            >
                                <IconX className="w-4 h-4"/>
                            </Button>
                        )}
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

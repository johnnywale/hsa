import {useState} from "react";
import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/registry/new-york-v4/ui/drawer";
import {Button} from "@/registry/new-york-v4/ui/button";
import {IconPlus} from "@tabler/icons-react";
import {Separator} from "@/registry/new-york-v4/ui/separator";
import {FormFields} from "@/app/(app)/admin/components/form-fields";
import * as React from "react";

export default function CreateDrawer({isMobile, baseUrl, columns, onSuccess}: {
    isMobile: boolean;
    columns: any;
    baseUrl: string;
    onSuccess?: () => void
}) {
    const [formData, setFormData] = useState<any>({})
    const [open, setOpen] = useState(false) // control Drawer state

    const handleChange = (fieldId: string, value: any) => {
        console.log(fieldId)
        console.log(value)
        setFormData((prev) => {
            const prevValue = prev[fieldId]
            // deep compare arrays
            const same =
                Array.isArray(prevValue) && Array.isArray(value)
                    ? prevValue.length === value.length &&
                    prevValue.every((v, i) => v === value[i])
                    : prevValue === value

            if (same) return prev // no update if same
            return {...prev, [fieldId]: value}
        })
    }
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch(baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // standard JWT convention
                },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Failed to submit")
            const data = await res.json()
            setOpen(false) // ✅ close drawer on success
            onSuccess?.()
        } catch (err) {
            console.error("❌ Submit error:", err)
            alert("Submit failed!")
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconPlus/>
                    <span className="hidden lg:inline">New</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>New</DrawerTitle>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    {!isMobile && (
                        <>
                            <Separator/>
                            <Separator/>
                        </>
                    )}

                    <FormFields
                        rowConfig={columns}
                        mode="create"
                        item={formData}
                        onChange={handleChange}
                        baseUrl={baseUrl}/>
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

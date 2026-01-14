"use client"

import { useParams } from "next/navigation";
import { useGetLogicalDevices } from "./_hooks/use-get-logical-devices";
import { Label } from "@/shared/components/ui/label";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldContext } from "@/shared/tanstack-form/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/shared/components/ui/multi-select";
import { FieldError } from "@/shared/components/ui/field";

type Props = {
  initDeviceId: string;
}

const DevicePortSelector = ({ initDeviceId }: Props) => {
  const { projectId } = useParams<{ projectId: string }>()
  const field = useFieldContext<string[]>();
  const { data: devices = [] } = useGetLogicalDevices(projectId)
  const [rows, setRows] = useState<{
    deviceId: string;
    portIds: string[];
  }[]>([{ deviceId: initDeviceId, portIds: [] }])


  useEffect(() => {
    const allSelectedPortIds = rows.flatMap((row) => row.portIds);

    if (JSON.stringify(allSelectedPortIds) !== JSON.stringify(field.state.value)) {
      field.handleChange(allSelectedPortIds);
    }
  }, [rows])

  const getDeviceOptions = (currentDeviceId: string) => {
    const selectedDeviceSet = new Set(
      rows.map(row => row.deviceId).filter(id => id !== currentDeviceId)
    );

    return devices.filter(device => !selectedDeviceSet.has(device.id));
  };

  const getInterfaceOptions = (deviceId: string) => {
    const device = devices.find(device => device.id === deviceId)
    return device?.deviceInterfaces?.filter(intf => !intf.name.toLowerCase().includes("vlan")).map(intf => ({
      value: intf.id,
      label: intf.name
    })) || []
  }

  const handleAddRow = useCallback(() => {
    setRows(prev => [...prev, { deviceId: "", portIds: [] }])
  }, [])

  const handleDeviceChange = useCallback((index: number, deviceId: string) => {
    setRows(prev => {
      const newRows = [...prev];
      newRows[index].deviceId = deviceId;
      newRows[index].portIds = [];
      return newRows;
    })
  }, [])

  const handleDeleteRow = useCallback((index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleInterfaceChange = useCallback((index: number, portIds: string[]) => {
    setRows(prev => {
      const newRows = [...prev];
      newRows[index].portIds = portIds;
      return newRows;
    })
  }, [])

  const getRowError = (row: typeof rows[number], index: number) => {
    const isSubmitted = field.state.meta.errors.length > 0;

    if (!isSubmitted) return null;

    if (!row.deviceId) {
      return "Please select a device";
    }

    if (row.deviceId && row.portIds.length === 0) {
      return "Please select at least one interface";
    }

    return null;
  };

  const hasGlobalErrors = field.state.meta.errors.length > 0;

  return <div className="space-y-3">
    <Label>Connected Ports</Label>
    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">


      {rows.map((row, index) => {
        const isInitialRow = index === 0;
        const deviceOptions = getDeviceOptions(row.deviceId);
        const interfaceOptions = getInterfaceOptions(row.deviceId);
        const rowError = getRowError(row, index);

        return (
          <div key={index} className="space-y-1">
            <div className="flex gap-2 items-center">
              <Select value={row.deviceId} disabled={isInitialRow} onValueChange={(deviceId) => handleDeviceChange(index, deviceId)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Device" />
                </SelectTrigger>
                <SelectContent>
                  {deviceOptions.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1 max-w-[350px] w-full">
                <MultiSelect values={row.portIds} onValuesChange={(portIds) => handleInterfaceChange(index, portIds)}>
                  <MultiSelectTrigger className="w-full" disabled={!row.deviceId}>
                    <MultiSelectValue overflowBehavior="cutoff" placeholder="Select Interfaces" />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {interfaceOptions.map((intfOption) => (
                        <MultiSelectItem key={intfOption.value} value={intfOption.value}>
                          {intfOption.label}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
              </div>


              {!isInitialRow && (
                <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => handleDeleteRow(index)}>
                  <TrashIcon className="size-4 text-destructive" />
                </Button>
              )}
            </div>
            {rowError && <FieldError className="text-xs ml-1" errors={[{ message: rowError }]} />}
          </div>
        )
      })}
    </div>

    <Button type="button" variant="outline" size="sm" className="border-dashed w-full" onClick={handleAddRow} disabled={rows.length >= devices.length}>
      <PlusIcon className="mr-2 size-4" />
      Add Connected Device
    </Button>

    {/* {hasGlobalErrors && <FieldError errors={field.state.meta.errors} />} */}
  </div>;
};

export default DevicePortSelector;
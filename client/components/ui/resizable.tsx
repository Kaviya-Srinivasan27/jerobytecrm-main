"use client"

import * as React from "react"
import * as ResizablePrimitive from "react-resizable-panels"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

const PanelGroup = (ResizablePrimitive as any).PanelGroup
const Panel = (ResizablePrimitive as any).Panel
const PanelResizeHandle = (ResizablePrimitive as any).PanelResizeHandle

/* ---------------- Panel Group ---------------- */

const ResizablePanelGroup = ({
  className,
  ...props
}: any) => {
  return (
    <PanelGroup
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

/* ---------------- Panel ---------------- */

const ResizablePanel = (props: any) => {
  return <Panel {...props} />
}

/* ---------------- Handle ---------------- */

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: any) => {
  return (
    <PanelResizeHandle
      className={cn(
        "relative flex w-px items-center justify-center bg-border",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
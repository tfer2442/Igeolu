import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import './dialog.css'

const Dialog = DialogPrimitive.Root

const DialogContent = React.forwardRef(({ children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <div className="dialog-backdrop">
      <div className="dialog-overlay" aria-hidden="true" />
      <div className="dialog-container">
        <div className="dialog-wrapper">
          <DialogPrimitive.Content
            ref={ref}
            className="dialog-content"
            {...props}
          >
            {children}
          </DialogPrimitive.Content>
        </div>
      </div>
    </div>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}) => (
  <div
    className="dialog-header"
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className="dialog-title"
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className="dialog-description"
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
}
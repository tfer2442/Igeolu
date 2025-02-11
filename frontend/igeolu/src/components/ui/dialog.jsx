// src/components/ui/dialog.jsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import PropTypes from 'prop-types'
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

DialogContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

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

DialogHeader.propTypes = {
  className: PropTypes.string
}

DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className="dialog-title"
    {...props}
  />
))

DialogTitle.propTypes = {
  className: PropTypes.string
}

DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className="dialog-description"
    {...props}
  />
))

DialogDescription.propTypes = {
  className: PropTypes.string
}

DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
}

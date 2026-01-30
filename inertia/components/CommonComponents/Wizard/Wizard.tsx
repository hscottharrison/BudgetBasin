import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { cn } from '~/lib/utils'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

export interface WizardStep {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  content: React.ReactNode
}

export interface WizardProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  steps: WizardStep[]
  onComplete?: (completedSteps: Record<string, boolean>) => void
  initialStep?: string
}

export default function Wizard({
  isOpen,
  onClose,
  title,
  description,
  steps,
  onComplete,
  initialStep,
}: WizardProps) {
  const [currentStepId, setCurrentStepId] = useState<string>(initialStep || steps[0]?.id)
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({})

  const currentStepIndex = steps.findIndex((s) => s.id === currentStepId)
  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const goToStep = (stepId: string) => {
    setCurrentStepId(stepId)
  }

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStepId(steps[currentStepIndex + 1].id)
    }
  }

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepId(steps[currentStepIndex - 1].id)
    }
  }

  const toggleStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }))
  }

  const handleClose = () => {
    if (onComplete) {
      onComplete(completedSteps)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex gap-6 px-6 pb-6 min-h-[400px]">
          {/* Sidebar - Step Indicators */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-1">
              {steps.map((step, index) => {
                const isComplete = completedSteps[step.id]
                const isCurrent = step.id === currentStepId
                const isLastStepInList = index === steps.length - 1
                const nextStep = steps[index + 1]

                return (
                  <div key={step.id} className="relative">
                    {/* Step Item */}
                    <button
                      onClick={() => goToStep(step.id)}
                      className={cn(
                        'w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left',
                        isCurrent && 'bg-primary/10',
                        !isCurrent && 'hover:bg-muted/50'
                      )}
                    >
                      {/* Circle Indicator */}
                      <div
                        className={cn(
                          'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all flex-shrink-0',
                          isComplete && 'bg-green-600 border-green-600',
                          isCurrent && !isComplete && 'border-primary bg-primary/10',
                          !isCurrent && !isComplete && 'border-muted-foreground/30'
                        )}
                      >
                        {isComplete ? (
                          <Check size={16} className="text-white" />
                        ) : (
                          <div className="text-xs font-semibold text-muted-foreground">
                            {step.icon || index + 1}
                          </div>
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={cn(
                            'text-sm font-semibold',
                            isCurrent && 'text-primary',
                            isComplete && 'text-green-600',
                            !isCurrent && !isComplete && 'text-muted-foreground'
                          )}
                        >
                          {step.title}
                        </div>
                        {step.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {step.description}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Connecting Line */}
                    {!isLastStepInList && (
                      <div className="relative h-4 flex justify-center">
                        <div
                          className={cn(
                            'w-0.5 h-full transition-all',
                            completedSteps[step.id] && completedSteps[nextStep?.id]
                              ? 'bg-green-600'
                              : 'bg-muted-foreground/20'
                          )}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-auto">
            {/* Step Content */}
            <div className="flex-1 overflow-auto pr-2">
              {currentStep?.content}
            </div>

            {/* Footer Actions */}
            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
              {/* Mark Complete Button */}
              <Button
                variant={completedSteps[currentStepId] ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleStepComplete(currentStepId)}
              >
                {completedSteps[currentStepId] ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Completed
                  </>
                ) : (
                  'Mark as complete'
                )}
              </Button>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousStep}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </Button>
                )}
                {!isLastStep && (
                  <Button
                    size="sm"
                    onClick={goToNextStep}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
